# AI SDR Agent - OpenClaw Skill

> **Status:** MVP Phase 1 (Email + Calendar) | Phase 2 (LinkedIn) In Development
>
> **Context:** Built in response to Jason Lemkin's (SaaStr) validation: AI agents generating $4.8M pipeline, $2.4M closed, doubling deal volume and win rates.

An AI-powered Sales Development Representative (SDR) skill for OpenClaw that automates outbound prospecting, follow-ups, and meeting booking.

## Capabilities

### ✅ Implemented (Phase 1 - MVP)
- **Email Agent**
  - Gmail/Outlook API integration
  - Personalized outbound email generation
  - Multi-touch follow-up cadences (Day 1, 3, 7, 14)
  - Open/reply tracking via webhook
  - A/B testing support
  
- **Calendar Integration**
  - Cal.com API for booking links
  - Google Calendar for availability checking
  - Meeting scheduling automation
  
- **Lead Qualification Scoring**
  - LLM-based scoring rubric
  - Company size, role, intent signal analysis
  - Priority queue management

### 🚧 In Development (Phase 2)
- **LinkedIn Agent**
  - Connection request automation
  - Follow-up messaging sequences
  - Profile enrichment scraping
  
- **Lead Enrichment**
  - Apollo.io API integration
  - Clearbit fallback
  - Email finder from LinkedIn URLs

## Installation

1. **Clone/Copy this skill** to your OpenClaw skills directory:
   ```bash
   cp -r skills/ai-sdr ~/.openclaw/skills/
   ```

2. **Install dependencies:**
   ```bash
   cd ~/.openclaw/skills/ai-sdr
   npm install
   ```

3. **Configure API keys:**
   ```bash
   cp config/config.template.json config/config.json
   # Edit config.json with your API keys
   ```

4. **Set up Gmail/Outlook OAuth:**
   - Follow Google Cloud Console setup for Gmail API
   - Or Azure AD setup for Microsoft Graph API
   - Store credentials in `config/gmail-credentials.json` or `config/outlook-credentials.json`

5. **Set up Cal.com:**
   - Get API key from https://cal.com/settings/developer
   - Add to config.json

## Quick Start

### Send a Single Outbound Email

```javascript
const { EmailAgent } = require('./src/agents/EmailAgent');

const agent = new EmailAgent();
await agent.sendOutbound({
  to: 'prospect@company.com',
  firstName: 'Sarah',
  company: 'Acme Corp',
  role: 'VP Engineering',
  triggerEvent: 'hiring_spike', // optional: recent hiring signal
  valueProp: 'reduce_infrastructure_costs'
});
```

### Run a Follow-up Cadence

```javascript
const { CadenceEngine } = require('./src/cadence/CadenceEngine');

const cadence = new CadenceEngine('standard_5_touch');
await cadence.enrollLead({
  email: 'prospect@company.com',
  firstName: 'Sarah',
  company: 'Acme Corp',
  source: 'linkedin_outreach'
});
```

### Generate Booking Link

```javascript
const { CalendarAgent } = require('./src/agents/CalendarAgent');

const calendar = new CalendarAgent();
const bookingLink = await calendar.getBookingLink({
  eventType: '30min-discovery',
  prefilled: {
    name: 'Sarah',
    email: 'sarah@company.com'
  }
});
```

### Score a Lead

```javascript
const { QualificationScorer } = require('./src/scoring/QualificationScorer');

const scorer = new QualificationScorer();
const score = await scorer.scoreLead({
  company: 'Acme Corp',
  employees: 500,
  role: 'VP Engineering',
  signals: ['hiring_devops', 'recent_funding', 'cloud_migration']
});
// Returns: { score: 87, tier: 'A', reasons: [...] }
```

## Configuration

See `config/config.template.json` for all configuration options:

```json
{
  "email": {
    "provider": "gmail",
    "credentialsPath": "./config/gmail-credentials.json",
    "fromName": "Your Name",
    "fromEmail": "you@yourcompany.com",
    "replyTo": "replies@yourcompany.com"
  },
  "calendar": {
    "provider": "calcom",
    "apiKey": "cal_live_...",
    "eventTypes": {
      "15min": 12345,
      "30min": 12346
    }
  },
  "scoring": {
    "model": "gpt-4",
    "weights": {
      "companySize": 0.3,
      "role": 0.25,
      "intent": 0.45
    }
  },
  "cadences": {
    "default": "standard_5_touch",
    "templatesDir": "./templates"
  },
  "tracking": {
    "webhookUrl": "https://your-domain.com/webhook/sdr",
    "pixelTracking": true
  }
}
```

