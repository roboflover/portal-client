import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  try {
    const response = await axios.get(`http://localhost:8085/auth/verify-email?token=${token}`);
    console.log('поймал токен')
    return NextResponse.json({ message: response.data.message }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
  }
}