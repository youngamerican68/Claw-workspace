# MissedCallCloser

AI-powered callback system that calls back your missed leads within 60 seconds.

## Features

- 📞 **Instant Callbacks** - AI calls back missed calls within 60 seconds
- 🤖 **Smart Conversations** - Natural AI dialogue that qualifies leads
- 📅 **Auto-Booking** - Books appointments directly into your calendar
- 📱 **SMS Summaries** - Get notified with call summaries instantly
- 📊 **Dashboard** - Track all calls, outcomes, and conversion rates

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Voice**: Twilio Programmable Voice
- **AI**: OpenAI GPT-4o-mini for conversations
- **Hosting**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- Twilio account with a phone number
- OpenAI API key

### Installation

1. Clone and install dependencies:
   ```bash
   cd projects/missedcallcloser
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Configure your `.env.local`:
   ```
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   TWILIO_ACCOUNT_SID=ACxxx
   TWILIO_AUTH_TOKEN=xxx
   TWILIO_PHONE_NUMBER=+15551234567
   OPENAI_API_KEY=sk-xxx
   BUSINESS_NAME=Your Business Name
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

### Twilio Setup

1. Get a Twilio phone number from console.twilio.com
2. Configure the phone number's webhook:
   - Voice webhook: `https://your-domain.com/api/twilio/missed-call`
   - Method: POST
3. For local development, use ngrok:
   ```bash
   ngrok http 3000
   ```

## API Routes

| Route | Description |
|-------|-------------|
| `POST /api/twilio/missed-call` | Webhook for incoming calls |
| `POST /api/callback/initiate` | Triggers AI callback |
| `POST /api/twilio/voice-handler` | Handles AI conversation |
| `POST /api/twilio/call-status` | Call status updates |
| `POST /api/demo` | Demo callback for prospects |

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

### Manual

```bash
npm run build
npm start
```

## Pricing Model

- **Starter** ($79/mo): 100 AI minutes, 1 number
- **Pro** ($199/mo): Unlimited minutes, 3 numbers, calendar integration
- **Enterprise**: Custom pricing, API access, white-label

## Costs

Per call cost breakdown:
- Twilio voice: ~$0.02/min
- OpenAI API: ~$0.001/call
- Total: ~$0.03-0.05 per minute of AI conversation

At $79/mo for 100 minutes, margin is healthy even with heavy usage.

## Roadmap

- [ ] Database integration (PostgreSQL/Prisma)
- [ ] Calendly/Cal.com integration
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] OpenAI Realtime API for more natural voice
- [ ] Multi-language support
- [ ] Voicemail transcription
- [ ] SMS follow-up campaigns

## License

MIT
