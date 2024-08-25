import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

export async function DELETE(req: NextRequest) {
  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  try {
    const cdekEntityUuid = await req.json();

    const tokenParams = qs.stringify({
      grant_type: 'client_credentials',   
      client_id,
      client_secret
    });

    const tokenResponse = await axios.post('https://api.cdek.ru/v2/oauth/token', tokenParams, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const access_token = tokenResponse.data.access_token;

    // DELETE запрос
    const res = await axios.delete(`https://api.cdek.ru/v2/orders/${cdekEntityUuid}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    // console.log(res.data);

    return new NextResponse(JSON.stringify(res.data), { status: 200 });
  
  } catch (error) {
    console.error('Error deleting order:', error);
    return new NextResponse(JSON.stringify({ message: 'Order deletion failed' }), { status: 500 });
  }
}