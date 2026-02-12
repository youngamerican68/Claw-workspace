# AUTONOMOUS BUILD: SalesDeck AI

**Mode: Complete this entire build without asking questions. Make reasonable decisions. Do not stop for confirmations. Deploy to Vercel when complete.**

---

## FRONTEND DESIGN SKILL (READ AND APPLY TO EVERYTHING)

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

### Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose:** What problem does this interface solve? Who uses it?
- **Tone:** Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc.
- **Constraints:** Technical requirements (framework, performance, accessibility).
- **Differentiation:** What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL:** Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

### Frontend Aesthetics Guidelines

**Typography:** Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.

**Color & Theme:** Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

**Motion:** Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.

**Spatial Composition:** Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.

**Backgrounds & Visual Details:** Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

### What to NEVER Do

NEVER use generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Cliched color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. NEVER converge on common choices.

**Remember: You are capable of extraordinary creative work. Don't hold back. Commit fully to a distinctive vision.**

---

## Environment Setup

This app requires an OpenAI API key. Create `.env.local`:

```
OPENAI_API_KEY=your_key_here
```

For Vercel deployment, you'll set this as an environment variable in the Vercel dashboard or via CLI:
```
vercel env add OPENAI_API_KEY
```

---

## Project Setup

Run these commands:
```
npx create-next-app@latest salesdeck-ai --typescript --tailwind --app --src-dir=false --import-alias="@/*" --use-npm
cd salesdeck-ai
npm install framer-motion lucide-react clsx tailwind-merge openai zod html2pdf.js
npx shadcn@latest init -y
npx shadcn@latest add button card input textarea tabs skeleton
```

---

## What You're Building

A web app that converts sales call transcripts into follow-up pitch decks using AI.

**User flow:**
1. Land on marketing page
2. Paste transcript in textarea
3. Click generate → AI extracts insights
4. See 5-slide deck preview (beautifully rendered)
5. Export as PDF or copy as markdown

---

## Apply the Design Skill to This Project

**Purpose:** Sales reps with 5-10 calls/day need follow-up decks without tedium. They want to look professional and close deals.

**Tone:** Choose ONE and commit fully:
- Editorial/luxury (think: premium consulting deck aesthetic)
- Warm professional (think: modern law firm, trustworthy)
- Bold tech (think: confident startup, sharp edges)

**Typography:** Pick a striking Google Font pairing:
- "Instrument Serif" + "Instrument Sans"
- "Fraunces" + "Commissioner"  
- "Playfair Display" + "Source Sans 3"
- "DM Serif Display" + "DM Sans"

