import { NextRequest, NextResponse } from 'next/server';

/**
 * Twilio webhook for handling missed/unanswered calls
 * Configure this URL in your Twilio phone number settings under "A call comes in"
 * 
 * Flow:
 * 1. Customer calls your Twilio number
 * 2. Call goes unanswered or to voicemail
 * 3. Twilio hits this webhook with call details
 * 4. We initiate an AI callback within 60 seconds
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract call details from Twilio webhook
    const callData = {
      callSid: formData.get('CallSid') as string,
      from: formData.get('From') as string,
      to: formData.get('To') as string,
      callStatus: formData.get('CallStatus') as string,
      direction: formData.get('Direction') as string,
      callerName: formData.get('CallerName') as string || 'Unknown',
      timestamp: new Date().toISOString(),
    };

    console.log('Missed call received:', callData);

    // Only process missed/unanswered calls
    if (['no-answer', 'busy', 'failed', 'canceled'].includes(callData.callStatus)) {
      // Queue the callback (in production, use a job queue like Bull or Inngest)
      await queueCallback(callData);
    }

    // Return TwiML response (empty for missed call scenarios)
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
       <Response></Response>`,
      {
        headers: { 'Content-Type': 'application/xml' },
      }
    );
  } catch (error) {
    console.error('Error handling missed call webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function queueCallback(callData: {
  callSid: string;
  from: string;
  to: string;
  callStatus: string;
  direction: string;
  callerName: string;
  timestamp: string;
}) {
  // In production, this would add to a job queue
  // For now, we'll make a direct call to our callback endpoint
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Delay callback by a few seconds to avoid calling while customer might still be trying
  setTimeout(async () => {
    try {
      await fetch(`${baseUrl}/api/callback/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: callData.from,
          callerName: callData.callerName,
          originalCallSid: callData.callSid,
        }),
      });
    } catch (error) {
      console.error('Error initiating callback:', error);
    }
  }, 5000); // 5 second delay before callback
}
