# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## Browser (Headless Chromium + Puppeteer)

You have a headless browser. Use it to visit websites, read content, take screenshots, and extract links.

### Usage

```bash
# Read a page (returns clean markdown text)
node /root/.openclaw/workspace/browse.js https://example.com

# Full analysis (text + links + metadata)
node /root/.openclaw/workspace/browse.js https://example.com --full

# Screenshot (saves PNG)
node /root/.openclaw/workspace/browse.js https://example.com --screenshot

# Screenshot to specific path
node /root/.openclaw/workspace/browse.js https://example.com --screenshot --out /tmp/page.png

# Extract links only
node /root/.openclaw/workspace/browse.js https://example.com --links
```

### Options

- `--wait <ms>` — Extra wait for JS-heavy pages (default: 2000). Use 5000+ for SPAs.
- `--timeout <ms>` — Navigation timeout (default: 30000). Use 60000 for slow sites.
- `--out <path>` — Output path for screenshots.

### Notes

- This is a real browser — it renders JavaScript, handles cookies, follows redirects.
- Text output is truncated at 20,000 chars.
- Screenshots are full-page PNGs.
- For cookie-banner-heavy sites, the text may include consent dialog content.
