import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
//   const token = searchParams.get('token');

  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  try {
    const params = qs.stringify({
        grant_type: 'client_credentials',   
        client_id,
        client_secret
      });

    const response = await axios.post('https://api.cdek.ru/v2/oauth/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return new Response(JSON.stringify({ access_token: response.data.access_token }), { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Предполагается, что токен передается в заголовке Authorization
  
    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is missing' }), { status: 401 });
    }
  
    try {
      const params = qs.stringify({
        country_codes: 'RU'
      });
  
      const response = await axios.get('https://api.cdek.ru/v2/location/regions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          country_codes: 'RU'
        }
      });
  
      return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
      console.error('Error fetching cities:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch cities' }), { status: 500 });
    }
  }