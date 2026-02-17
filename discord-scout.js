#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Config
const TOKEN = process.env.DISCORD_USER_TOKEN || fs.readFileSync('/root/.openclaw/credentials/discord-scanner.env', 'utf-8').split('=').slice(1).join('=').trim();
const GUILD_ID = '1456350064065904867';
const OUTPUT_DIR = '/root/.openclaw/workspace/discord-scout';
const REPORTS_DIR = path.join(OUTPUT_DIR, 'reports');
const DATA_DIR = path.join(OUTPUT_DIR, 'data');

// Channels to skip (noise / low signal)
const SKIP_CHANNELS = ['welcome', 'users-helping-users', 'memes', 'pr-thunderdome-dangerzone', 'off-topic-and-ai', 'introductions', 'hardware'];

// Ensure directories exist
[OUTPUT_DIR, REPORTS_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function discordApi(endpoint) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'discord.com',
      path: `/api/v10${endpoint}`,
      headers: { 'Authorization': TOKEN, 'User-Agent': 'Mozilla/5.0' }
    };
    https.get(opts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data.slice(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTextChannels() {
  const channels = await discordApi(`/guilds/${GUILD_ID}/channels`);
  return channels.filter(c => c.type === 0);
}

async function getRecentMessages(channelId, hoursBack = 24) {
  const since = Date.now() - (hoursBack * 60 * 60 * 1000);
  // Discord snowflake: (timestamp - discord_epoch) << 22
  const discordEpoch = 1420070400000;
  const sinceSnowflake = String(BigInt(since - discordEpoch) << 22n);

  let allMessages = [];
  let afterCursor = sinceSnowflake;
  let page = 0;

  while (page < 20) { // Max 20 pages (2000 messages) per channel
    let endpoint = `/channels/${channelId}/messages?limit=100&after=${afterCursor}`;

    const messages = await discordApi(endpoint);

    if (!Array.isArray(messages) || messages.length === 0) break;

    // Discord returns newest-first with 'after', sort ascending by ID
    messages.sort((a, b) => (BigInt(a.id) > BigInt(b.id) ? 1 : -1));

    allMessages = allMessages.concat(messages);

    if (messages.length < 100) break;

    // Advance cursor to the newest message we received
    afterCursor = messages[messages.length - 1].id;
    page++;

    // Rate limit: 1 request per second
    await sleep(1000);
  }

  return allMessages;
}

async function run() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toISOString().replace(/[:.]/g, '-');

  console.log(`Discord Scout - ${dateStr}`);
  console.log('================================');

  const channels = await getTextChannels();
  console.log(`Found ${channels.length} text channels`);

  const results = {};
  let totalMessages = 0;

  for (const channel of channels) {
    if (SKIP_CHANNELS.includes(channel.name)) {
      console.log(`Skipping #${channel.name} (excluded)`);
      continue;
    }
    console.log(`Scanning #${channel.name}...`);
    await sleep(1000); // Rate limiting

    try {
      const messages = await getRecentMessages(channel.id);
      if (messages.length > 0) {
        results[channel.name] = messages.map(m => ({
          id: m.id,
          author: m.author?.username || 'unknown',
          content: m.content,
          timestamp: m.timestamp,
          attachments: (m.attachments || []).length,
          reactions: (m.reactions || []).map(r => ({
            emoji: r.emoji.name,
            count: r.count
          }))
        }));
        totalMessages += messages.length;
        console.log(`  -> ${messages.length} messages`);
      } else {
        console.log(`  -> no recent messages`);
      }
    } catch (err) {
      console.log(`  -> error: ${err.message}`);
    }
  }

  // Save raw data
  const dataFile = path.join(DATA_DIR, `scan-${timeStr}.json`);
  fs.writeFileSync(dataFile, JSON.stringify(results, null, 2));
  console.log(`\nSaved raw data: ${dataFile}`);

  // Generate summary report
  const report = generateReport(results, dateStr, totalMessages, channels.length);
  const reportFile = path.join(REPORTS_DIR, `discord-scout-${dateStr}.md`);
  fs.writeFileSync(reportFile, report);
  console.log(`Saved report: ${reportFile}`);

  console.log(`\nDone! ${totalMessages} messages from ${Object.keys(results).length} active channels.`);
}

function generateReport(results, dateStr, totalMessages, totalChannels) {
  let report = `# Discord Scout Report - ${dateStr}\n\n`;
  report += `**Server:** Friends of the Crustacean\n`;
  report += `**Period:** Last 24 hours\n`;
  report += `**Total Messages:** ${totalMessages}\n`;
  report += `**Active Channels:** ${Object.keys(results).length} / ${totalChannels}\n\n`;
  report += `---\n\n`;

  const sorted = Object.entries(results).sort((a, b) => b[1].length - a[1].length);

  for (const [channelName, messages] of sorted) {
    report += `## #${channelName} (${messages.length} messages)\n\n`;

    // Deduplicate by message ID, then show top messages
    const seen = new Set();
    const unique = messages.filter(m => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return m.content.trim().length > 0;
    });

    const notable = unique
      .sort((a, b) => {
        const aScore = a.reactions.reduce((sum, r) => sum + r.count, 0) + (a.content.length > 200 ? 2 : 0);
        const bScore = b.reactions.reduce((sum, r) => sum + r.count, 0) + (b.content.length > 200 ? 2 : 0);
        return bScore - aScore;
      })
      .slice(0, 5);

    for (const msg of notable) {
      const preview = msg.content.slice(0, 300).replace(/\n/g, ' ');
      const reactions = msg.reactions.length > 0
        ? ` [${msg.reactions.map(r => `${r.emoji}:${r.count}`).join(', ')}]`
        : '';
      report += `- **${msg.author}**: ${preview}${reactions}\n`;
    }
    report += `\n`;
  }

  return report;
}

run().catch(err => {
  console.error('Scout failed:', err.message);
  process.exit(1);
});