**Color:** Pick a cohesive palette with CSS variables:
- Deep navy (#1a1f36) + warm cream (#faf8f5) + gold accent (#c9a227)
- Off-black (#0d0d0d) + sage (#8fbc8f) + coral (#ff6b6b)
- Charcoal (#2d3436) + burgundy (#722f37) + cream (#fffef9)

**Differentiation:** The deck preview must look like ACTUAL premium presentation slides — not UI cards. Someone should want to screenshot it.

---

## File Structure

```
/app
  layout.tsx              — fonts, metadata, global providers
  page.tsx                — landing hero + main app
  globals.css             — CSS variables, textures, custom styles
  /api
    /generate-deck
      route.ts            — POST endpoint for AI extraction
/components
  hero.tsx                — headline, subhead, value prop, CTA
  features.tsx            — 3 feature cards
  transcript-input.tsx    — textarea + generate button + loading state
  deck-preview.tsx        — slide carousel/navigator
  slide.tsx               — individual slide (16:9 aspect ratio)
  export-buttons.tsx      — PDF download + copy markdown
  loading-skeleton.tsx    — skeleton while generating
/lib
  openai.ts               — OpenAI client setup
  extract-insights.ts     — AI extraction logic with structured output
  generate-slides.ts      — transforms insights to slide content
  types.ts                — TypeScript interfaces
```

---

## TypeScript Types

Create lib/types.ts:
```typescript
export interface DeckInsights {
  prospectName: string;
  companyName: string;
  prospectRole: string;
  callDate: string;
  painPoints: {
    issue: string;
    context: string;
  }[];
  featuresDiscussed: {
    feature: string;
    prospectInterest: 'high' | 'medium' | 'low';
  }[];
  objections: {
    objection: string;
    response: string;
  }[];
  nextSteps: string[];
  competitorsMentioned: string[];
  budgetDiscussed: boolean;
  timelineDiscussed: string | null;
  overallSentiment: 'positive' | 'neutral' | 'hesitant';
}

export interface Slide {
  id: number;
  type: 'opener' | 'pain-points' | 'solution' | 'social-proof' | 'next-steps';
  title: string;
  subtitle?: string;
  bullets: string[];
  highlight?: string;
}

export interface GeneratedDeck {
  insights: DeckInsights;
  slides: Slide[];
  generatedAt: string;
}
```

---

## OpenAI Integration

Create lib/openai.ts:
```typescript
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

Create lib/extract-insights.ts:
```typescript
import { openai } from './openai';
import { DeckInsights } from './types';
import { z } from 'zod';

const InsightsSchema = z.object({
  prospectName: z.string(),
  companyName: z.string(),
  prospectRole: z.string(),
  callDate: z.string(),
  painPoints: z.array(z.object({
    issue: z.string(),
    context: z.string(),
  })),
  featuresDiscussed: z.array(z.object({
    feature: z.string(),
    prospectInterest: z.enum(['high', 'medium', 'low']),
  })),
  objections: z.array(z.object({
    objection: z.string(),
    response: z.string(),
  })),
  nextSteps: z.array(z.string()),
  competitorsMentioned: z.array(z.string()),
  budgetDiscussed: z.boolean(),
  timelineDiscussed: z.string().nullable(),
  overallSentiment: z.enum(['positive', 'neutral', 'hesitant']),
});

export async function extractInsights(transcript: string): Promise<DeckInsights> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert sales analyst. Extract key insights from sales call transcripts to generate follow-up decks.
        
Always respond with valid JSON matching this exact structure:
{
  "prospectName": "string",
  "companyName": "string", 
  "prospectRole": "string",
  "callDate": "string (best guess from context or 'Recent call')",
  "painPoints": [{"issue": "string", "context": "string"}],
  "featuresDiscussed": [{"feature": "string", "prospectInterest": "high|medium|low"}],
  "objections": [{"objection": "string", "response": "string"}],
  "nextSteps": ["string"],
  "competitorsMentioned": ["string"],
  "budgetDiscussed": boolean,
  "timelineDiscussed": "string or null",
  "overallSentiment": "positive|neutral|hesitant"
}

Extract real information from the transcript. If something isn't mentioned, use empty arrays or reasonable defaults.`
      },
      {
        role: 'user',
        content: `Extract insights from this sales call transcript:\n\n${transcript}`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');
  
  const parsed = JSON.parse(content);
  return InsightsSchema.parse(parsed);
}
```

Create lib/generate-slides.ts:
```typescript
import { DeckInsights, Slide } from './types';

export function generateSlides(insights: DeckInsights): Slide[] {
  const slides: Slide[] = [
    {
      id: 1,
      type: 'opener',
      title: `Great Speaking With You, ${insights.prospectName}`,
      subtitle: `${insights.companyName} · ${insights.callDate}`,
      bullets: [
        `Thank you for taking the time to discuss ${insights.companyName}'s needs`,
        `We covered some exciting opportunities for your team`,
        insights.overallSentiment === 'positive' 
          ? `We're excited about the potential partnership ahead`
          : `We appreciate your thoughtful questions and feedback`,
      ],
      highlight: insights.prospectRole ? `Prepared for ${insights.prospectRole}` : undefined,
    },
    {
      id: 2,
      type: 'pain-points',
      title: 'We Heard You',
      subtitle: 'Key challenges you mentioned',
      bullets: insights.painPoints.length > 0
        ? insights.painPoints.slice(0, 4).map(p => `${p.issue}: ${p.context}`)
        : ['Streamlining current workflows', 'Improving team efficiency', 'Reducing manual processes'],
    },
    {
      id: 3,
      type: 'solution',
      title: 'How We Help',
      subtitle: 'Solutions tailored to your needs',
      bullets: insights.featuresDiscussed.length > 0
        ? insights.featuresDiscussed
            .filter(f => f.prospectInterest !== 'low')
            .slice(0, 4)
            .map(f => `${f.feature} — ${f.prospectInterest} priority for your team`)
        : ['Automated workflows to save time', 'Seamless integration with your stack', 'Dedicated support for your team'],
      highlight: insights.objections.length > 0 
        ? `Addressing your concern: ${insights.objections[0].response}`
        : undefined,
    },
    {
      id: 4,
      type: 'social-proof',
      title: 'Trusted By Teams Like Yours',
      subtitle: 'Results that speak for themselves',
      bullets: [
        '87% reduction in manual processing time',
        '3x faster deal cycles on average', 
        '500+ companies trust us with their workflows',
        '"Game-changer for our sales team" — VP Sales, Fortune 500',
      ],
      highlight: insights.competitorsMentioned.length > 0
        ? `Chosen over ${insights.competitorsMentioned[0]} by leading teams`
        : undefined,
    },
    {
      id: 5,
      type: 'next-steps',
      title: 'Next Steps',
      subtitle: "Let's move forward together",
      bullets: insights.nextSteps.length > 0
        ? insights.nextSteps
        : [
            'Schedule a technical deep-dive with your team',
            'Share detailed proposal and pricing',
            'Set up pilot program timeline',
          ],
      highlight: insights.timelineDiscussed 
        ? `Target timeline: ${insights.timelineDiscussed}`
        : insights.budgetDiscussed 
          ? 'Budget discussion: Ready to proceed'
          : undefined,
    },
  ];

  return slides;
}
```

---

## API Route

Create app/api/generate-deck/route.ts:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { extractInsights } from '@/lib/extract-insights';
import { generateSlides } from '@/lib/generate-slides';
import { GeneratedDeck } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    if (transcript.length < 100) {
      return NextResponse.json(
        { error: 'Transcript too short. Please provide a longer call transcript.' },
        { status: 400 }
      );
    }

    const insights = await extractInsights(transcript);
    const slides = generateSlides(insights);
    
    const deck: GeneratedDeck = {
      insights,
      slides,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(deck);
  } catch (error) {
    console.error('Error generating deck:', error);
    return NextResponse.json(
      { error: 'Failed to generate deck. Please try again.' },
      { status: 500 }
    );
  }
}
```

---

## Frontend Components

Build these components with the design skill fully applied:

**transcript-input.tsx:** Large, elegant textarea with placeholder showing example transcript. Character count indicator. "Generate Deck" button with loading state. Error display if generation fails. Use Framer Motion for button hover/press states.

**deck-preview.tsx:** Container showing current slide. Navigation arrows (left/right) with keyboard support. Dot indicators showing current position. Smooth slide transitions with Framer Motion. "Export" section below with PDF download + copy markdown buttons.

**slide.tsx:** 16:9 aspect ratio container (use aspect-[16/9]). Background gradient or texture matching theme. Large title, subtitle, bullet points. Visual hierarchy with font sizes/weights. Optional highlight callout box. Different visual treatment per slide type.

**export-buttons.tsx:** PDF download using html2pdf.js. Copy as Markdown button. Success toast/feedback on action.

---

## PDF Export Implementation

```typescript
import html2pdf from 'html2pdf.js';

const handleExportPDF = async () => {
  const element = document.getElementById('deck-slides-container');
  if (!element) return;
  
  const opt = {
    margin: 0,
    filename: `followup-deck.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
  };
  
  await html2pdf().set(opt).from(element).save();
};
```

---

## Animations (Required)

Use Framer Motion throughout:

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};
```

