//api/yookassa/checkout/route.ts
import { YooCheckout } from '@a2seven/yoo-checkout';
import { NextResponse, NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request: NextRequest) => {

    const createPayload = await request.json();

    const secret_key = process.env.NEXT_PUBLIC_YOOKASSA_SECRET_KEY as string
    const shop_id = process.env.NEXT_PUBLIC_YOOKASSA_SHOP_ID as string
    //console.log(createPayload.idempotenceKey)
    const checkout = new YooCheckout({ shopId: shop_id, secretKey: secret_key });
    const idempotenceKey = uuidv4();
    try {
        const payment = await checkout.createPayment(createPayload, idempotenceKey);
        console.log('payment', payment)
        return NextResponse.json(payment, { status: 200 });
    } catch (error) {
         console.error(error);
    }
    return NextResponse.json({ message: 'Operation successful' }, { status: 200 });
  };

