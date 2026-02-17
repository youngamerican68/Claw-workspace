# MEMORY.md — Long-Term Knowledge

## Paul's Preferences

**Build Focus**
- Minimum 2 landing pages per scout report (enforced Feb 10, 2026)
- Wants execution, not just analysis
- Values "overnight employee" autonomy
- Prefers bullet points over tables/charts

**Communication**
- Direct, no fluff
- Silent execution for routine tasks
- Narrate only when valuable (problems, decisions, completions)

**What to Skip**
- Restaurant/salon cold pitch model (canned Feb 10)
- Overhyped "AI replaces X" narratives
- Saturated markets without differentiation

## Decisions Made

**Feb 10, 2026**
- Enhanced workflow: research → assessment → build (not just report)
- Memu-engine deferred (hold off for now)
- Exa MCP discussed but not prioritized
- Dashboard must have full inspiration details + delete functionality

**Feb 9, 2026**
- 3 landing pages built: Ops Reports, Agent Identity, Health Coach
- OpenClaw Ops Dashboard added as 4th project
- BUILD_QUEUE.md created for tracking
- HEARTBEAT.md updated to check queue

## Recurring Sources (High Signal)

**Twitter**
- Matthew Berman — OpenClaw ecosystem, dashboard demand
- Miles Deutscher — AI workflows, crypto macro
- Lenny Rachitsky — Product strategy, use case collection

**Podcasts**
- a16z Show — Infrastructure, AI tooling
- My First Million — Business opportunities
- Cal Newport — Deep work, productivity systems

## Patterns Observed

**Strong Signals**
- OpenClaw tooling (dashboards, memory, agents) = validated demand
- Verification/trust infrastructure = emerging theme
- Cost optimization = community priority (ClawRouter interest)

**Weak Signals**
- Generic AI advice threads (low engagement despite high followers)
- "AI replaces X" narratives (fatigue setting in)
- Consumer health apps (crowded, hard to monetize)

## Active Projects

1. **Ops Reports** — Terminal aesthetic, DevOps market
2. **Agent Identity** — Cyberpunk aesthetic, security focus
3. **Health Coach** — Organic aesthetic, wearables integration
4. **OpenClaw Ops** — Dark aesthetic, fleet monitoring

## Tools & Infrastructure

- **Preview System:** http://68.183.51.209/[project-name]/
- **Dashboard:** http://68.183.51.209/dashboard/
- **Scout Reports:** /twitter-scout/reports/, /podcast-scout/reports/
- **Build Queue:** /root/.openclaw/workspace/BUILD_QUEUE.md

## Key Metrics

- Scout runs: 2x daily (6am/6pm EST)
- Podcast sync: Mon/Thu
- Target: 2+ landing pages per scout cycle
- Current: 4 projects deployed

---

## OpenClaw Mega Cheatsheet (2026 Edition)

*Source: MoltFounders community reference guide — added Feb 17, 2026*

### Core CLI Commands
- `openclaw gateway` — Manage gateway daemon (start/stop/restart/status)
- `openclaw channels` — List/configure messaging channels
- `openclaw onboard` — Set up new channel (WhatsApp, Telegram, etc.)
- `openclaw doctor` — Diagnostics and health checks
- `openclaw config` — View/edit configuration
- `openclaw models` — List available models and aliases

### Quick Installation
```bash
npm install -g openclaw
```

### Channel Management
Supported: WhatsApp, Telegram, Discord, iMessage, Slack, IRC, Signal
- Each channel requires separate onboarding
- Bot tokens/API keys stored in config
- Multiple channels can run simultaneously

### In-Chat Slash Commands
- `/status` — Show session status, model, costs
- `/model [alias]` — Switch model (e.g., `/model opus`)
- `/compact` — Compress conversation history
- `/new` or `/reset` — Start fresh session
- `/think` or `/reasoning` — Toggle reasoning mode
- `/help` — List available commands

### Essential Paths
- Workspace: `/root/.openclaw/workspace/`
- Memory: `/root/.openclaw/workspace/memory/`
- Skills: `/root/.openclaw/workspace/skills/` or `/usr/lib/node_modules/openclaw/skills/`
- Config: `~/.openclaw/config.json`
- Logs: `~/.openclaw/logs/`

### Voice & TTS
- TTS tool available via `tts()` function
- Supports multiple voices
- Returns MEDIA: path for playback

### Memory & Models
- Memory files: `MEMORY.md`, `SOUL.md`, `USER.md`, `observations.md`
- Daily logs: `memory/YYYY-MM-DD.md`
- Model aliases: `opus`, `sonnet`, `haiku`, `default`

### Hooks & Skills
- Hooks: Pre/post processing for tool calls
- Skills: Specialized capabilities in `skills/` directory
- Custom skills: Add to `~/.openclaw/skills/`

### Troubleshooting
- `getUpdates conflict` = two instances with same bot token
- `browser.noSandbox: true` for headless servers
- Session recovery: `run-observer.sh --recover`
