import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (req: NextRequest) => {
  try {
    console.log('save')
    const formData = await req.formData();
    let orderData: { [key: string]: string } = {};

    formData.forEach((value, key) => {
      orderData[key] = value.toString();
    });

    const newOrder = { ...orderData, id: uuidv4() };

    // TODO: Save newOrder to your database here

    return NextResponse.json({ message: 'Order saved successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error saving order' }, { status: 500 });
  }
};