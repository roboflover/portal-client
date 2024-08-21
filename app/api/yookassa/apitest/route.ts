// pages/api/createPayment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface PaymentResponse {
  id: string;
  status: string;
  amount: {
    value: string;
    currency: string;
  };
  // Добавьте другие поля из ответа, если необходимо
}

export async function POST(res: NextApiResponse) {

  const SHOP_ID = process.env.NEXT_PUBLIC_YOOKASSA_SHOP_ID;
  const SECRET_KEY = process.env.NEXT_PUBLIC_YOOKASSA_SECRET_KEY;
  const idempotenceKey = uuidv4(); // Создаем уникальный ключ идемпотентности

  if (!SHOP_ID || !SECRET_KEY) {
    res.status(500).json({ error: "Missing API credentials" });
    return;
  }

  try {
    const response = await axios.post<PaymentResponse>(
      'https://api.yookassa.ru/v3/payments',
      {
        amount: {
          value: "2.00",
          currency: "RUB"
        },
        confirmation: {
          type: "embedded"
        },
        capture: true,
        description: "Заказ №72"
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString('base64')}`,
          'Idempotence-Key': idempotenceKey,
          'Content-Type': 'application/json',
        }
      }
    );
    console.log(response.data)
    // res.status(200).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  }
}
