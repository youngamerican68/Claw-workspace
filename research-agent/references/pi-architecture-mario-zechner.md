# What I learned building an opinionated and minimal coding agent
**Author:** Mario Zechner (Pi creator)
**Date:** 2025-11-30
**Source:** Mario Zechner's blog

## Key Takeaways for Our Work

### Pi's Architecture
- 4 tools only: Read, Write, Edit, Bash
- System prompt under 1,000 tokens
- No MCP, no sub-agents, no plan mode, no todos, no background bash
- YOLO by default (no permission prompts)
- Competitive with Claude Code, Codex, Cursor on Terminal-Bench 2.0

### pi-ai (LLM Abstraction Layer)
- Unified API: Anthropic, OpenAI, Google, xAI, Groq, Cerebras, OpenRouter, any OpenAI-compatible
- Cross-provider context handoff (switch models mid-session)
- Proper abort support, split tool results (LLM vs UI), partial JSON parsing
- Works in browser (CORS support from Anthropic, xAI)
- Used in 7 production projects

### Why No MCP (Critical Insight)
- MCP servers dump 13-18k tokens of tool descriptions into context every session
- Playwright MCP: 21 tools, 13.7k tokens. Chrome DevTools MCP: 26 tools, 18k tokens
- Alternative: CLI tools with README files — agent reads README only when needed (progressive disclosure)
- Token-efficient, composable, easy to extend
- `mcporter` bridges MCP to CLI if you must use MCP servers
- **Our takeaway: Build ClawHub skills, not MCP servers**

### Why No Sub-Agents
- Sub-agents are black boxes — zero visibility into what they do
- Instead: spawn pi via bash, use tmux for observability
- "Fix your workflow" — if you need context gathering mid-session, you didn't plan ahead
- Do context gathering in its own session first, create an artifact
- Valid use case: code review via spawned sub-agent

### Session Branching
- Sessions in Pi are trees — branch and navigate
- Side-quest to fix something without wasting main context
- After fix, rewind session back to earlier, Pi summarizes what happened on branch
- **We should use this with Rook for complex tasks**

### Extension System
- Extensions can persist state into sessions
- Hot reloading — agent writes code, reloads, tests in loop
- Extensions can register tools, render custom TUI components
- Ships with docs/examples the agent uses to extend itself

### Benchmark Results
- Pi + Claude Opus competitive with Claude Code, Codex, Cursor on Terminal-Bench 2.0
- Terminus 2 (just tmux, no fancy tools) also competitive — validates minimal approach

### Pi's Components (Reusable)
- **pi-ai**: Unified LLM API (can build on this)
- **pi-agent-core**: Agent loop, tool execution, event streaming
- **pi-tui**: Terminal UI framework, differential rendering, flicker-free
- **pi-coding-agent**: CLI wiring sessions, tools, themes, context files

## Relation to OpenClaw
- Pi is the engine, OpenClaw is the product layer on top
- Peter (OpenClaw creator) adds: Telegram/Discord channels, multi-agent, MCP via mcporter, skills marketplace
- Pi's minimalism is intentional — OpenClaw adds complexity at the right layer
- Mario's philosophy: agent extends itself. Peter's philosophy: "sci-fi with a touch of madness"