## Workflow Scripts

Pre-built workflows in `workflows/`:

- `outbound-campaign.js` - Bulk email campaign with cadence
- `linkedin-to-email.js` - LinkedIn enrichment → email outreach
- `meeting-booker.js` - Auto-send booking links to qualified leads
- `daily-reports.js` - Generate performance reports

Run workflows:
```bash
node workflows/outbound-campaign.js --file leads.csv --cadence standard_5_touch
```

## Templates

Email templates use Handlebars syntax in `templates/`:

- `outbound-v1.hbs` - Initial outbound
- `followup-day-3.hbs` - First follow-up
- `followup-day-7.hbs` - Second follow-up  
- `breakup.hbs` - Final breakup email

Customize templates with your brand voice while keeping merge tags.

## API Reference

### EmailAgent

```javascript
class EmailAgent {
  // Send single personalized email
  async sendOutbound(options: EmailOptions): Promise<SendResult>
  
  // Send follow-up based on template
  async sendFollowup(leadId: string, step: number): Promise<SendResult>
  
  // Process reply (unsubscribe, book meeting, etc.)
  async processReply(reply: ReplyPayload): Promise<ActionResult>
  
  // Track opens/clicks
  async trackEvent(event: TrackingEvent): Promise<void>
}
```

### CadenceEngine

```javascript
class CadenceEngine {
  // Enroll lead in cadence sequence
  async enrollLead(lead: Lead, cadenceId?: string): Promise<Enrollment>
  
  // Advance lead to next step
  async advanceStep(leadId: string): Promise<void>
  
  // Pause/unpause lead
  async setLeadStatus(leadId: string, status: LeadStatus): Promise<void>
  
  // Get cadence stats
  async getStats(cadenceId?: string): Promise<CadenceStats>
}
```

### CalendarAgent

```javascript
class CalendarAgent {
  // Get booking link for event type
  async getBookingLink(options: BookingOptions): Promise<string>
  
  // Check availability
  async checkAvailability(dateRange: DateRange): Promise<Slot[]>
  
  // Book meeting directly
  async bookMeeting(slot: Slot, attendee: Attendee): Promise<Booking>
}
```

## Tracking & Analytics

All emails include tracking pixel and link wrapping. Webhook events:

- `email.opened` - Prospect opened email
- `email.clicked` - Prospect clicked link
- `email.replied` - Prospect replied
- `email.bounced` - Email bounced
- `meeting.booked` - Meeting scheduled
- `cadence.completed` - Finished all touches

## Best Practices

### Email Deliverability
1. Warm up domain gradually (start with 10/day, increase 20% weekly)
2. Use custom tracking domain (track.yourcompany.com)
3. Include unsubscribe link in all emails
4. Monitor bounce rate (< 5%) and spam complaints (< 0.1%)
5. Rotate sending domains if sending >500/day

### Personalization at Scale
1. Use signal-based triggers (hiring, funding, tech stack)
2. Reference specific company challenges
3. Keep subject lines under 50 characters
4. A/B test value props by persona

### Cadence Timing
- **Day 1:** Initial outbound (Tuesday-Thursday, 8-10am prospect time)
- **Day 3:** Follow-up #1 (bump thread)
- **Day 7:** Follow-up #2 (add value, case study)
- **Day 14:** Follow-up #3 (breakup email)
- **Day 21:** Move to nurture sequence

## Troubleshooting

### Gmail OAuth Issues
```bash
# Re-authenticate
node scripts/auth-gmail.js --force-refresh
```

### Rate Limiting
- Gmail: 500 emails/day per account
- Outlook: 300 emails/day per account
- Use multiple sender accounts for scale

### Cal.com Errors
Ensure event type IDs are correct in config. Test:
```bash
node scripts/test-calendar.js
```

## Roadmap

- [x] Email agent with Gmail/Outlook
- [x] Calendar integration (Cal.com + Google)
- [x] Cadence engine with 5-touch sequences
- [x] Lead qualification scoring
- [ ] LinkedIn automation (Phase 2)
- [ ] Lead enrichment (Apollo.io/Clearbit)
- [ ] Reply sentiment analysis
- [ ] Auto-responder detection
- [ ] CRM sync (Salesforce/HubSpot)

## Contributing

Built for OpenClaw. Submit PRs for review. See AGENTS.md for development guidelines.

## License

MIT - Commercial use permitted. Built for the SaaS community following Jason Lemkin's AI SDR validation.

---

> "AI agents generated $4.8M pipeline, $2.4M closed. Deal volume doubled, win rate doubled."
> — Jason Lemkin, SaaStr