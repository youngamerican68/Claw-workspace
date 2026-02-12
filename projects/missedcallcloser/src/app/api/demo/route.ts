import { NextRequest, NextResponse } from 'next/server';

/**
 * Demo endpoint for landing page
 * Allows prospects to experience the AI callback themselves
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Rate limiting (simple in-memory, use Redis in production)
const recentDemos = new Map<string, number>();
const DEMO_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour between demos per number

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    // Normalize phone number
    const normalizedNumber = normalizePhoneNumber(phoneNumber);
    if (!normalizedNumber) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    // Check rate limit
    const lastDemo = recentDemos.get(normalizedNumber);
    if (lastDemo && Date.now() - lastDemo < DEMO_COOLDOWN_MS) {
      const waitMinutes = Math.ceil((DEMO_COOLDOWN_MS - (Date.now() - lastDemo)) / 60000);
      return NextResponse.json({
        error: `Please wait ${waitMinutes} minutes before requesting another demo call`,
      }, { status: 429 });
    }

    // Check if Twilio is configured
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      // Demo mode - just acknowledge
      console.log('Demo requested (Twilio not configured):', normalizedNumber);
      return NextResponse.json({
        success: true,
        message: 'Demo mode - Twilio not configured. In production, you would receive a call within 60 seconds.',
        demo: true,
      });
    }

    // Make the demo call
    const twilio = require('twilio');
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const call = await client.calls.create({
      from: TWILIO_PHONE_NUMBER,
      to: normalizedNumber,
      url: `${baseUrl}/api/twilio/demo-voice`,
      statusCallback: `${baseUrl}/api/twilio/call-status`,
    });

    // Record demo usage
    recentDemos.set(normalizedNumber, Date.now());

    return NextResponse.json({
      success: true,
      message: 'Demo call initiated! You should receive a call within 60 seconds.',
      callSid: call.sid,
    });
  } catch (error) {
    console.error('Error initiating demo:', error);
    return NextResponse.json({ error: 'Failed to initiate demo call' }, { status: 500 });
  }
}

function normalizePhoneNumber(phone: string): string | null {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // US number validation (10 or 11 digits)
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // International number (assume valid if 10+ digits)
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }

  return null;
}
