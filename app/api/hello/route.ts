import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email, message } = await req.json();
    console.log('Received message:', email); // Лог для проверки

    // Настройка транспортера Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "portal@robobug.ru",
        pass: "iuykebrfalfwiipf"
      }
    });

    const mailOptions = {
      from: "portal@robobug.ru",
      to: 'portal@robobug.ru',
      subject: 'Your Subject',
      text: message,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
