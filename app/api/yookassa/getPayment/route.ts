// app/api/print3d/getOrders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { YooCheckout } from '@a2seven/yoo-checkout';

export async function GET(req: NextRequest) { 
    const { searchParams } = new URL(req.url); 
    const paymentId = searchParams.get('paymentId'); 

    if (!paymentId) { 
        return NextResponse.json({ message: 'Payment ID is required' }, { status: 400 }); 
    } 

    const secret_key = process.env.NEXT_PUBLIC_YOOKASSA_SECRET_KEY as string;
    const shop_id = process.env.NEXT_PUBLIC_YOOKASSA_SHOP_ID as string;

    const checkout = new YooCheckout({ shopId: shop_id, secretKey: secret_key });

    try { 
        const payment = await checkout.getPayment(paymentId); 
        return NextResponse.json({ status: payment.status }, { status: 200 }); 
    } catch (error) { 
        console.error('Error fetching payment information:', error); 
        return NextResponse.json({ message: 'Error fetching payment information' }, { status: 500 }); 
    } 
}
