 doPricing.droplet[doDropletSize] + 
                 (hasPostgres ? doPricing.postgres : 0) + 
                 (hasRedis ? doPricing.redis : 0);
  
  const monthlySavings = herokuCost - doCost;
  const yearlySavings = monthlySavings * 12;
  
  return { herokuCost, doCost, monthlySavings, yearlySavings };
}
```

### Deployment

**Platform:** Vercel (recommended) or Netlify
**Domain:** herokuescape.com (purchase if available) or subdomain (heroku.yourdomain.com)
**SSL:** Auto-provisioned by Vercel/Netlify

### Analytics

**Tool:** Plausible (privacy-friendly) or Google Analytics 4
**Track:**
- Page views
- Calculator usage (how many people calculate)
- Email signups (conversion rate)
- DO affiliate clicks (revenue indicator)
- Stack selections (which template to build first)

### Completion Checklist

- [ ] Hero section with headline and CTA
- [ ] Cost calculator with all input fields (dyno type, count, database, data transfer)
- [ ] Calculator logic working (accurate Heroku vs DO pricing)
- [ ] Stack survey (Django/Rails/Node/Laravel/Other) with conditional display
- [ ] Email capture form connected to Formspree
- [ ] DO affiliate link in place: `https://m.do.co/c/596df9171cd4`
- [ ] OG tags for social sharing (title, description, image)
- [ ] Twitter Card metadata
- [ ] Meta description and page title
- [ ] JSON-LD structured data
- [ ] Mobile responsive (test on actual phone)
- [ ] Animations working (fade ins, calculator reveal)
- [ ] Formspree submitting to Google Sheet
- [ ] Deployed to Vercel/Netlify with custom domain
- [ ] Analytics installed and tracking
- [ ] Tested end-to-end (calculate → survey → email submit)
- [ ] OG image created and deployed

### Success Metrics (Post-Launch)

**Week 1 Goals:**
- 100+ unique visitors
- 20+ email signups
- 5+ stack survey responses
- 2+ DO affiliate clicks

**Go/No-Go for Phase 2 (Templates):**
- ≥20 email signups = build templates
- <10 email signups = reassess messaging or abandon

### Notes for Builder

1. **Use Tailwind CSS via CDN** — fastest setup, no build step
2. **Single HTML file** — simpler deployment, faster load
3. **Inline all CSS/JS** — no external dependencies except Tailwind CDN
4. **Test calculator thoroughly** — pricing must be accurate or credibility is lost
5. **Mobile-first** — most traffic will be mobile, test there first
6. **Keep it simple** — fancy features can be added in v2 if validation succeeds

### Post-Build Actions (For Paul to Review)

1. Share landing page URL for feedback
2. Post on Twitter/X with Heroku shutdown context
3. Share on Reddit (r/django, r/rails, r/webdev, r/heroku)
4. Submit to Hacker News as "Show HN"
5. Monitor Formspree submissions and Google Sheet
6. Check Plausible analytics daily

---

**Status:** Ready for overnight build
**Builder:** Pick up and complete autonomously
**Questions:** None (make reasonable decisions per Mode directive)