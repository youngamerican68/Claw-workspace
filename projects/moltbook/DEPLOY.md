# Moltbook-as-a-Service Deployment

## Quick Deploy

```bash
# 1. Copy project to preview system
sudo mkdir -p /var/www/previews/moltbook
sudo cp -r landing-page/* /var/www/previews/moltbook/
sudo chown -R www-data:www-data /var/www/previews/moltbook

# 2. Skill installation
cp -r skills/moltbook ~/.openclaw/skills/

# 3. Verify
ls -la /var/www/previews/moltbook/
```

## Access

- Landing Page: http://68.183.51.209/moltbook/
- Project Files: /root/.openclaw/workspace/projects/moltbook/

## Files Created

Total: 15 files across 8 directories
- Core: SKILL.md, notion-client.js, orchestrator.js
- Scripts: write-handoff.js, read-handoff.js, notify-human.js
- Examples: blog-workflow, research-report
- Docs: setup.md, DEPLOY.md
- Tests: test-suite.js
- Config: package.json, .env.example
- Landing: index.html

Status: ✅ Complete
