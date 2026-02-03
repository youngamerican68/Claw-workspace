# Product Requirements Documents (PRDs)
## Feb 2 Twitter Scout Opportunities

---

## #1: Claw Task Tracker

### Overview
Smart task management system for AI agents with automatic retry limits and "stuck" detection. When tasks fail, they retry intelligently with exponential backoff, then escalate to "stuck" status when max retries are hit.

### Problem Statement
From Twitter scout: @AI_with_Eric mentioned "task tracker with cron jobs" and "cap tasks at 5 attempts before 'stuck' status." Agents currently fail silently or retry infinitely. No visibility into what's working vs. broken.

### Core Features (MVP)
1. **Task Creation API** - Create tasks with name, payload, max_retries (default: 5)
2. **Status Tracking** - pending → running → retrying → stuck/completed
3. **Retry Logic** - Exponential backoff (1s, 2s, 4s, 8s, 16s delays)
4. **Stuck Detection** - Auto-flag when max_retries exceeded
5. **Dashboard** - Visual board showing all tasks, their status, retry count
6. **Escalation** - Webhook/email when task goes "stuck"

### Technical Stack
- Backend: Node.js/Express or Python/FastAPI
- Database: PostgreSQL (for task persistence)
- Queue: Redis or Bull for job processing
- Frontend: React or just enhance existing HTML

### MVP Effort: 2-3 days
- Database schema: 2 hours
- Task API: 4 hours
- Retry worker: 4 hours
- Dashboard: 4 hours
- Testing/deployment: 4 hours

### Monetization Strategy
- **Free tier:** 100 tasks/month, 1 user
- **Pro:** $19/mo - unlimited tasks, 5 users, webhook integrations
- **Team:** $49/mo - unlimited users, SLA, priority support
- **Enterprise:** $199/mo - custom retry policies, on-prem option

### Monetization Score: 8/10
- Clear SaaS model
- Per-seat pricing scales with teams
- Infrastructure play (agents need tasks)
- Easy to justify cost (saves debugging time)

---

## #2: "How I Use Claw" Workflow Showcase

### Overview
Content platform for hosting video walkthroughs of real Claw workflows. Community-driven "show, don't tell" platform inspired by @designertom's voice note that converted Riley Brown.

### Problem Statement
Twitter scout identified: "Content Gap is the Bottleneck — Everyone wants practical walkthrough content. Voice/video > text." No centralized place to find authentic Claw workflows.

### Core Features (MVP)
1. **Video Upload** - Support Loom, YouTube, direct upload (100MB limit)
2. **Categories** - Research, Content, Automation, Integrations
3. **Search/Filter** - By use case, tools used, difficulty
4. **User Profiles** - Creators build reputation, link Twitter
5. **Voting System** - Upvote helpful workflows
6. **Embed Widget** - Let users embed workflows on their sites

### Technical Stack
- Backend: Node.js/Express
- Database: PostgreSQL
- Video: Cloudflare Stream or Mux (expensive) or just embed YouTube/Loom
- Frontend: React with video player
- Auth: Clerk or Auth0

### MVP Effort: 3-4 days
- Database + API: 1 day
- Video upload/integration: 1 day
- Frontend: 1-2 days
- Auth: 4 hours

### Monetization Strategy
- **Free:** View all content, upload 5 videos
- **Pro Creator:** $9/mo - unlimited uploads, analytics, custom profile
- **Team/Org:** $49/mo - private workflow library for company
- **Sponsored:** Featured workflows from tool vendors (future)

### Monetization Score: 5/10
- Content platforms are hard to monetize
- Competes with YouTube/Discord communities
- Better as community-building than revenue driver
- Could pivot to "paid templates" model later

---

## #3: ClawHub Security Scanner

### Overview
Supply chain security scanner for ClawHub packages. Detects malicious code, suspicious permissions, known vulnerabilities before installation.

### Problem Statement
From scout: "ClawHub Security Warning — Supply Chain Attack Vector Identified." Jamieson O'Reilly flagged VirusTotal blog about risks. @amankhan mentioned "missing solid security hardening."

### Core Features (MVP)
1. **Package Scanning** - Submit ClawHub package name or URL
2. **Static Analysis** - Parse code for: obfuscation, eval(), suspicious imports, network calls
3. **Permission Analysis** - Check manifest for overreach (file system, network, env vars)
4. **Reputation Scoring** - Publisher history, download counts, update frequency
5. **VirusTotal Integration** - Hash check against known malware DB
6. **Report Generation** - Risk score + detailed findings + recommendations
7. **CLI Tool** - `claw-security scan <package>` for CI/CD

