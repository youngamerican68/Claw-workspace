#!/usr/bin/env node
/**
 * Twitter Scout Analyzer
 * Generates AI-powered reports in the user's preferred format
 */

const fs = require('fs');
const path = require('path');

// Load tweet data and generate analysis
async function analyzeTweets(tweetFile) {
  const tweets = JSON.parse(fs.readFileSync(tweetFile, 'utf8'));
  const timestamp = path.basename(tweetFile, '.json').replace('tweets-', '');
  
  // Filter out noResults entries
  const validTweets = tweets.filter(t => !t.noResults && t.text);
  
  if (validTweets.length === 0) {
    console.log('No valid tweets to analyze');
    return;
  }

  console.log(`Analyzing ${validTweets.length} tweets...`);

  // Group by author for context
  const byAuthor = {};
  validTweets.forEach(tweet => {
    const author = tweet.author?.userName || 'unknown';
    if (!byAuthor[author]) byAuthor[author] = [];
    byAuthor[author].push(tweet);
  });

  // Build the report structure
  const report = {
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    findings: [],
    summary: []
  };

  // Analyze each tweet for business potential
  for (let i = 0; i < validTweets.length; i++) {
    const tweet = validTweets[i];
    const analysis = await analyzeTweet(tweet, i + 1);
    if (analysis) {
      report.findings.push(analysis);
    }
  }

  // Generate summary table
  report.summary = report.findings.map(f => ({
    find: f.title,
    verdict: f.verdict,
    priority: f.priority
  }));

  // Save structured report for AI enhancement
  const reportPath = path.join('/root/.openclaw/workspace/twitter-scout/reports', `analysis-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`Analysis saved: ${reportPath}`);
  
  // Generate human-readable report
  const readableReport = generateReadableReport(report);
  const readablePath = path.join('/root/.openclaw/workspace/twitter-scout/reports', `scout-report-${timestamp}.md`);
  fs.writeFileSync(readablePath, readableReport);
  
  console.log(`Readable report saved: ${readablePath}`);
  
  // Sync to Scout Tracker dashboard
  try {
    const { execSync } = require("child_process");
    execSync(`node /root/.openclaw/workspace/twitter-scout/sync-to-tracker.js ${readablePath}`, { stdio: "inherit", timeout: 30000 });
  } catch (err) {
    console.error("Scout Tracker sync failed:", err.message);
  }

  return report;
}

// Analyze a single tweet for business potential
async function analyzeTweet(tweet, number) {
  const text = tweet.text || '';
  const url = tweet.url || `https://twitter.com/${tweet.author?.userName}/status/${tweet.id}`;
  const author = tweet.author?.userName || 'unknown';
  const displayName = tweet.author?.name || author;
  
  // Basic engagement metrics
  const engagement = {
    likes: tweet.likeCount || 0,
    reposts: tweet.retweetCount || 0,
    replies: tweet.replyCount || 0,
    views: tweet.viewCount || 0
  };

  // Detect business signals
  const businessSignals = detectBusinessSignals(text);
  
  if (!businessSignals.found) {
    return null; // Skip non-business tweets
  }

  // Determine category and emoji
  const category = categorizeTweet(text, businessSignals);
  
  return {
    number,
    emoji: category.emoji,
    title: businessSignals.title || truncate(text, 60),
    link: url,
    author: `@${author}`,
    authorName: displayName,
    engagement,
    whatItIs: businessSignals.whatItIs,
    howItWorks: businessSignals.howItWorks,
    opinion: businessSignals.opinion,
    opportunity: businessSignals.opportunity,
    difficulty: businessSignals.difficulty,
    priority: businessSignals.priority,
    verdict: businessSignals.verdict
  };
}

// Detect business signals in tweet text
function detectBusinessSignals(text) {
  const lower = text.toLowerCase();
  
  // Keywords that indicate business opportunities
  const signals = {
    launch: /launch|launched|shipping|shipped|released|beta|alpha/i,
    revenue: /\$\d+[k,m]?\s*(mrr|arr|revenue)|\d+[k,m]?\s*users|\d+[k,m]?\s*customers/i,
    aiTool: /ai\s*(tool|app|platform)|gpt|claude|llm|agent|automation/i,
    newTech: /new\s*(framework|library|model|api)|introducing|announcing/i,
    problem: /problem|pain\s*point|frustrating|annoying|wish\s*there|someone\s*should/i,
    trend: /trend|hot|everyone.*talking|blowing\s*up|viral/i
  };

  let found = false;
  let category = 'general';
  
  for (const [key, regex] of Object.entries(signals)) {
    if (regex.test(lower)) {
      found = true;
      category = key;
      break;
    }
  }

  if (!found) {
    return { found: false };
  }

  // Generate analysis based on category
  return generateAnalysis(text, category);
}

// Generate analysis based on tweet category
function generateAnalysis(text, category) {
  const analyses = {
    launch: {
      title: extractProductName(text) || 'New Product Launch',
      emoji: '🚀',
      whatItIs: 'A new product or feature has been launched',
      howItWorks: 'Recently released to the public, likely gaining initial traction',
      opinion: 'Early launches often indicate market gaps. First-mover advantage possible.',
      opportunity: 'Build complementary tools, integrations, or alternatives',
      difficulty: 'Medium - requires understanding the product and market',
      priority: '📋 Add to backlog',
      verdict: 'Monitor for traction'
    },
    revenue: {
      title: 'Revenue/Growth Signal',
      emoji: '💰',
      whatItIs: 'Someone sharing revenue metrics or growth milestones',
      howItWorks: 'Public validation of a business model working at scale',
      opinion: 'Revenue transparency indicates a working market. Can we build for this market?',
      opportunity: 'Build tools for this specific niche or compete directly',
      difficulty: 'Varies - depends on market complexity',
      priority: '📍 BUILD NOW',
      verdict: 'Validate market demand'
    },
    aiTool: {
      title: 'AI Tool/Agent Innovation',
      emoji: '🤖',
      whatItIs: 'New AI-powered tool or agent capability',
      howItWorks: 'Uses LLMs or AI agents to automate or enhance workflows',
      opinion: 'AI tools are hot but crowded. Differentiation is key.',
      opportunity: 'Niche down, integrate with existing workflows, or build wrappers',
      difficulty: 'Low-Medium - many AI tools are wrappers around APIs',
      priority: '📋 Add to backlog',
      verdict: 'Assess differentiation'
    },
    newTech: {
      title: 'New Technology/Framework',
      emoji: '⚡',
      whatItIs: 'New technical tool, library, or framework released',
      howItWorks: 'Open source or commercial tool solving a specific technical problem',
      opinion: 'Early adoption of new tech can lead to thought leadership opportunities',
      opportunity: 'Create content, tutorials, or build on top of the tech',
      difficulty: 'Low - content creation is fast',
      priority: '📍 BUILD NOW',
      verdict: 'Strike while hot'
    },
    problem: {
      title: 'Problem/Pain Point Identified',
      emoji: '🎯',
      whatItIs: 'Someone expressing frustration or unmet need',
      howItWorks: 'Organic signal of a real market problem without a good solution',
      opinion: 'Direct problem statements are gold. This is pre-validated demand.',
      opportunity: 'Build the exact solution they need',
      difficulty: 'Medium - requires building the actual product',
      priority: '📍 BUILD NOW',
      verdict: 'Pre-validated demand'
    },
    trend: {
      title: 'Emerging Trend Signal',
      emoji: '📈',
      whatItIs: 'Topic gaining traction or going viral',
      howItWorks: 'Network effects driving attention to a specific topic or tool',
      opinion: 'Trends create temporary attention windows. Move fast or skip.',
      opportunity: 'Create content, tools, or services riding the trend',
      difficulty: 'Low - but time-sensitive',
      priority: '📍 BUILD NOW',
      verdict: 'Time-sensitive opportunity'
    }
  };

  return {
    found: true,
    ...analyses[category]
  };
}

// Categorize tweet for emoji selection
function categorizeTweet(text, signals) {
  const categories = {
    video: { regex: /video|youtube|tiktok|reel/i, emoji: '🎬' },
    ai: { regex: /ai|gpt|claude|llm|model/i, emoji: '🤖' },
    design: { regex: /design|ui|ux|figma|sketch/i, emoji: '🎨' },
    code: { regex: /code|github|api|framework|library/i, emoji: '💻' },
    business: { regex: /revenue|mrr|startup|funding|launch/i, emoji: '💼' },
    content: { regex: /content|blog|newsletter|podcast/i, emoji: '✍️' }
  };

  for (const [cat, data] of Object.entries(categories)) {
    if (data.regex.test(text.toLowerCase())) {
      return { category: cat, emoji: data.emoji };
    }
  }

  return { category: 'general', emoji: '💡' };
}

// Extract product name from text
function extractProductName(text) {
  // Try to find capitalized product names or quoted strings
  const matches = text.match(/"([^"]{3,30})"|'([^']{3,30})'|\b([A-Z][a-zA-Z]{2,15})\b/g);
  if (matches) {
    return matches[0].replace(/["']/g, '');
  }
  return null;
}

// Truncate text
function truncate(text, length) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Generate human-readable markdown report
function generateReadableReport(report) {
  let md = `🪶 Twitter Scout Report — ${report.date}\n\n`;
  md += `Alright Paul, I dug through your feeds. `;
  
  if (report.findings.length === 0) {
    md += `Quiet period — no major business signals this run. Sometimes the best intel is knowing when to wait.\n\n`;
  } else {
    md += `Found ${report.findings.length} items worth your attention.\n\n`;
    
    report.findings.forEach(f => {
      md += `${f.number}. ${f.emoji} ${f.title}\n\n`;
      md += `**Link:** ${f.link}\n`;
      md += `**Author:** ${f.author} (${f.authorName})\n`;
      md += `**Engagement:** ${f.engagement.likes.toLocaleString()} likes, ${f.engagement.reposts.toLocaleString()} reposts`;
      if (f.engagement.views) {
        md += `, ${f.engagement.views.toLocaleString()} views`;
      }
      md += `\n\n`;
      md += `**What it is:** ${f.whatItIs}\n\n`;
      md += `**How it works:** ${f.howItWorks}\n\n`;
      md += `**MY OPINION:** ${f.opinion}\n\n`;
      md += `**Opportunity:** ${f.opportunity}\n\n`;
      md += `**Difficulty:** ${f.difficulty}\n`;
      md += `**Priority:** ${f.priority}\n\n`;
      md += `---\n\n`;
    });
  }

  // Summary table
  if (report.summary.length > 0) {
    md += `## Summary\n\n`;
    md += `| Find | Verdict | Priority |\n`;
    md += `|------|---------|----------|\n`;
    report.summary.forEach(s => {
      md += `| ${s.find} | ${s.verdict} | ${s.priority} |\n`;
    });
    md += `\n`;
  }

  md += `---\n\n`;
  md += `*Next run: 6 hours* 🪶\n`;

  return md;
}

// Run if called directly
if (require.main === module) {
  const tweetFile = process.argv[2];
  if (!tweetFile) {
    console.error('Usage: node analyzer.js <tweet-file.json>');
    process.exit(1);
  }
  analyzeTweets(tweetFile).catch(console.error);
}

module.exports = { analyzeTweets };
