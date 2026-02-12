# MEMORY.md - Long-term Memory

*Curated memories and important context.*

---

## Landing Page Preview System

**Purpose:** Quick hosting for generated landing pages so Paul can view them in browser.

**Setup:**
- Directory: `/var/www/previews/[project-name]/`
- URL: `http://68.183.51.209/[project-name]/`
- Nginx config: `/etc/nginx/sites-available/previews` (serves `/var/www/previews` at root)

**To deploy a new landing page:**
```bash
sudo mkdir -p /var/www/previews/[name]
sudo cp /path/to/index.html /var/www/previews/[name]/
sudo chown -R www-data:www-data /var/www/previews/[name]
```

**Access:** http://68.183.51.209/[name]/

**Notes:**
- No auth currently (publicly accessible)
- Manual cleanup for now (no auto-delete)
- Nginx autoindex enabled for browsing

---

## Landing Page Preview System

**Purpose:** Quick hosting for generated landing pages so Paul can view them in browser.

**Setup:**
- Directory: `/var/www/previews/[project-name]/`
- URL: `http://68.183.51.209/[project-name]/`
- Nginx config: `/etc/nginx/sites-available/previews` (serves `/var/www/previews` at root)

**To deploy a new landing page:**
```bash
sudo mkdir -p /var/www/previews/[name]
sudo cp /path/to/index.html /var/www/previews/[name]/
sudo chown -R www-data:www-data /var/www/previews/[name]
```

**Access:** http://68.183.51.209/[name]/

**Notes:**
- No auth currently (publicly accessible)
- Manual cleanup for now (no auto-delete)
- Nginx autoindex enabled for browsing

---

## Infrastructure

- **Primary instance:** DigitalOcean droplet (NYC3), IP `68.183.51.209`, ID `547365319`
- **Local dev:** UTM VM on Paul's Mac (currently disabled to avoid Telegram polling conflicts)
- **Bot:** @DaddyClawdbot on Telegram
- **GitHub repo:** Workspace synced to `github.com/youngamerican68/Claw-workspace` — can push code using git commands

## Skills

- **video-promo**: Remotion-based video creation. Use for promo clips, marketing videos, explainers. Template at `skills/video-promo/assets/remotion-template/`

## Planned Features

- **Twitter monitoring**: Cron jobs to check Following + For You feeds (requires browser setup)

## Product Validation Framework (CRITICAL)

**Before recommending ANY build, answer these questions:**

1. **Who specifically pays for this?**
   - Not vague personas ("sales reps") — specific segments (enterprise AEs closing $100K+ deals)
   - If the answer is "everyone," it's probably no one

2. **What's the current workaround?**
   - If people solve this with an email and move on, demand is weak
   - Manual workarounds that involve real pain (hours/week) = signal
   - "They just don't do it" might mean they don't need to

3. **Why hasn't a well-funded player done this?**
   - If Gong/Salesforce/etc. could do this trivially and haven't, ask why
   - The gap might exist because demand is weak, not because no one thought of it
   - Adjacent tools not merging = possible signal of low demand

4. **What's the wedge?**
   - A demo isn't a product
   - What integration/lock-in makes this sticky?
   - "Paste text, get output" is a feature, not a business

5. **Is this original AND monetizable?**
   - Technically possible ≠ market viable
   - Podcast hosts doing something manually = anecdote, not validation
   - Look for: repeated complaints, people paying for bad solutions, failed startups in the space (why did they fail?)

**The SalesDeck AI Lesson (Feb 2026):**
Built a transcript→deck tool based on a podcast mention. Looked like a gap between call intelligence tools (Gong, Sybill) and deck generators (Gamma, Tome). But the gap exists because most sales reps send emails, not decks. Decks only matter for enterprise deals with buying committees. The "build" was a good workflow test but weak product thinking. Demo, not product.

---

## Key Learnings

- Running two Clawdbot instances with the same Telegram bot token causes `getUpdates conflict` errors
- Solution: Use separate bot tokens for dev vs. prod, or only run one instance at a time
- UTM VM had a systemd user service (`clawdbot-gateway.service`) that auto-started — disabled with `systemctl --user disable clawdbot-gateway`
- Snap Chromium has AppArmor restrictions on headless servers — use Playwright's Chromium instead
- Browser config: `browser.headless: true` and `browser.noSandbox: true` for server operation

---

*First entry: January 26, 2026*
