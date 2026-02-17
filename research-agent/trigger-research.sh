#!/bin/bash
# trigger-research.sh — Send Rook a research prompt via Telegram
# Runs as cron at 2am Eastern (7am UTC)

BOT_TOKEN="8300846141:AAHA_HMkbFtgrj4hDZEfeW2WbtCNSwRVyNo"
CHAT_ID="1954369318"

MESSAGE="Time for your nightly research session. Here's your brief:

**Research these sources:**

- Hacker News top stories
- Decrypt (decrypt.co) — AI agent and crypto coverage
- The Conversation (theconversation.com) — AI agent academic coverage
- Yahoo Tech — AI agents section
- Brownstone Research — bleeding edge AI coverage
- Any interesting outbound links you find

**Topics I care about:**
AI agents, autonomous agents, OpenClaw ecosystem, server security, VPS hardening, self-hosted AI, local LLMs, agent tools, landing pages, side projects, maker tools, prompt engineering, agent memory, MCP servers

**Instructions:**
1. Browse each source using your web tools
2. Be selective — only investigate posts that are genuinely relevant
3. Follow outbound links to interesting repos, articles, tools
4. Take notes as you go
5. When done, write a research report and save it to /root/.openclaw/workspace/research-agent/reports/research-$(date -u +%Y-%m-%d).md
6. Keep it concise and actionable — I read this over coffee
7. Connect tonight's findings to things we're working on (ShieldBot, BotIQ, landing pages, scouts)
8. If you find tools or repos worth trying, explain specifically how we'd use them

Budget yourself — don't spend more than 45 minutes on this. Quality over quantity."

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\": \"${CHAT_ID}\", \"text\": \"${MESSAGE}\", \"parse_mode\": \"Markdown\"}" > /dev/null 2>&1

echo "[$(date -u +%Y-%m-%dT%H:%M:%S)] Research prompt sent to Rook"
