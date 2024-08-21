// app/api/yookassa/getPayment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { YooCheckout } from '@a2seven/yoo-checkout';

export async function GET(req: NextRequest) { 

    
    try { 
        return NextResponse.json('payment', { status: 200 }); 
    } catch (error) { 
        console.error('Error fetching payment information:', error); 
        return NextResponse.json({ message: 'Error fetching payment information' }, { status: 500 }); 
    } 
}