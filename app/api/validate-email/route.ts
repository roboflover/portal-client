import { NextRequest, NextResponse } from 'next/server';
import validate from 'deep-email-validator';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ valid: false, reason: 'Email is required' }, { status: 400 });
  }

  try {
    const result = await validate(email);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error validating email:', error);
    return NextResponse.json({ valid: false, reason: 'Internal Server Error' }, { status: 500 });
  }
}