# Moltbook Setup Guide

## Prerequisites

- OpenClaw instance running
- Notion account + integration token
- Telegram bot (optional, for notifications)

## Step 1: Notion Setup

### Create Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "Moltbook"
4. Copy the "Internal Integration Token"
5. Set as `NOTION_TOKEN` environment variable

### Create Database

1. Create a new page in Notion
2. Add a database (table view)
3. Name it "Moltbook"
4. Add these properties:
   - Task ID (Title)
   - From Agent (Select)
   - To Agent (Select)
   - Status (Select: pending, in_progress, completed, pending_approval)
   - Summary (Text)
   - Next Action (Text)
   - Priority (Select: low, medium, high)
   - Timestamp (Date)
5. Share the database with your integration
6. Copy the database ID from the URL
7. Set as `MOLTBOOK_DB_ID` environment variable

## Step 2: Telegram Setup (Optional)

1. Message @BotFather on Telegram
2. Create new bot: `/newbot`
3. Copy the bot token
4. Set as `TELEGRAM_BOT_TOKEN`
5. Get your chat ID by messaging the bot
6. Set as `TELEGRAM_CHAT_ID`

## Step 3: Install Skill

Copy the `skills/moltbook` folder to your OpenClaw skills directory:

```bash
cp -r skills/moltbook ~/.openclaw/skills/
```

## Step 4: Configure Agents

Edit `examples/blog-workflow/agents.yaml` to define your agents and workflow.

## Step 5: Test

Test the setup:

```bash
# Write a test handoff
node skills/moltbook/scripts/write-handoff.js \
  --from=TestAgent \
  --to=ResearchAgent \
  --task=test-001 \
  --summary="Test handoff" \
  --next-action="Verify setup"

# Read pending handoffs
node skills/moltbook/scripts/read-handoff.js --agent=ResearchAgent
```

## Usage in OpenClaw

Once configured, use natural language:

```
ResearchAgent, find sources on AI trends and hand off to WriterAgent
```

Or:

```
Check moltbook for pending tasks for EditorAgent
```
