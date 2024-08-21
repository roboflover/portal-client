import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (req: NextRequest) => {
  try {
    console.log('upload')

    return NextResponse.json({ message: 'Order saved successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error saving order' }, { status: 500 });
  }
};