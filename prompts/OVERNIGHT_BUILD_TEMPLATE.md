# OVERNIGHT BUILD PRD TEMPLATE

Use this EXACT structure for ALL overnight build queue items.

---

```markdown
# AUTONOMOUS BUILD: [PROJECT_NAME]

Mode: Complete this entire build without asking questions. Make reasonable decisions. Do not stop for confirmations. Output the final path when complete.

---

## FRONTEND DESIGN SKILL

### Design Direction
- Purpose: [What problem does this solve? Who uses it?]
- Tone: [Pick ONE: brutally minimal / maximalist / retro-futuristic / luxury-refined / playful / editorial / brutalist / art-deco / soft-pastel / industrial]
- Differentiation: [What makes this UNFORGETTABLE?]

### Typography (NEVER use Inter, Roboto, Arial)
- Display: [e.g., "Instrument Serif", "Fraunces", "Playfair Display"]
- Body: [e.g., "Instrument Sans", "Commissioner", "Source Sans 3"]

### Color Palette (CSS variables)
--bg-primary: [hex]
--bg-secondary: [hex]
--text-primary: [hex]
--accent: [hex]

### Motion
- Page load: Staggered fade-in
- Hover states with transitions
- Number/data animations

---

## PROJECT OVERVIEW

[Context, inspiration, product vision]

## TECH STACK

[HTML/CSS/JS or React/Next.js, dependencies]

## FEATURES

### Feature 1: [Name]
- UI: [How it looks]
- Logic: [How it works]

[Repeat for all features]

## FILE STRUCTURE

```
project-name/
├── index.html
├── styles.css
├── app.js
└── serve.sh
```

## CORE LOGIC

[Key algorithms, data structures, sample code]

## SAMPLE TEST DATA

[Realistic test data to verify it works]

## COMPLETION CHECKLIST

- [ ] All files created
- [ ] Design matches spec
- [ ] All features working
- [ ] Animations present
- [ ] No console errors
- [ ] serve.sh executable

## FINAL DELIVERABLE

1. Create all files
2. Ensure project works with vercel --prod (static HTML or Next.js)
3. Output: "BUILD COMPLETE. Ready for Vercel deployment."

## EXECUTE NOW

Build everything. Do not stop. Do not ask questions. Ship it.
```

---

## TONE OPTIONS REFERENCE

| Tone | Best For | Visual Cues |
|------|----------|-------------|
| brutally minimal | Tools, dashboards | Monospace, high contrast, no decoration |
| maximalist | Creative, entertainment | Bold colors, layered elements, dense |
| retro-futuristic | Tech products | Gradients, glows, space-age fonts |
| luxury-refined | Premium products | Serifs, muted colors, generous whitespace |
| playful | Consumer apps | Rounded corners, bright colors, illustrations |
| editorial | Content, publications | Strong typography hierarchy, grid-based |
| brutalist | Developer tools | Raw, intentionally rough, exposed structure |
| art-deco | Finance, luxury | Geometric patterns, gold accents, symmetry |
| soft-pastel | Wellness, lifestyle | Muted colors, organic shapes, gentle |
| industrial | B2B, enterprise | Dark UI, data-dense, utilitarian |

## TYPOGRAPHY PAIRINGS REFERENCE

| Style | Display | Body |
|-------|---------|------|
| Editorial | Playfair Display | Source Serif Pro |
| Modern | Space Grotesk | DM Sans |
| Elegant | Cormorant Garamond | Lato |
| Tech | JetBrains Mono | IBM Plex Sans |
| Playful | Fraunces | Commissioner |
| Minimal | Instrument Serif | Instrument Sans |
| Bold | Bebas Neue | Work Sans |

## REMEMBER

1. NEVER use generic fonts (Inter, Roboto, Arial, Open Sans)
2. ALWAYS include motion/animations
3. ALWAYS make it Vercel-deployable
4. The "EXECUTE NOW" section is mandatory
5. Claude Code should complete without stopping
