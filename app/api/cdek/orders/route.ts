import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  try {
    // Запрос на получение токена
    const tokenParams = qs.stringify({
      grant_type: 'client_credentials',   
      client_id,
      client_secret
    });

    const tokenResponse = await axios.post('https://api.cdek.ru/v2/oauth/token', tokenParams, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const access_token = tokenResponse.data.access_token;
    const orderData = await req.json(); 
    const trimmedAddress = orderData.delivery_point.split(',')[0];

    const jsonData = {
      "number" : uuidv4(),
      "comment" : "Новый заказ",
      "delivery_recipient_cost" : {
        "value" : 50
      },
      "delivery_point" : trimmedAddress,
      "shipment_point" : orderData.shipment_point,
      "packages" : [ {
        "number" : "bar-001",
        "comment" : "Упаковка",
        "height" : 10,
        "items" : [ {
          "ware_key" : "00055",
          "payment" : {
            "value" : 0
          },
          "name" : "Товар",
          "cost" : 300,
          "amount" : 2,
          "weight" : 500,
          "url" : "robobug.ru"
        } ],
      "length" : 10,
      "weight" : 500,
      "width" : 10
      } ],
      "recipient" : {
        "name" : orderData.recipient.name,
        "phones" : [ {
        "number" : orderData.recipient.phones[0].number
      } ]
      },
      "sender" : {
        "name" : "Григорян Степан"
      },
      "tariff_code" : 136
    }

    const res = await axios.post('https://api.cdek.ru/v2/orders', jsonData, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    return new Response(JSON.stringify(res.data), { status: 200 });
  

 }
   catch (error) {
    console.error('Error registering order:', error);
    return NextResponse.json({ message: 'Order registration failed' }, { status: 500 });
  }
}
