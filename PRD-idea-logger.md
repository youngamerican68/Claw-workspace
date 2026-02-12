# AUTONOMOUS BUILD: Idea Logger

Mode: Complete this entire build without asking questions.

---

## CRITICAL CONTEXT
This is a simple idea capture form. NOT a complex dashboard, NOT analytics, NOT AI features. Just a form to log business ideas and a list to view them.

## Tech Stack
- Next.js 14 (App Router)
- Neon PostgreSQL
- Prisma ORM
- Tailwind CSS
- Deploy to Vercel

## Database
Use existing scout-tracker Neon database (already connected via Vercel). Pull DATABASE_URL from Vercel:
vercel env pull

Add the Idea model to the existing schema.

## Prisma Schema

model Idea {
  id          String   @id @default(uuid())
  title       String
  description String
  source      String @default("manual") // twitter, podcast, manual
  status      String @default("new") // new, considering, queued
  createdAt   DateTime @default(now())
}

## Single Page App

/ (page.tsx):
- Form at top: title input, description textarea, source dropdown, submit button
- Below form: list of all ideas as cards
- Filter dropdown: All / New / Considering / Queued
- Each card shows: title, description, source badge, status badge, date

## UI
- Dark mode: slate-900 background
- Cards: slate-800
- Accent: blue-500
- Simple, minimal, no animations needed

## DO NOT
- Do NOT build multiple pages
- Do NOT add authentication
- Do NOT build analytics or charts
- Do NOT overcomplicate this