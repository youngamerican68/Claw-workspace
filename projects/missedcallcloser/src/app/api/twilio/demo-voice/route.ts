import { NextRequest, NextResponse } from 'next/server';

/**
 * Demo voice handler - showcases MissedCallCloser to prospects
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const speechResult = formData.get('SpeechResult') as string | null;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (!speechResult) {
      // Initial greeting
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    Hi! This is a demo call from MissedCallCloser. 
    I'm the AI assistant that would call back your customers when you miss their call.
    
    Right now, I'm demonstrating what your customers would experience. 
    Go ahead and tell me why you're calling, and I'll show you how I respond.
  </Say>
  <Gather 
    input="speech" 
    timeout="5" 
    speechTimeout="auto"
    action="${baseUrl}/api/twilio/demo-voice"
    method="POST">
  </Gather>
  <Say voice="Polly.Joanna">
    I didn't catch that. Feel free to say something like "I need a plumber" or "I want to book an appointment" to see how I'd respond to your customers.
  </Say>
  <Gather 
    input="speech" 
    timeout="8" 
    speechTimeout="auto"
    action="${baseUrl}/api/twilio/demo-voice"
    method="POST">
  </Gather>
  <Say voice="Polly.Joanna">
    No worries! That concludes our demo. Visit missedcallcloser.com to get started. Thanks for trying us out!
  </Say>
</Response>`;

      return new NextResponse(twiml, {
        headers: { 'Content-Type': 'application/xml' },
      });
    }

    // Respond to demo input
    const aiResponse = getDemoResponse(speechResult);
    
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${escapeXml(aiResponse)}</Say>
  <Pause length="1"/>
  <Say voice="Polly.Joanna">
    That's a sample of how I'd respond to your customers. 
    
    In a real scenario, I'd continue the conversation, 
    gather their information, qualify their needs, 
    and either book an appointment or send you a summary.
    
    Ready to stop losing leads? Visit missedcallcloser.com to get started. 
    Thanks for trying the demo!
  </Say>
</Response>`;

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('Error in demo voice handler:', error);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    I'm sorry, I encountered an error. Please visit missedcallcloser.com to learn more. Goodbye!
  </Say>
</Response>`;

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}

function getDemoResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('plumb') || lowerInput.includes('leak') || lowerInput.includes('water')) {
    return "I understand you're having a plumbing issue. I'm sorry to hear that! Can you tell me a bit more about what's happening? Is it an emergency, or can it wait until tomorrow?";
  }

  if (lowerInput.includes('hvac') || lowerInput.includes('heat') || lowerInput.includes('air') || lowerInput.includes('ac')) {
    return "I can help with that! Is your heating or cooling system not working properly? Let me get some details so we can get a technician out to you as soon as possible.";
  }

  if (lowerInput.includes('appointment') || lowerInput.includes('book') || lowerInput.includes('schedule')) {
    return "Absolutely, I'd be happy to help you book an appointment. What day works best for you - would you prefer something this week, or is next week better?";
  }

  if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('quote') || lowerInput.includes('estimate')) {
    return "I can help you get pricing information. To give you an accurate quote, could you tell me what type of service you're looking for?";
  }

  if (lowerInput.includes('emergency') || lowerInput.includes('urgent') || lowerInput.includes('asap')) {
    return "I understand this is urgent. Let me prioritize this for you. I'm noting this as an emergency call, and we'll get someone to you as quickly as possible. Can you confirm your address?";
  }

  // Default response
  return "Got it, I understand. That's exactly the kind of inquiry I handle for businesses. I'd ask a few follow-up questions to understand your needs, then either book you an appointment or make sure the right person calls you back.";
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
