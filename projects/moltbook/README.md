# Moltbook-as-a-Service

Multi-agent workspace template for OpenClaw. Agents communicate via a shared "moltbook" (logbook) in Notion, enabling async collaboration without human-in-the-loop.

## Concept

Inspired by Riley Brown's multi-agent setup (@vibeclaw), the moltbook pattern enables:
- Agent A completes a task, writes to the moltbook
- Agent B reads the moltbook, continues the work
- Human reviews progress via Telegram
- Agents take turns "leading" based on workflow stage

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Agent A    │────▶│  Moltbook   │────▶│  Agent B    │
│ (Research)  │     │  (Notion)   │     │  (Write)    │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                      │
       └──────────────┬───────────────────────┘
                      │
               ┌─────────────┐
               │   Human     │
               │ (Telegram)  │
               └─────────────┘
```

## Quick Start

1. Clone this template
2. Configure Notion integration
3. Set up Telegram bot
4. Deploy agents
5. Watch them collaborate

## Documentation

- [Setup Guide](docs/setup.md)
- [Handoff Protocol](docs/protocol.md)
- [Example Workflows](examples/)

## Status

🚧 In Progress - Building core components
