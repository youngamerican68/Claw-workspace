import { NextRequest, NextResponse } from 'next/server';

/**
 * Voice handler for AI conversations
 * This generates TwiML that controls the call flow
 * 
 * Options for AI voice:
 * 1. Twilio <Gather> with <Say> - Simple but robotic
 * 2. Twilio <Stream> with OpenAI Realtime - Natural conversation
 * 3. Twilio <Connect> with external voice bot - Most flexible
 */

const BUSINESS_NAME = process.env.BUSINESS_NAME || 'our company';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const speechResult = formData.get('SpeechResult') as string | null;
    const digits = formData.get('Digits') as string | null;
    const callSid = formData.get('CallSid') as string;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Initial greeting if no speech result yet
    if (!speechResult && !digits) {
      return generateGreeting(baseUrl);
    }

    // Process the customer's response
    if (speechResult) {
      const response = await processWithAI(speechResult, callSid);
      return generateResponse(response, baseUrl);
    }

    // Handle keypad input
    if (digits) {
      return handleKeypadInput(digits, baseUrl);
    }

    return generateGreeting(baseUrl);
  } catch (error) {
    console.error('Error in voice handler:', error);
    return generateErrorResponse();
  }
}

function generateGreeting(baseUrl: string) {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    Hi! This is an AI assistant calling on behalf of ${BUSINESS_NAME}. 
    I noticed you tried to reach us a moment ago. How can I help you today?
  </Say>
  <Gather 
    input="speech" 
    timeout="5" 
    speechTimeout="auto"
    action="${baseUrl}/api/twilio/voice-handler"
    method="POST">
  </Gather>
  <Say voice="Polly.Joanna">
    I didn't catch that. Press 1 to speak with someone, or press 2 to leave a message.
  </Say>
  <Gather 
    input="dtmf" 
    timeout="10" 
    numDigits="1"
    action="${baseUrl}/api/twilio/voice-handler"
    method="POST">
  </Gather>
  <Say voice="Polly.Joanna">
    Thank you for calling. Goodbye!
  </Say>
</Response>`;

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

async function processWithAI(customerInput: string, callSid: string): Promise<string> {
  // If OpenAI is not configured, use simple response logic
  if (!OPENAI_API_KEY) {
    return generateSimpleResponse(customerInput);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant making a callback on behalf of ${BUSINESS_NAME}. 
Your goal is to:
1. Understand what the customer needs
2. Qualify if they're a good lead (what service, urgency, budget)
3. Offer to book an appointment or take a message
4. Be friendly, professional, and concise

Keep responses under 2-3 sentences. Don't be pushy.
If they want to book, say you'll connect them or take their preferred time.
If they're not interested, thank them politely.`,
          },
          {
            role: 'user',
            content: customerInput,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || generateSimpleResponse(customerInput);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateSimpleResponse(customerInput);
  }
}

function generateSimpleResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  // Intent detection with simple keyword matching
  if (lowerInput.includes('appointment') || lowerInput.includes('book') || lowerInput.includes('schedule')) {
    return "I'd be happy to help you book an appointment. What day and time works best for you?";
  }

  if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('quote')) {
    return "I can help with pricing information. Could you tell me a bit more about what service you need?";
  }

  if (lowerInput.includes('emergency') || lowerInput.includes('urgent')) {
    return "I understand this is urgent. Let me get you connected with someone right away. Please hold.";
  }

  if (lowerInput.includes('no') || lowerInput.includes('not interested') || lowerInput.includes('wrong number')) {
    return "No problem at all. Thank you for your time. Have a great day!";
  }

  // Default response
  return "I understand. Could you tell me more about what you're looking for, and I'll make sure the right person follows up with you?";
}

function generateResponse(aiResponse: string, baseUrl: string) {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${escapeXml(aiResponse)}</Say>
  <Gather 
    input="speech" 
    timeout="5" 
    speechTimeout="auto"
    action="${baseUrl}/api/twilio/voice-handler"
    method="POST">
  </Gather>
  <Say voice="Polly.Joanna">
    Is there anything else I can help you with?
  </Say>
  <Gather 
    input="speech" 
    timeout="5" 
    speechTimeout="auto"
    action="${baseUrl}/api/twilio/voice-handler"
    method="POST">
  </Gather>
  <Say voice="Polly.Joanna">
    Thank you for your time. Someone from our team will follow up with you shortly. Goodbye!
  </Say>
</Response>`;

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

function handleKeypadInput(digits: string, baseUrl: string) {
  let responseText: string;

  switch (digits) {
    case '1':
      responseText = "I'll connect you with someone right away. Please hold.";
      // In production, would <Dial> to a real number
      break;
    case '2':
      responseText = "Please leave your message after the tone, and we'll get back to you shortly.";
      // In production, would <Record> a voicemail
      break;
    default:
      responseText = "I didn't understand that selection. Press 1 to speak with someone, or press 2 to leave a message.";
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${responseText}</Say>
  ${digits === '2' ? `
  <Record 
    maxLength="120" 
    action="${baseUrl}/api/twilio/voicemail"
    transcribe="true"
    transcribeCallback="${baseUrl}/api/twilio/transcription"
  />` : ''}
  ${digits === '1' ? `<Say voice="Polly.Joanna">We're connecting you now. Thank you for your patience.</Say>` : ''}
</Response>`;

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

function generateErrorResponse() {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    I'm sorry, I'm having some technical difficulties. 
    Please try calling back, or leave a message and we'll return your call shortly.
  </Say>
</Response>`;

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
