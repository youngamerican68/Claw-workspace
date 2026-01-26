# MEMORY.md - Long-term Memory

*Curated memories and important context.*

---

## Infrastructure

- **Primary instance:** DigitalOcean droplet (NYC3), IP `68.183.51.209`, ID `547365319`
- **Local dev:** UTM VM on Paul's Mac (currently disabled to avoid Telegram polling conflicts)
- **Bot:** @DaddyClawdbot on Telegram

## Skills

- **video-promo**: Remotion-based video creation. Use for promo clips, marketing videos, explainers. Template at `skills/video-promo/assets/remotion-template/`

## Key Learnings

- Running two Clawdbot instances with the same Telegram bot token causes `getUpdates conflict` errors
- Solution: Use separate bot tokens for dev vs. prod, or only run one instance at a time
- UTM VM had a systemd user service (`clawdbot-gateway.service`) that auto-started — disabled with `systemctl --user disable clawdbot-gateway`

---

*First entry: January 26, 2026*
