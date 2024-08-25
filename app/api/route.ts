import { NextResponse, NextRequest } from 'next/server';

export const GET = async () => {
  return NextResponse.json({ message: 'Hello, Next.js Version 13!' }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  // Do something

  return NextResponse.json({ message: 'Operation successful' }, { status: 200 });
};

 
 //  // pages/api/sendEmail.ts

  //  import { NextApiRequest, NextApiResponse } from 'next';
  //  import nodemailer from 'nodemailer';

  //  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //    if (req.method === 'POST') {
  //      const { email, message } = req.body;
  //      console.log('post1')

  //      // Настройка транспортера Nodemailer
  //      const transporter = nodemailer.createTransport({
  //       host: "smtp.yandex.ru",
  //       port: 465,
  //       secure: true, // true for 465, false for other ports
  //       auth: {
  //         user: "portal@yandex.ru", // generated ethereal user
  //         pass: "6vM-FBL-uab-SCq" // generated ethereal password
  //       }
  //     });

  //      const mailOptions = {
  //        from: process.env.EMAIL_USER,
  //        to: email,
  //        subject: 'Your Subject',
  //        text: message,
  //      };

  //      try {
  //       console.log('post2')
  //        await transporter.sendMail(mailOptions);
  //        res.status(200).json({ success: true });
  //      } catch (error) {
  //        console.error(error);
  //        res.status(500).json({ success: false, error: 'Failed to send email' });
  //      }
  //    } else {
  //      res.status(405).json({ success: false, error: 'Method not allowed' });
  //    }
  //  }