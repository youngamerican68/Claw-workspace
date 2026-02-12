# AUTONOMOUS BUILD: Scout Dashboard

**Mode:** Complete this entire build without asking questions. Make reasonable decisions. Do not stop for confirmations.

---

## PRD: Scout Intelligence Dashboard (Option A)

### Goal
A simple, private dashboard to organize scout reports, track opportunities, and monitor build status. Replaces scattered files and memory with a clean web interface.

### Tech Stack

**Frontend:** Next.js 14 (App Router), Tailwind CSS, TypeScript  
**Database:** Neon (PostgreSQL)  
**ORM:** Prisma  
**Deployment:** Vercel  
**Auth:** None (private deployment, IP restriction or simple password if needed)

### Features

**1. Dashboard Home**
- Cards showing: Recent reports, Active opportunities, Build queue status, Total tweets scanned
- Latest scout report preview (last 24h)

**2. Scout Reports Archive**
- List all Twitter and Podcast reports
- Filter by: Date range, Source (Twitter/Podcast), Keywords
- Search report content
- View full report on click

**3. Opportunity Tracker**
- Extracted opportunities from all reports (manual entry or simple parsing)
- Fields: Title, Source, Status (New → Considering → Queued → Built → Deployed), Priority, Notes
- Filter by status and priority
- Link to original report

**4. Build Status Board**
- Queue status: What's waiting, what's building, what's done
- Deployment links (Heroku Escape, etc.)
- Build history

**5. Metrics (Simple)**
- Total tweets scanned (lifetime)
- Total opportunities identified
- Total builds completed
- Tweets per day average

### Database Schema

```prisma
model ScoutReport {
  id        String   @id @default(uuid())
  source    String   // "twitter" or "podcast"
  date      DateTime
  title     String
  content   String   @db.Text
  tweetCount Int?
  filePath  String   // path to original md file
  createdAt DateTime @default(now())
  
  opportunities Opportunity[]
}

model Opportunity {
  id          String   @id @default(uuid())
  title       String
  description String   @db.Text
  source      String   // "twitter" | "podcast" | "manual"
  status      String   @default("new") // new, considering, queued, built, deployed, abandoned
  priority    String   @default("medium") // low, medium, high
  notes       String?
  reportId    String?
  report      ScoutReport? @relation(fields: [reportId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Build {
  id          String   @id @default(uuid())
  name        String
  status      String   // queued, building, deployed, failed
  prdUrl      String?
  deployUrl   String?
  startedAt   DateTime?
  completedAt DateTime?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Pages

**1. / (Dashboard)**
- Hero stats cards
- Recent activity feed
- Quick links to Reports, Opportunities, Builds

**2. /reports**
- Table of all scout reports
- Columns: Date, Source, Title, Tweets, Actions
- Search bar
- Filter: Source, Date range

**3. /reports/[id]**
- Full report content rendered
- Link to related opportunities
- Raw markdown view option

**4. /opportunities**
- Kanban-style board or table view
- Columns: Title, Source, Status, Priority, Actions
- Filter by status, priority, source
- Add new opportunity button

**5. /opportunities/[id]**
- Opportunity details
- Edit status, priority, notes
- Link to source report

**6. /builds**
- Build queue status
- Cards: Queued, Building, Deployed, Failed
- Each card: Name, Status, Links (PRD, Deploy), Dates

**7. /metrics**
- Simple charts (bar chart for tweets over time)
- Key numbers (total reports, opportunities, builds)
- Source breakdown pie chart

### Data Import (Initial)

**Script to run once:**
- Read all existing scout reports from `/twitter-scout/reports/` and `/podcast-scout/reports/`
- Parse frontmatter (date, source, title)
- Insert into ScoutReport table
- Extract opportunities manually or with simple regex (look for "##" headers with $ amounts or "Opportunity:" labels)

### UI Design

**Theme:** Dark mode (matches your preference from Heroku page)
- Background: slate-900
- Cards: slate-800
- Accents: blue-500 for primary, emerald-500 for success
- Font: Inter

**Navigation:**
- Sidebar or top nav: Dashboard, Reports, Opportunities, Builds, Metrics

### API Routes

**GET /api/reports** - List reports with filters  
**GET /api/reports/[id]** - Single report  
**GET /api/opportunities** - List opportunities  
**POST /api/opportunities** - Create opportunity  
**PATCH /api/opportunities/[id]** - Update status/priority  
**GET /api/builds** - List builds  
**POST /api/builds** - Add build to queue  
**PATCH /api/builds/[id]** - Update build status  

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@neon-host/db?sslmode=require"
NEXT_PUBLIC_APP_URL="https://scout-dashboard.vercel.app"
```

### Deployment Steps

1. **Neon Setup:**
   - Create database on Neon
   - Run `npx prisma migrate dev` to create tables

## Database Setup

Use the Neon MCP to:

1. Create a new Neon project called "scout-dashboard"
2. Get the DATABASE_URL connection string
3. Add it to .env.local
4. Run prisma migrate dev

2. **Vercel Setup:**
   - Connect GitHub repo
   - Add DATABASE_URL env var
   - Deploy

3. **Data Import:**
   - Run import script to seed existing reports

### Completion Checklist

- [ ] Next.js app scaffolded with App Router
- [ ] Prisma schema defined and migrated
- [ ] Neon database connected
- [ ] Dashboard home page with stats
- [ ] Reports list page with search/filter
- [ ] Report detail page
- [ ] Opportunities list page
- [ ] Opportunity detail/edit page
- [ ] Builds status page
- [ ] Metrics page with simple charts
- [ ] Data import script for existing reports
- [ ] Dark mode UI with Tailwind
- [ ] Deployed to Vercel
- [ ] Basic README with setup instructions

### Notes for Builder

1. Use **shadcn/ui** for components (built on Tailwind, looks professional)
2. Use **Recharts** for simple metrics charts
3. Keep it simple - no real-time updates needed, refresh page to see new data
4. Import existing scout reports as seed data
5. Make opportunities editable so Paul can manually add/status them

---

**Status:** Ready for overnight build queue