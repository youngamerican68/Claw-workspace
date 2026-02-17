# How to Set Up a Multi-Bot AI Group Chat with OpenClaw
Source: https://blog.codekunda.com/posts/multi-bot-group-chat-openclaw/
Saved: 2026-02-12
Found in: Discord scan 2026-02-11

## Why This Matters
Step-by-step walkthrough for running multiple AI agents on a single OpenClaw gateway with Telegram. Directly applicable to our multi-bot specialist plan.

## Key Takeaways

### 1. accounts.default Gotcha
When adding multi-account Telegram setup, you MUST explicitly declare accounts.default or the original bot goes silent. Root-level botToken alone is not enough.

### 2. Agent-to-Agent Messaging
Telegram bots CANNOT reliably see each other in group chats (by design). Use OpenClaw built-in sessions_send instead:
- Enable: tools.agentToAgent.enabled: true
- Send: sessions_send with agentId + sessionKey + message
- Bypasses Telegram entirely, reliable and auditable

### 3. Binding Pattern
Each Telegram bot token gets a named account, each account gets a binding to an agent:
- accounts.default → main agent (Rook)
- accounts.codekunda → codekunda-bot agent
- bindings[].match.accountId routes messages to correct agent

### 4. Human Gate Protocol
Proposal → Critique → Consensus → Human approval
Two bots agreeing does not mean they are right.

### 5. Cron + Delivery
Cron jobs can use delivery.mode: "announce" to post results to a Telegram group.

### 6. Each Agent Needs Own Auth
Memory/embedding auth must be configured per agent: openclaw agents add <id>

## Config Snippets

### agents.list
agents.list array with id, workspace, identity, optional model per agent

### channels.telegram.accounts
Named accounts (default, specialist) each with botToken, dmPolicy, groups, groupPolicy

### bindings
Array matching channel + accountId or peer.kind/id to agentId

### tools
agentToAgent.enabled: true required for sessions_send
