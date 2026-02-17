# Unless That Claw Is The Famous OpenClaw
**Author:** Zvi Mowshowitz
**Date:** 2026-02-03
**Source:** Zvi's blog (Don't Worry About The Vase)

## Key Takeaways for Our Work

### ShieldBot Validation
- Zvi's entire thesis: OpenClaw is powerful but security is terrifying
- Every concern he raises maps to ShieldBot checks: open ports, no auth, exposed credentials, leaked API keys
- His audience (rationalist/AI community) is our target market for ShieldBot

### Security Incidents Documented
- **28k+ exposed instances** with open gateway ports and zero auth (basic scan results)
- **GitGuardian found 181 leaked secrets** from people pushing OpenClaw workspaces to public repos
- **Jamieson O'Reilly's ClawHub supply chain attack:**
  - Built fake backdoored skill
  - Inflated download count to 4,000+ (trivial vulnerability in ClawHub)
  - Became #1 downloaded skill
  - Real developers from 7 countries executed arbitrary commands thinking it was legit
  - Could steal: session cookies, localStorage JWTs, refresh tokens, API keys
  - SVG-based XSS had full access to clawdhub.com origin
  - "My payload shows lobsters. A real attacker's payload would be invisible."
  - Vulnerabilities now patched, but pattern remains exploitable

### Cost Optimization (Already Fixed for Us)
- Opus heartbeats: $0.75 each, 25/night = $18.75 for "is it daytime?" checks
- Sends entire 120k token context each time
- Benjamin De Kraker's fix: 200-400x cheaper operation
- We already fixed this: maxTokens 8192 → 65536 + model routing

### Key Quotes for Marketing
- Rahul Sood: "Clawdbot Is Incredible. The Security Model Scares the shit out of me."
- Dean W. Ball: "coding agents themselves can do very hard-nosed security audits"
- Zvi: "Most of you should stick to Claude Code and not have an OpenClaw agent. Yet."
- fmdz: "I'm scared we're gonna have a massive credentials breach soon"

### The Executive Assistant Test (Great Framing)
- "Imagine you've hired an executive assistant. Remote, never met them. What access do you give them on day one?"
- Maps perfectly to agent access level decisions

### Tasklet vs OpenClaw
- Tasklet (focused agent) growing 92% MoM
- Specialized beats general commercially
- Validates our specialist agents approach

### Content Opportunities
- "How to Actually Secure Your OpenClaw Agent" — response piece to Zvi
- Quote his concerns, provide ShieldBot as the answer
- His audience = our market
