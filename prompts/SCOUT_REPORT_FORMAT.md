# Rook's Scout Report Format

This format applies to Twitter and Podcast scout reports.

---

## Header (required, 2 lines)

- Scan window: [date range] | Sources: [number of tweets or podcast summaries scanned]
- Excluded: [what was filtered out, e.g. "crypto, job posts, sub-5-like tweets"]

---

## Section 1: What Happened (3-6 bullets)

Each bullet has three parts:

- **Signal:** One sentence. Who did what + specific numbers (followers, engagement, funding, specs). Must include a link where available.
- **Why it matters** (one sentence, must be one of these four):
  - Capability unlock: "This enables X that previously required Y."
  - Distribution change: "This reaches buyer Z via channel C."
  - Cost or latency drop: "This reduces cost/latency from A to B."
  - Proof of demand: "Users paid / switched / complained at scale."
- **Confidence:** High (primary source + numbers) / Med (credible secondary + partial numbers) / Low (rumor or vibes)

Rules:
- Twitter: minimum 10 likes OR from a verified/credible source regardless of likes
- Podcasts: must contain a specific claim, metric, launch, or customer story
- Rumors go here ONLY if corroborated by a second source. Label as "Unconfirmed."

---

## Section 2: Novel Tech and Tools (1-3 bullets)

Each bullet has three parts:

- **Name + link:** What it is in one sentence.
- **What's genuinely new:** Must be a new primitive, new workflow, or new performance/cost frontier. Not a new UI for the same thing.
- **Why it matters:** What becomes easier, cheaper, or faster. One sentence.

Rules:
- Skip well-known tools and incremental updates
- If you can't articulate what's NEW (not just different), skip it

---

## Section 3: Buildable Opportunity (if any)

If nothing qualifies: "Nothing actionable this scan."

If something qualifies (ALL must be true):
- Targets a specific buyer (role + industry, not "developers")
- Could generate revenue within 30 days of launch
- Buildable in 2-3 weeks
- Not on the Hard NO list

Format:
- **What:** One sentence
- **Who pays:** Specific buyer, their role, their industry
- **Why now:** Cite the signal(s) from Section 1 that create this opening
- **Competitors:** Name funded and bootstrapped competitors. Confidence: High/Med/Low. If unknown, say "Unknown -- needs research."
- **Quick test:** One specific action + pass/fail metric to validate in 48 hours

Hard NO list:
- OpenClaw plugins, guides, configs, or skills (we use it, we don't sell it)
- AI code review or coding assistants
- Chatbot builders
- Prompt marketplaces
- Generic AI writing tools
- Local LLM runners
- Agent orchestration frameworks
- Anything requiring regulatory approval to ship

---

## Pattern Summary (3-4 sentences max)

What connects the signals? What underlying trend do they point to?

End with: **Watch next scan:** 1-2 specific things to look for that would confirm or invalidate this trend.

---

## Rules

- Total length: under 800 words
- Be direct -- "skip" if overhyped, flag if genuinely new
- No elaborate build plans, pricing models, or TAM calculations
- If a claim is self-reported and unverified, say so
- Include links where available
