#!/usr/bin/env node
/**
 * Write a handoff entry to the moltbook
 * Usage: node write-handoff.js --from=AgentA --to=AgentB --task=task-id --summary="..." --next-action="..."
 */

const MoltbookNotionClient = require('../../../src/notion-client');

async function main() {
  const args = parseArgs();
  
  const client = new MoltbookNotionClient(
    process.env.NOTION_TOKEN,
    process.env.MOLTBOOK_DB_ID
  );

  try {
    const entryId = await client.writeHandoff({
      fromAgent: args.from,
      toAgent: args.to,
      taskId: args.task,
      summary: args.summary,
      context: JSON.parse(args.context || '{}'),
      nextAction: args.nextAction,
      priority: args.priority || 'medium',
      requiresApproval: args.approval === 'true'
    });

    console.log(`Handoff written: ${entryId}`);
    
    // If human approval required, send notification
    if (args.approval === 'true') {
      await notifyHuman(args);
    }
  } catch (err) {
    console.error('Failed to write handoff:', err.message);
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

async function notifyHuman(args) {
  // Placeholder for Telegram notification
  console.log(`[NOTIFICATION] Human approval required for handoff from ${args.from} to ${args.to}`);
}

main();
