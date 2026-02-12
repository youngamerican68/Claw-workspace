# Heartbeat Tasks
# These tasks trigger automatic agent wake-ups

## Twitter Scout Schedule
- Apify scrapes tweets at 6:00 AM EST (11:00 UTC)
- Apify scrapes tweets at 6:00 PM EST (23:00 UTC)

## On Each Heartbeat - Check for NEW_DATA_READY (Twitter)
If `/root/.openclaw/workspace/twitter-scout/NEW_DATA_READY` exists:
1. Read the prepared data file path from NEW_DATA_READY
2. Load the prepared JSON data (tweets + linked content)
3. Generate scout report using `/prompts/SCOUT_REPORT_FORMAT.md`
4. Be direct and opinionated — connect to Paul's projects, call out hype
5. Include "What it would take" with specific build steps
6. Save report to `/root/.openclaw/workspace/twitter-scout/reports/scout-report-[timestamp].md`
7. Delete the NEW_DATA_READY flag
8. **POST THE FULL REPORT in chat** — not a summary, the entire markdown report (Telegram truncation is fine)

## Podcast Scout Schedule
- Syncs from Paul's Mac every Monday and Thursday
- Reports land in `/root/.openclaw/workspace/podcast-scout/reports/`
- Categories: entrepreneurship, finance, health

## On Each Heartbeat - Check for NEW Podcast Reports
Check `/root/.openclaw/workspace/podcast-scout/reports/` for files modified in last 24 hours.
If new reports found:
1. Read the new report(s) from all categories (entrepreneurship, finance, health)
2. Generate scout report using `/prompts/SCOUT_REPORT_FORMAT.md` — SAME format as Twitter
3. Extract opportunities and apply MY OPINION analysis connecting to Paul's projects
4. Include "What it would take" with specific build steps for each
5. Cross-reference with recent Twitter scout signals for convergence
6. Save report to `/root/.openclaw/workspace/podcast-scout/reports/scout-summary-[timestamp].md`
7. **POST THE FULL REPORT in chat** — not a summary, the entire markdown report (Telegram truncation is fine)

## Weekly: Scout Convergence Analysis
On Fridays (or when both scouts have fresh data):
1. Cross-reference Twitter scout signals with Podcast scout opportunities
2. Generate convergence report in `/scout-convergence/convergence-[date].md`
3. Identify opportunities flagged by BOTH sources
4. Prioritize convergent opportunities for build list
5. **POST THE FULL CONVERGENCE REPORT in chat** (Telegram truncation is fine)

## Automated Actions
- Analyze scout reports for build opportunities
- Build MVPs from high-signal opportunities
- Commit and push all builds to git
- Update dashboard with new projects

## On Each Heartbeat - Check BUILD_QUEUE.md
If `/root/.openclaw/workspace/BUILD_QUEUE.md` contains pending items:
1. Read the queue file
2. Identify highest priority pending build
3. Generate PRD using frontend-design skill
4. Build the landing page/MVP
5. Deploy to preview system
6. Update queue status: [pending] → [done]
7. Message Paul with completion summary

## Monitoring
- Check server health daily
- Monitor ClawHub for security alerts
