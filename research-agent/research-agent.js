#!/usr/bin/env node
/**
 * research-agent.js — Overnight Research Agent
 *
 * Browses Reddit + HN with LLM-guided decisions.
 * Uses browse.js for article fetching, Reddit/HN JSON APIs for listings.
 * LLM calls via Synthetic API (Anthropic messages format, free models).
 *
 * Usage:
 *   node research-agent.js                   # Full overnight run
 *   node research-agent.js --quick           # Quick test (3 subs, 50 call budget)
 *   node research-agent.js --dry-run         # Fetch only, no LLM calls
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const BASE_DIR = path.dirname(process.argv[1]);
const CONFIG_PATH = path.join(BASE_DIR, 'config.json');
const REPORTS_DIR = path.join(BASE_DIR, 'reports');
const DATA_DIR = path.join(BASE_DIR, 'data');
const BROWSE_JS = '/root/.openclaw/workspace/browse.js';
const AUTH_FILE = '/root/.openclaw/agents/main/agent/auth-profiles.json';

// Load config
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Load Synthetic API key from OpenClaw auth
const authProfiles = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
const SYNTHETIC_KEY = authProfiles.profiles['synthetic:default'].key;

// CLI flags
const QUICK = process.argv.includes('--quick');
const DRY_RUN = process.argv.includes('--dry-run');

// Limits
const MAX_LLM_CALLS = QUICK ? 50 : (config.max_llm_calls || 180);
const MAX_THREADS = QUICK ? 2 : (config.max_threads_per_sub || 4);
const MAX_OUTBOUND = config.max_outbound_links || 2;
const LLM_WAIT = config.wait_between_llm_ms || 3000;
const FETCH_WAIT = config.wait_between_fetch_ms || 2000;
const SUBS = QUICK ? config.subreddits.slice(0, 3) : config.subreddits;

let llmCalls = 0;
const notes = []; // Collected research notes

// ─── HTTP helpers ───────────────────────────────────────────────

function httpGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/json',
      ...headers
    };
    const req = mod.get(url, { headers: defaultHeaders }, (res) => {
      if (res.statusCode === 429) {
        resolve({ error: 'rate_limited', status: 429 });
        return;
      }
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpGet(res.headers.location, headers).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ data, status: res.statusCode }));
    });
    req.on('error', e => reject(e));
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Page fetching (uses browse.js) ────────────────────────────

function fetchPage(url) {
  try {
    return execSync(
      `node ${BROWSE_JS} "${url}" --no-cookies --timeout 30000 --wait 3000`,
      { timeout: 45000, maxBuffer: 2 * 1024 * 1024 }
    ).toString().trim();
  } catch (e) {
    return `[Fetch error: ${e.message.split('\n')[0]}]`;
  }
}

// ─── LLM (Synthetic API — Anthropic messages format) ───────────

async function llm(prompt, system) {
  if (llmCalls >= MAX_LLM_CALLS) {
    log('  ⚠ LLM budget exhausted');
    return '[budget exhausted]';
  }
  if (DRY_RUN) {
    llmCalls++;
    return '[dry-run: no LLM call]';
  }
  llmCalls++;

  const messages = [];
  if (system) messages.push({ role: 'user', content: system });
  if (system) messages.push({ role: 'assistant', content: 'Understood. I will follow those instructions.' });
  messages.push({ role: 'user', content: prompt });

  const body = JSON.stringify({
    model: config.model,
    max_tokens: 2000,
    messages
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.synthetic.new',
      path: '/anthropic/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SYNTHETIC_KEY,
        'anthropic-version': '2023-06-01'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          // Handle reasoning models (thinking + text blocks)
          if (parsed.content && Array.isArray(parsed.content)) {
            const textBlock = parsed.content.find(b => b.type === 'text');
            if (textBlock) { resolve(textBlock.text); return; }
            // If only thinking blocks, extract from thinking
            const thinkBlock = parsed.content.find(b => b.type === 'thinking');
            if (thinkBlock) { resolve(thinkBlock.thinking); return; }
            resolve(parsed.content[0].text || parsed.content[0].thinking || '[empty]');
          } else if (parsed.error) {
            log(`  ⚠ LLM error: ${parsed.error.message || JSON.stringify(parsed.error)}`);
            resolve('[error]');
          } else {
            resolve('[no response]');
          }
        } catch (e) {
          resolve('[parse error]');
        }
      });
    });
    req.on('error', e => resolve(`[request error: ${e.message}]`));
    req.setTimeout(60000, () => { req.destroy(); resolve('[timeout]'); });
    req.write(body);
    req.end();
  });
}

// ─── Logging ────────────────────────────────────────────────────

const logLines = [];
function log(msg) {
  const line = `[${new Date().toISOString().slice(11, 19)}] ${msg}`;
  console.log(line);
  logLines.push(line);
}

// ─── Reddit ─────────────────────────────────────────────────────

async function getSubredditPosts(sub, sort = 'hot') {
  // Use browse.js to fetch Reddit (their JSON API blocks server requests)
  const url = `https://old.reddit.com/r/${sub}/${sort}`;
  try {
    const html = execSync(
      `node ${BROWSE_JS} "${url}" --no-cookies --timeout 30000 --wait 3000`,
      { timeout: 45000, maxBuffer: 2 * 1024 * 1024 }
    ).toString().trim();

    if (!html || html.length < 100) return [];

    // Parse posts from old.reddit text output (markdown-ish format from browse.js)
    // We'll send the page to LLM to extract structured post data
    // But to save LLM calls, do simple regex extraction first
    const posts = [];
    const lines = html.split('\n');
    let currentPost = null;

    for (const line of lines) {
      // old.reddit browse output has patterns like: "Title (domain.com)" and vote/comment counts
      const titleMatch = line.match(/^\s*(.{10,200})\s*\(([^)]+)\)\s*$/);
      const scoreMatch = line.match(/(\d+)\s*points?/i);
      const commentMatch = line.match(/(\d+)\s*comments?/i);

      if (titleMatch && !line.includes('submitted') && !line.includes('ago')) {
        if (currentPost && currentPost.title) posts.push(currentPost);
        currentPost = { title: titleMatch[1].trim(), domain: titleMatch[2], score: 0, comments: 0, selftext: '' };
      }
      if (currentPost && scoreMatch) currentPost.score = parseInt(scoreMatch[1]);
      if (currentPost && commentMatch) currentPost.comments = parseInt(commentMatch[1]);
    }
    if (currentPost && currentPost.title) posts.push(currentPost);

    // If regex parsing got nothing, fall back to sending raw text to LLM
    if (posts.length === 0 && html.length > 200) {
      // Return the raw text as a single "post" for LLM to parse
      return [{ title: '[raw page]', rawText: html.slice(0, 4000), score: 0, comments: 0 }];
    }

    return posts.map(p => ({
      ...p,
      url: `https://old.reddit.com/r/${sub}`,
      permalink: `https://old.reddit.com/r/${sub}`
    }));
  } catch (e) {
    log(`  Error fetching r/${sub}: ${e.message.split('\n')[0]}`);
    return [];
  }
}

async function getThreadComments(permalink) {
  const url = permalink.replace('www.reddit.com', 'old.reddit.com').replace(/\/$/, '') + '.json?limit=15&sort=best';
  try {
    const res = await httpGet(url);
    if (res.error) return '';
    const data = JSON.parse(res.data);
    if (!Array.isArray(data) || data.length < 2) return '';
    return data[1].data.children
      .filter(c => c.kind === 't1')
      .slice(0, 10)
      .map(c => `[${c.data.author} +${c.data.score}]: ${(c.data.body || '').slice(0, 400)}`)
      .join('\n\n');
  } catch (e) {
    return '';
  }
}

async function researchSubreddit(sub) {
  log(`\n📡 r/${sub}`);

  // Use RSS feed via curl (Reddit blocks Node https but allows curl with browser UA)
  const rssUrl = `https://www.reddit.com/r/${sub}/.rss`;
  let rssXml;
  try {
    rssXml = execSync(
      `curl -s -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36" "${rssUrl}"`,
      { timeout: 20000, maxBuffer: 2 * 1024 * 1024 }
    ).toString();
  } catch (e) {
    log(`  Error fetching RSS: ${e.message.split('\n')[0]}`);
    return;
  }

  if (!rssXml || rssXml.length < 200) {
    log(`  RSS too short (${(rssXml || '').length} chars)`);
    return;
  }
  if (rssXml.includes('blocked') || rssXml.includes('whoa there')) {
    log('  Reddit blocked request');
    return;
  }

  // Parse RSS entries (simple regex — RSS is XML)
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(rssXml)) !== null) {
    const entry = match[1];
    const title = (entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (entry.match(/<link href="([^"]*)"/) || [])[1] || '';
    const content = (entry.match(/<content type="html">([\s\S]*?)<\/content>/) || [])[1] || '';
    // Decode HTML entities
    const cleanContent = content
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (title) entries.push({ title, link, content: cleanContent.slice(0, 400) });
  }

  if (entries.length === 0) { log('  No entries'); return; }
  log(`  ${entries.length} posts from RSS`);

  // Build listing for LLM
  const listing = entries.slice(0, 25).map((e, i) =>
    `${i + 1}. ${e.title}${e.content ? '\n   ' + e.content.slice(0, 150) + '...' : ''}`
  ).join('\n');

  await wait(LLM_WAIT);
  const analysis = await llm(
    `Recent posts from r/${sub}:\n\n${listing}\n\nTopics I care about: ${config.topics.join(', ')}\n\nAnalyze and extract:\n1. **Most interesting posts** (up to ${MAX_THREADS}) — title and why it matters\n2. **Key themes** — what is the community focused on?\n3. **Tools/repos/products** mentioned\n4. **Links worth following** (external URLs, max 3)\n\nIf nothing relevant, say NONE. Be concise.`,
    'You are a research assistant. Extract signal, skip noise.'
  );

  if (!analysis || analysis.includes('NONE') || analysis.startsWith('[')) {
    log('  Nothing relevant');
    return;
  }

  log(`  Found insights`);
  notes.push({
    source: `r/${sub}`,
    title: `r/${sub} overview`,
    url: `https://reddit.com/r/${sub}`,
    analysis
  });

  // Follow outbound links
  const outUrls = (analysis.match(/https?:\/\/[^\s)>\]"]+/g) || [])
    .filter(u => !u.includes('reddit.com') && !u.includes('imgur.') && !u.includes('i.redd.it') && !u.includes('v.redd.it'))
    .slice(0, MAX_OUTBOUND);

  for (const link of outUrls) {
    if (llmCalls >= MAX_LLM_CALLS - 5) break;

    log(`    🔗 ${link.slice(0, 60)}`);
    await wait(FETCH_WAIT);
    const page = fetchPage(link);

    if (page.length > 300 && !page.startsWith('[Fetch error')) {
      await wait(LLM_WAIT);
      const linkNote = await llm(
        `Followed link from r/${sub}.\n\nURL: ${link}\n\nContent:\n${page.slice(0, 3000)}\n\nSummarize: what is this, and is it useful? 2-3 sentences max.`,
        'Be concise.'
      );
      notes.push({
        source: `r/${sub} → link`,
        title: link,
        url: link,
        analysis: linkNote
      });
    }
  }
}

// ─── Hacker News ────────────────────────────────────────────────

async function researchHN() {
  log('\n📡 Hacker News');
  try {
    const res = await httpGet('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = JSON.parse(res.data).slice(0, 30);

    const posts = [];
    for (const id of ids) {
      await wait(200); // HN API is fast, light delay
      const itemRes = await httpGet(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const item = JSON.parse(itemRes.data);
      if (item && item.title) {
        posts.push({
          title: item.title,
          score: item.score || 0,
          comments: item.descendants || 0,
          url: item.url || `https://news.ycombinator.com/item?id=${id}`,
          hn_url: `https://news.ycombinator.com/item?id=${id}`
        });
      }
    }

    if (!posts.length) { log('  No posts'); return; }

    const listing = posts.map((p, i) =>
      `${i + 1}. [${p.score}↑ ${p.comments}💬] ${p.title}`
    ).join('\n');

    await wait(LLM_WAIT);
    const picks = await llm(
      `Top Hacker News posts:\n\n${listing}\n\nTopics I care about: ${config.topics.join(', ')}\n\nWhich are worth reading? Numbers only, max 5. Say NONE if nothing fits.`,
      'Be selective. Only pick posts with genuine relevance.'
    );

    if (!picks || picks.includes('NONE') || picks.startsWith('[')) {
      log('  Nothing relevant');
      return;
    }

    const selected = (picks.match(/\d+/g) || []).map(Number).filter(n => n >= 1 && n <= posts.length);
    log(`  Selected: ${selected.join(', ')}`);

    for (const num of selected.slice(0, 5)) {
      if (llmCalls >= MAX_LLM_CALLS - 5) break;
      const post = posts[num - 1];
      if (!post) continue;

      log(`  📖 ${post.title.slice(0, 65)}`);
      await wait(FETCH_WAIT);
      const page = fetchPage(post.url);

      await wait(LLM_WAIT);
      const analysis = await llm(
        `HN post (${post.score} pts, ${post.comments} comments): ${post.title}\nURL: ${post.url}\n\nArticle:\n${page.slice(0, 3000)}\n\nKey takeaways? 2-3 sentences.`,
        'Be concise and actionable.'
      );

      notes.push({
        source: 'Hacker News',
        title: post.title,
        url: post.url,
        hn_url: post.hn_url,
        score: post.score,
        analysis
      });
    }
  } catch (e) {
    log(`  HN error: ${e.message}`);
  }
}

// ─── Report ─────────────────────────────────────────────────────

async function writeReport(startTime) {
  const minutes = ((Date.now() - startTime) / 60000).toFixed(1);
  const date = new Date().toISOString().split('T')[0];

  if (!notes.length) {
    const report = `# Research Report — ${date}\n\nNo significant findings. All sources checked.\n\nDuration: ${minutes}min | LLM calls: ${llmCalls}/${MAX_LLM_CALLS}`;
    fs.writeFileSync(path.join(REPORTS_DIR, `research-${date}.md`), report);
    log(`\nEmpty report saved.`);
    return;
  }

  // Build findings summary for final LLM pass
  let raw = '';
  for (const n of notes) {
    raw += `\n### [${n.source}] ${n.title}\n${n.analysis}\n`;
  }

  await wait(LLM_WAIT);
  const briefing = await llm(
    `Tonight's research findings:\n${raw.slice(0, 6000)}\n\nWrite a morning briefing with:\n1. **Top Findings** (3-5 most important discoveries)\n2. **Tools & Repos Worth Trying** (if any)\n3. **Interesting Discussions** (with links)\n4. **Action Items** (specific next steps)\n\nBe concise and actionable. This is read over coffee.`,
    'You write sharp, concise research briefings for a technical founder running AI agents on cloud infrastructure.'
  );

  const report = `# Research Report — ${date}

**Duration:** ${minutes} min | **LLM calls:** ${llmCalls}/${MAX_LLM_CALLS} | **Notes:** ${notes.length}

${briefing}

---

## All Findings

${notes.map(n => `### [${n.source}] ${n.title}\n${n.url}\n${n.analysis}\n`).join('\n')}
`;

  const reportPath = path.join(REPORTS_DIR, `research-${date}.md`);
  fs.writeFileSync(reportPath, report);
  log(`\n📄 Report: ${reportPath}`);

  // Save raw data
  const dataPath = path.join(DATA_DIR, `research-${date}.json`);
  fs.writeFileSync(dataPath, JSON.stringify({
    date, duration_min: parseFloat(minutes), llm_calls: llmCalls,
    notes, log: logLines
  }, null, 2));
  log(`📦 Data: ${dataPath}`);
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  log('=== Research Agent ===');
  log(`Mode: ${QUICK ? 'QUICK' : DRY_RUN ? 'DRY-RUN' : 'FULL'}`);
  log(`Model: ${config.model}`);
  log(`Budget: ${MAX_LLM_CALLS} LLM calls`);
  log(`Subreddits: ${SUBS.join(', ')}`);
  log(`Topics: ${config.topics.join(', ')}`);

  const startTime = Date.now();

  // Research each subreddit
  for (const sub of SUBS) {
    if (llmCalls >= MAX_LLM_CALLS - 10) {
      log('\n⚠ Budget low, stopping research');
      break;
    }
    try {
      await researchSubreddit(sub);
    } catch (e) {
      log(`  Error on r/${sub}: ${e.message}`);
    }
    await wait(FETCH_WAIT);
  }

  // Research HN
  if (config.include_hn && llmCalls < MAX_LLM_CALLS - 10) {
    try {
      await researchHN();
    } catch (e) {
      log(`  HN error: ${e.message}`);
    }
  }

  // Write report
  await writeReport(startTime);

  log(`\n=== Done! ${llmCalls} LLM calls, ${((Date.now() - startTime) / 60000).toFixed(1)} min ===`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
