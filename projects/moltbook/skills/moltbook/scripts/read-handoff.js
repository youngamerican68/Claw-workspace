#!/usr/bin/env node
/**
 * Read pending handoffs for an agent
 * Usage: node read-handoff.js --agent=AgentName
 */

const MoltbookNotionClient = require('../../../src/notion-client');

async function main() {
  const args = parseArgs();
  
  if (!args.agent) {
    console.error('Error: --agent parameter required');
    process.exit(1);
  }

  const client = new MoltbookNotionClient(
    process.env.NOTION_TOKEN,
    process.env.MOLTBOOK_DB_ID
  );

  try {
    const handoffs = await client.readPendingHandoffs(args.agent);
    
    if (handoffs.length === 0) {
      console.log('No pending handoffs found');
      return;
    }

    console.log(`Found ${handoffs.length} pending handoff(s):\n`);
    
    handoffs.forEach((handoff, index) => {
      console.log(`[${index + 1}] Task: ${handoff.taskId}`);
      console.log(`    From: ${handoff.fromAgent}`);
      console.log(`    Summary: ${handoff.summary}`);
      console.log(`    Next Action: ${handoff.nextAction}`);
      console.log(`    Priority: ${handoff.priority}`);
      console.log(`    Entry ID: ${handoff.id}`);
      console.log('');
    });

    // Output as JSON for OpenClaw to parse
    console.log('---JSON---');
    console.log(JSON.stringify(handoffs, null, 2));
  } catch (err) {
    console.error('Failed to read handoffs:', err.message);
    process.exit(1);
  }
}

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key.replace(/-/g, '')] = value || true;
    }
  });
  return args;
}

main();