---

## Sample Transcript for Testing

Include this in the textarea placeholder or as a "Try Demo" button:

```
Sales Call - Acme Corp
Date: February 5, 2026
Participants: John Smith (VP Engineering, Acme), Sarah (Sales Rep)

Sarah: Thanks for taking the time today, John. I know you mentioned on our intro call that your team is struggling with deployment bottlenecks.

John: Yeah, absolutely. We're spending probably 15 hours a week just on manual deployment tasks. Our DevOps team is completely underwater. We looked at Jenkins but it felt too complex for what we need.

Sarah: That's exactly what we hear from a lot of engineering leaders. Our platform automates 90% of those manual tasks. How many deployments are you doing per week currently?

John: We're doing about 50 deployments across our three main services. The problem is each one requires manual approval steps and our staging environment is always broken.

Sarah: Got it. So the pain is both the manual approvals and environment reliability. Our automated approval workflows could help there, and our environment cloning feature means staging always mirrors production.

John: That sounds promising. What's the pricing look like? We have a budget of around $50k annually for tooling.

Sarah: We're definitely within that range. For a team your size, you'd be looking at our Team plan. I can send over detailed pricing after this call.

John: Great. We'd also need to make sure it integrates with GitHub. That's non-negotiable.

Sarah: Absolutely, GitHub integration is native. We also integrate with Slack for notifications. What's your timeline for making a decision?

John: We need to have something in place by Q2. So ideally we'd want to start a pilot in the next few weeks.

Sarah: Perfect. Let me send over a proposal with pricing and we can schedule a technical deep-dive with your team for next week. Does Tuesday work?

John: Tuesday works. Send me a few time options and I'll get my lead engineer on the call too.

Sarah: Sounds great, John. Thanks again for your time today.
```

---

## Completion Checklist

Before deploying:
- [ ] .env.local created with OPENAI_API_KEY
- [ ] npm run dev works
- [ ] Landing hero is visually striking (not generic)
- [ ] Typography is distinctive (custom Google Fonts loaded)
- [ ] Color palette is cohesive (CSS variables used throughout)
- [ ] Pasting transcript and clicking Generate calls the API
- [ ] Loading state shows while AI processes
- [ ] Deck preview shows 5 beautifully styled slides
- [ ] Slides look like real presentation slides (16:9, proper hierarchy)
- [ ] Navigation between slides works (arrows + dots)
- [ ] PDF export downloads a properly formatted file
- [ ] Copy Markdown works
- [ ] Animations are present and polished
- [ ] Error handling works (try empty/short transcript)
- [ ] npm run build succeeds with no errors

---

## Deploy to Vercel

```
npm run build
npm install -g vercel
vercel --prod --yes
vercel env add OPENAI_API_KEY production
vercel --prod --yes
```

Output the final live URL when complete.

---

## Execute Now

Build everything. Create all files. Implement all components with real, working, beautifully-styled code. 

The AI integration must work — real OpenAI calls, real transcript parsing, real slide generation.

Test locally with the sample transcript. Verify PDF export works. Then deploy to Vercel.

Do not stop. Do not ask questions. Make decisions and ship.

Return the live Vercel URL when complete.
