#!/usr/bin/env node
/**
 * smol-scout.js
 *
 * Fetches the latest smol.ai (AI News) newsletter:
 * 1. Gets issue list from RSS
 * 2. Fetches full article content from the web page
 * 3. Saves to data/, creates NEW_SMOL_DATA flag for Rook
 *
 * Usage:
 *   node smol-scout.js              # fetch latest issue
 *   node smol-scout.js --sync FILE  # sync a report to tracker
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const REPORTS_DIR = path.join(__dirname, 'reports');
const FLAG_FILE = path.join(__dirname, 'NEW_SMOL_DATA');
const RSS_URL = 'https://news.smol.ai/rss.xml';

// --- HTTP helper ---
function fetch(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ClawdbotSmolScout/1.0)' },
      timeout: 20000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return fetch(next, maxRedirects - 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

// --- Parse RSS (just to get latest issue URL) ---
function parseRSS(xml) {
  const items = [];
  const itemBlocks = xml.split('<item>').slice(1);

  for (const block of itemBlocks.slice(0, 10)) { // only check last 10
    const title = extractXmlTag(block, 'title') || '';
    const link = extractXmlTag(block, 'link') || '';
    const pubDate = extractXmlTag(block, 'pubDate') || '';
    items.push({ title, link, pubDate });
  }
  return items;
}

function extractXmlTag(xml, tag) {
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'));
  if (cdataMatch) return cdataMatch[1].trim();
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : null;
}

// --- Fetch full article from web page ---
async function fetchFullArticle(url) {
  console.log(`Fetching full article: ${url}`);
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Article fetch failed: ${res.status}`);
  }

  const html = res.body;

  // Substack article content is in <div class="body markup"> or similar
  // Try multiple selectors
  let content = '';

  // Try to extract the main article body
  const bodyMatch = html.match(/<div[^>]*class="[^"]*body markup[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<div[^>]*class="[^"]*footer/i)
    || html.match(/<div[^>]*class="[^"]*body markup[^"]*"[^>]*>([\s\S]*?)(?:<div[^>]*class="[^"]*subscription-widget|<div[^>]*class="[^"]*post-footer)/i)
    || html.match(/<div[^>]*class="[^"]*available-content[^"]*"[^>]*>([\s\S]*?)(?:<div[^>]*class="[^"]*subscription-widget|<div[^>]*class="[^"]*post-footer)/i);

  if (bodyMatch) {
    content = htmlToText(bodyMatch[1]);
  } else {
    // Fallback: grab everything between article tags
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      content = htmlToText(articleMatch[1]);
    } else {
      // Last resort: grab the biggest text block
      content = htmlToText(html);
    }
  }

  return content;
}

function htmlToText(html) {
  if (!html) return '';
  return html
    // Preserve links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, url, text) => {
      const cleanText = text.replace(/<[^>]+>/g, '').trim();
      if (url.startsWith('http') && cleanText) return `${cleanText} (${url})`;
      return cleanText;
    })
    // Headers to markdown
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, text) =>
      '\n' + '#'.repeat(parseInt(level)) + ' ' + text.replace(/<[^>]+>/g, '').trim() + '\n')
    // Lists
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<[ou]l[^>]*>/gi, '\n')
    .replace(/<\/[ou]l>/gi, '\n')
    // Bold/italic
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
    // Blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, text) =>
      '\n> ' + text.replace(/<[^>]+>/g, '').trim() + '\n')
    // Paragraphs and breaks
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    // Images — keep alt text
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, '[Image: $1]')
    .replace(/<img[^>]*>/gi, '')
    // Strip scripts, styles, nav
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    // Clean whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// --- Dedup ---
function alreadyProcessed(title) {
  const processedFile = path.join(DATA_DIR, 'processed.json');
  try {
    const processed = JSON.parse(fs.readFileSync(processedFile, 'utf8'));
    return processed.includes(title);
  } catch (e) { return false; }
}

function markProcessed(title) {
  const processedFile = path.join(DATA_DIR, 'processed.json');
  let processed = [];
  try { processed = JSON.parse(fs.readFileSync(processedFile, 'utf8')); } catch (e) {}
  processed.push(title);
  if (processed.length > 50) processed = processed.slice(-50);
  fs.writeFileSync(processedFile, JSON.stringify(processed, null, 2));
}

// --- Main ---
async function main() {
  if (process.argv.includes('--sync')) {
    const fileIdx = process.argv.indexOf('--sync') + 1;
    const filePath = process.argv[fileIdx];
    if (!filePath) { console.error('Usage: node smol-scout.js --sync <file>'); process.exit(1); }
    await syncToTracker(filePath);
    return;
  }

  console.log('Smol Scout — fetching latest AI News from smol.ai...\n');

  for (const dir of [DATA_DIR, REPORTS_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // 1. Fetch RSS for issue list
  let rssData;
  try {
    const res = await fetch(RSS_URL);
    if (res.status !== 200) throw new Error(`RSS status ${res.status}`);
    rssData = res.body;
  } catch (err) {
    console.error('Failed to fetch RSS:', err.message);
    process.exit(1);
  }

  const items = parseRSS(rssData);
  if (items.length === 0) {
    console.log('No items in RSS feed');
    process.exit(0);
  }

  console.log(`Found ${items.length} recent issues`);

  // 2. Find latest unprocessed
  const latest = items.find(item => !alreadyProcessed(item.title));
  if (!latest) {
    console.log('All recent issues already processed.');
    process.exit(0);
  }

  console.log(`\nNew issue: "${latest.title}"`);
  console.log(`Published: ${latest.pubDate}`);
  console.log(`URL: ${latest.link}`);

  // 3. Fetch full article content
  let content;
  try {
    content = await fetchFullArticle(latest.link);
  } catch (err) {
    console.error('Failed to fetch full article:', err.message);
    process.exit(1);
  }

  console.log(`Full content: ${content.length} chars`);

  // Truncate if absurdly long (keep first 80K chars — well within LLM context)
  if (content.length > 80000) {
    content = content.slice(0, 80000) + '\n\n[... truncated at 80K chars ...]';
  }

  // 4. Save
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dataFile = path.join(DATA_DIR, `smol-${timestamp}.json`);
  fs.writeFileSync(dataFile, JSON.stringify({
    title: latest.title,
    link: latest.link,
    pubDate: latest.pubDate,
    fetchedAt: new Date().toISOString(),
    contentLength: content.length,
    content,
  }, null, 2));

  console.log(`Data saved: ${dataFile}`);

  // 5. Create flag for Rook
  fs.writeFileSync(FLAG_FILE, dataFile);
  console.log(`Flag created: ${FLAG_FILE}`);
  console.log('\nRook will process on next heartbeat with Vibe Architect prompt.');

  markProcessed(latest.title);
}

async function syncToTracker(reportFile) {
  const syncScript = path.join('/root/.openclaw/workspace/twitter-scout', 'sync-to-tracker.js');
  if (fs.existsSync(syncScript) && process.env.SCOUT_TRACKER_URL) {
    const { execSync } = require('child_process');
    console.log(`Syncing ${path.basename(reportFile)} to tracker...`);
    try {
      execSync(`node "${syncScript}" "${reportFile}"`, { stdio: 'inherit', timeout: 30000 });
    } catch (err) {
      console.error('Sync failed:', err.message);
    }
  } else {
    console.log('Tracker not configured. Skipping sync.');
  }
}

main().catch(err => {
  console.error('Smol Scout error:', err.message);
  process.exit(1);
});
