//### `app/api/print3d/getOrders/route.ts`
//```typescript
import { NextRequest, NextResponse } from 'next/server';
import { OrderPrint3dProps } from '@/app/(site)/print3d/interface/zakazProps.interface';
import axios from 'axios';

const host = process.env.NEXT_PUBLIC_SERVER;

async function fetchOrdersByEmail(email: string): Promise<OrderPrint3dProps[]> {
  const response = await axios.get(`${host}/order-print3d/getOrders`, {
    params: { email },
  });
  return response.data;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const orders = await fetchOrdersByEmail(email);  // Обновленный вызов функции

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
