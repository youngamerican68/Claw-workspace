AUTONOMOUS BUILD: Twitter Scout Tracker

Mode: Complete this entire build without asking questions. Make reasonable decisions. Do not stop for confirmations.

CRITICAL CONTEXT - READ THIS FIRST
THIS IS NOT a security dashboard, threat intelligence tool, or monitoring system for cyber attacks.
THIS IS a personal business tool that:
Archives reports from Twitter scouting (looking for business opportunities)
Tracks business opportunities extracted from those reports
Monitors the Clawdbot overnight build queue status
Shows simple metrics about scouting activity
The word "Scout" here refers to Twitter scouting for business ideas, not security reconnaissance.

PRD: Twitter Scout Tracker Dashboard

Goal
A simple, private dashboard to organize Twitter scout reports, track business opportunities, and monitor the Clawdbot overnight build status. Replaces scattered files and memory with a clean web interface.

Tech Stack
Frontend: Next.js 14 (App Router), Tailwind CSS, TypeScript
Database: Neon (PostgreSQL) - YOU MUST CREATE A NEW DATABASE ON NEON
ORM: Prisma
Deployment: Vercel
Auth: None (private deployment)

REQUIRED: Create Neon Database
Use the Neon MCP tools to:
Create a new Neon project called "scout-tracker"
Get the connection string
Use it in the Prisma schema

Features

1. Dashboard Home
Cards showing: Recent reports count, Active opportunities count, Build queue status, Total tweets scanned
Latest scout report preview (last 24h)

2. Scout Reports Archive
List all Twitter scout reports (these are markdown files with business opportunities found on Twitter)
Filter by: Date range, Keywords
Search report content
View full report on click

3. Opportunity Tracker
Business opportunities extracted from Twitter scout reports
Fields: Title, Source, Status (New → Considering → Queued → Built → Deployed), Priority, Notes
Filter by status and priority
Link to original report

4. Build Status Board
Shows Clawdbot overnight build queue status
Fetches from: http://68.183.51.209/prompts/queue.json
Display: What's pending, what's building, what succeeded, what failed
Show deployment links for completed builds

5. Metrics (Simple)
Total reports archived
Total opportunities identified
Total builds completed
Simple bar chart of reports over time

Database Schema (Prisma)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model ScoutReport {
  id          String   @id @default(uuid())
  source      String // "twitter" or "podcast"
  date        DateTime
  title       String
  content     String   @db.Text
  tweetCount  Int?
  filePath    String?
  createdAt   DateTime @default(now())
  opportunities Opportunity[]
}

model Opportunity {
  id          String   @id @default(uuid())
  title       String
  description String   @db.Text
  source      String // "twitter" | "podcast" | "manual"
  status      String   @default("new") // new, considering, queued, built, deployed, abandoned
  priority    String   @default("medium") // low, medium, high
  notes       String?
  reportId    String?
  report      ScoutReport? @relation(fields: [reportId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Build {
  id            String   @id @default(uuid())
  projectName   String
  status        String // pending, processing, success, failed
  prdContent    String?  @db.Text
  deployUrl     String?
  queuedAt      DateTime?
  completedAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

Pages Structure

/app
  /page.tsx                 # Dashboard home with stat cards
  /reports
    /page.tsx               # List all scout reports
    /[id]/page.tsx          # Single report view
  /opportunities
    /page.tsx               # Opportunity tracker (table or kanban)
    /[id]/page.tsx          # Edit opportunity
  /builds
    /page.tsx               # Build queue status from Clawdbot server
  /metrics
    /page.tsx               # Simple charts and numbers

API Routes

/app/api
  /reports
    /route.ts               # GET list, POST new
    /[id]/route.ts          # GET single, PATCH update
  /opportunities
    /route.ts               # GET list, POST new
    /[id]/route.ts          # GET single, PATCH update, DELETE
  /builds
    /route.ts               # GET (fetches from http://68.183.51.209/prompts/queue.json)

UI Design

Theme: Dark mode
Background: slate-900 (#0f172a)
Cards: slate-800 (#1e293b)
Primary accent: blue-500 (#3b82f6)
Success: emerald-500 (#10b981)
Warning: amber-500 (#f59e0b)
Error: red-500 (#ef4444)
Font: Inter (from Google Fonts)

Navigation: Left sidebar with:
Dashboard (home icon)
Reports (document icon)
Opportunities (lightbulb icon)
Builds (hammer icon)
Metrics (chart icon)

Component Library

Use shadcn/ui components:
Card for stat boxes
Table for lists
Badge for status indicators
Button for actions
Input/Select for forms

Use Recharts for metrics charts.

Environment Variables

env
DATABASE_URL="postgresql://..." # Get from Neon after creating database

Build Steps

Create Next.js app with TypeScript and Tailwind
Install dependencies: prisma, @prisma/client, shadcn/ui, recharts
Create Neon database using MCP tools
Set up Prisma with schema above
Run prisma migrate dev
Build all pages and API routes
Add seed data for testing (3-5 sample reports, opportunities)
Deploy to Vercel

Seed Data for Testing

Create these sample records:

ScoutReport 1:
title: "Twitter Scout - Feb 5 2026"
source: "twitter"
content: "Found 3 interesting opportunities today..."
tweetCount: 847

Opportunity 1:
title: "AI-powered invoice processing for SMBs"
status: "considering"
priority: "high"

Opportunity 2:
title: "Heroku migration helper tool"
status: "built"
priority: "high"

Completion Checklist

Neon database created (NOT MOCK DATA - REAL DATABASE)
Prisma schema migrated
Dashboard home with stat cards
Reports list and detail pages
Opportunities list with status editing
Builds page fetching from Clawdbot server
Metrics page with charts
Dark mode UI
Deployed to Vercel
Connection to real Neon database confirmed

DO NOT

Do NOT use mock/fake data for the database - create a real Neon database
Do NOT build a security or threat intelligence dashboard
Do NOT add authentication (keep it simple)
Do NOT use any security-related terminology (threats, vulnerabilities, attacks, etc.)

FINAL OUTPUT: A working dashboard deployed to Vercel that connects to a real Neon PostgreSQL database for tracking Twitter scout reports and business opportunities.