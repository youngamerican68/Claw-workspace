import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook for Twilio call status updates
 * Tracks call progress and outcomes
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const statusData = {
      callSid: formData.get('CallSid') as string,
      callStatus: formData.get('CallStatus') as string,
      callDuration: formData.get('CallDuration') as string,
      from: formData.get('From') as string,
      to: formData.get('To') as string,
      timestamp: new Date().toISOString(),
    };

    console.log('Call status update:', statusData);

    // In production, update the call record in the database
    // and potentially trigger notifications

    if (statusData.callStatus === 'completed') {
      // Call completed - could send summary SMS to business owner
      await handleCompletedCall(statusData);
    }

    if (statusData.callStatus === 'no-answer' || statusData.callStatus === 'busy') {
      // Customer didn't answer our callback - could schedule a retry
      await handleUnansweredCallback(statusData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling call status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCompletedCall(data: {
  callSid: string;
  callStatus: string;
  callDuration: string;
  from: string;
  to: string;
  timestamp: string;
}) {
  console.log('Call completed:', {
    duration: data.callDuration,
    to: data.to,
  });

  // In production:
  // 1. Fetch conversation summary from AI
  // 2. Classify outcome (booked, callback_requested, not_interested)
  // 3. Send SMS notification to business owner
  // 4. Update CRM if integrated
}

async function handleUnansweredCallback(data: {
  callSid: string;
  callStatus: string;
  callDuration: string;
  from: string;
  to: string;
  timestamp: string;
}) {
  console.log('Callback not answered:', data.to);

  // In production:
  // 1. Schedule a retry in 30 minutes
  // 2. After 3 attempts, send SMS instead
  // 3. Log for follow-up
}
