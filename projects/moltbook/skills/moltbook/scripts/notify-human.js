#!/usr/bin/env node
/**
 * Send Telegram notification to human for approval
 * Usage: node notify-human.js --message="Approval needed..."
 */

async function main() {
  const args = parseArgs();
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.error('Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID required');
    process.exit(1);
  }

  const message = args.message || 'Human approval required for moltbook handoff';
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🪶 Moltbook Alert\n\n${message}\n\nReply /approve or /reject`,
        parse_mode: 'HTML'
      })
    });

    if (response.ok) {
      console.log('Notification sent successfully');
    } else {
      console.error('Failed to send notification:', await response.text());
    }
  } catch (err) {
    console.error('Error sending notification:', err.message);
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
