---
name: video-promo
description: Create promotional videos using Remotion. Use for promo clips, marketing videos, product demos, brand videos, animated explainers, or any request involving video creation with motion graphics.
---

# Video Promo

Create polished promotional videos using Remotion (React-based video framework).

## Quick Start

1. Clone template or create new project:
   cp -r ~/clawd/skills/video-promo/assets/remotion-template ~/clawd/<project-name>
   cd ~/clawd/<project-name> && npm install

2. Edit src/PromoVideo.tsx — customize scenes, colors, text, timing

3. Preview: npx remotion studio

4. Render: npx remotion render Main out/video.mp4

## Scene Structure (6-scene formula)

| Scene | Purpose | Duration |
|-------|---------|----------|
| 1. Hook | Attention-grabbing title | 4-6s |
| 2. Problem | Pain point the audience feels | 5-6s |
| 3. Solution | Introduce the product/brand | 5-6s |
| 4. Features | Key benefits (3 max) | 6-8s |
| 5. Proof | Social proof, examples, testimonials | 5-6s |
| 6. CTA | Call to action + URL | 5-6s |

Total: 30-40 seconds ideal for social.

## Color Palettes

Elegant/Premium:
{ primary: "#1a1a2e", secondary: "#16213e", accent: "#e94560", gold: "#d4a574", cream: "#faf3e0" }

Modern/Tech:
{ primary: "#0f0f0f", secondary: "#1a1a1a", accent: "#00d4ff", light: "#ffffff" }

Warm/Friendly:
{ primary: "#2d3436", secondary: "#636e72", accent: "#ff7675", warm: "#ffeaa7" }

## Animation Patterns

// Fade + slide in
const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
const y = spring({ frame, fps, from: 50, to: 0, durationInFrames: 30 });

// Scale pop
const scale = spring({ frame, fps, from: 0.8, to: 1, durationInFrames: 25 });

// Staggered items
{items.map((item, i) => {
  const delay = i * 15;
  const itemOpacity = interpolate(frame, [delay, delay + 20], [0, 1]);
  // ...
})}

## Adding Music

1. Place MP3 in public/ folder
2. Add to composition:

import { Audio, staticFile } from "remotion";
// In component:
<Audio src={staticFile("music.mp3")} volume={0.3} />

Royalty-free sources:
- Bensound.com — direct download links work
- Pixabay Music — need browser
- YouTube Audio Library — if logged in

Volume guide: 0.25-0.35 for background, 0.5-0.7 for featured.

## Render Settings

# Standard 1080p
npx remotion render Main out/video.mp4

# Instagram/TikTok vertical (modify composition dimensions to 1080x1920)
# Twitter/LinkedIn square (modify to 1080x1080)

## Invocation Examples

- "Create a promo video for [product]"
- "Make a 30-second marketing clip"
- "Build an animated explainer video"
- "Create a video like the Bucks Guide demo"