### Technical Stack
- Backend: Python (better security tooling ecosystem)
- Static Analysis: bandit, semgrep, or AST parsing
- Database: PostgreSQL for package metadata
- Queue: Celery + Redis for async scanning
- VirusTotal API integration

### MVP Effort: 5-7 days
- Package fetcher/parser: 1 day
- Static analysis engine: 2 days
- Reputation scoring: 1 day
- VirusTotal integration: 4 hours
- CLI tool: 1 day
- Dashboard: 1 day

### Monetization Strategy
- **Free:** 10 scans/day for open source packages
- **Pro:** $29/mo - unlimited scans, private repo scanning, API access
- **Team:** $99/mo - CI/CD integration, org-wide policies
- **Enterprise:** $499/mo - custom rules, on-prem scanner, SLA

### Monetization Score: 9/10
- Security products have high willingness to pay
- Clear value (prevents breaches)
- Can sell to enterprises (big contracts)
- Recurring need (new packages released constantly)

---

## #4: Claw Cloud (Hosted OpenClaw)

### Overview
Managed OpenClaw hosting service. One-click deployment of OpenClaw instances with managed updates, backups, and scaling.

### Problem Statement
From scout: "Hosted Solutions Unlock Mainstream — The 'too hard to set up' barrier is being solved." 151K GitHub stars but "Average person is not going to run it on a separate pc or in cloud instance."

### Core Features (MVP)
1. **One-Click Deploy** - Choose template, configure env vars, deploy
2. **Templates** - Twitter scout, research assistant, blank slate
3. **Instance Management** - Start/stop/restart, view logs
4. **Environment Config** - Secure API key management
5. **Channel Integration** - Telegram, Slack, Webhooks pre-configured
6. **Monitoring** - Uptime dashboard, resource usage
7. **Auto-Updates** - Managed OpenClaw version updates

### Technical Stack
- Infrastructure: Docker + Kubernetes or AWS ECS
- Control Plane: Node.js/Express or Go
- Database: PostgreSQL for instance metadata
- Message Queue: Redis for instance orchestration
- Cloud Provider: AWS/DigitalOcean (start with DO for cost)

### MVP Effort: 10-14 days
- Docker containerization: 2 days
- Instance orchestration API: 3 days
- Template system: 2 days
- Dashboard: 2 days
- Channel proxy (Telegram/Slack): 2 days
- Billing integration: 2 days
- Testing/deployment: 2 days

### Monetization Strategy
- **Starter:** $19/mo - 1 instance, 1GB RAM, 10GB storage
- **Pro:** $49/mo - 3 instances, 2GB RAM each, 50GB storage
- **Team:** $149/mo - 10 instances, 4GB RAM each, 200GB storage
- **Enterprise:** $499/mo - Unlimited, dedicated resources, custom templates

### Monetization Score: 8/10
- Recurring revenue (best model)
- Infrastructure costs eat margins (~30-40%)
- High churn risk if self-hosting becomes easier
- Winner-take-all market (first mover advantage)

---

# RANKINGS

## By Ease of MVP (Easiest → Hardest)

| Rank | Project | MVP Effort | Why |
|------|---------|------------|-----|
| 1 | **Task Tracker** | 2-3 days | Simple CRUD + retry logic, well-understood problem |
| 2 | **Workflow Showcase** | 3-4 days | Video upload platform, no complex business logic |
| 3 | **Security Scanner** | 5-7 days | Static analysis complexity, security domain expertise needed |
| 4 | **Claw Cloud** | 10-14 days | Infrastructure/DevOps heavy, orchestration complexity |

## By Monetization Potential (Highest → Lowest)

| Rank | Project | Score | Why |
|------|---------|-------|-----|
| 1 | **Security Scanner** | 9/10 | Security = high willingness to pay, enterprise sales, prevents breaches |
| 2 | **Claw Cloud** | 8/10 | Recurring revenue, but infrastructure costs + churn risk |
| 3 | **Task Tracker** | 8/10 | Clear SaaS model, easy to justify cost, scales with teams |
| 4 | **Workflow Showcase** | 5/10 | Content platforms hard to monetize, better for community |

---

# RECOMMENDED PRIORITY

## If you want FAST revenue: **Task Tracker**
- Easiest to build (2-3 days)
- Good monetization (SaaS model)
- Can ship this week

## If you want BIG revenue: **Security Scanner**
- Harder to build (5-7 days)
- Best monetization (security premium)
- Enterprise potential

## If you want RECURRING revenue: **Claw Cloud**
- Hardest to build (10-14 days)
- Recurring model
- But high infrastructure costs

## Skip: **Workflow Showcase**
- Build later as community play
- Hard to monetize directly
- Better as content marketing for other products