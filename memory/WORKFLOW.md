# Rook's Scout-to-Build Workflow (MANDATORY)

*Last updated: February 10, 2026*
*Status: ACTIVE — Non-negotiable procedure*

## The Workflow

Every scout report (Twitter, Podcast, or Convergence) MUST follow this sequence:

### 1. Generate Scout Report ✓
- Read data from NEW_DATA_READY or podcast sync
- Analyze signals using SCOUT_REPORT_FORMAT.md
- Identify top 3-5 opportunities
- **DO NOT STOP HERE**

### 2. Market Research (REQUIRED)
For each high-priority signal:
- Search for competitors (web_search)
- Check Reddit for demand signals ("site:reddit.com [topic]")
- Identify pricing benchmarks
- Assess market saturation
- Document findings

### 3. Viability Assessment (REQUIRED)
Answer for each opportunity:
- Who specifically pays for this?
- What's the current workaround?
- Why hasn't a well-funded player done this?
- What's the wedge?
- Is this original AND monetizable?

### 4. Build Decision (REQUIRED)
- 🔴 BUILD NOW — Time-sensitive, validated demand, clear path
- 🟡 Add to backlog — Solid but not urgent / needs more validation
- ⚪ Monitor — Emerging, wait for more data
- ⛔ Skip — Overhyped, saturated, or not viable

### 5. Build (If BUILD NOW or high-priority backlog)
- Generate PRD using frontend-design skill
- Build landing page/MVP
- Deploy to preview system
- Test functionality

### 6. Update Dashboard (REQUIRED)
- Add new build to http://68.183.51.209/dashboard/
- Include full scout context (signal, analysis, opportunity)
- Link to live preview
- Set appropriate status

## Non-Negotiable Rules

1. **NEVER** generate a scout report and stop
2. **ALWAYS** do market research for top signals
3. **ALWAYS** make explicit build decisions with reasoning
4. **ALWAYS** push viable builds to dashboard
5. **NEVER** wait for prompting to execute the workflow
6. **MINIMUM 2 LANDING PAGES** built per scout report (assuming viable signals exist)

## Consequences of Skipping Steps

- Reports without builds = wasted analysis
- Missed opportunities = lost revenue potential
- Manual prompting required = failure of autonomy

## Success Criteria

Every scout cycle should result in:
- 1-3 landing pages built (for viable opportunities)
- Dashboard updated with new projects
- Clear documentation of why builds were chosen
- Zero manual prompting required

## Reference

- Scout report format: /prompts/SCOUT_REPORT_FORMAT.md
- Dashboard URL: http://68.183.51.209/dashboard/
- Build queue: /root/.openclaw/workspace/BUILD_QUEUE.md

---

*This workflow is MANDATORY. No exceptions. Execute autonomously.*
