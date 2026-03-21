import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
const { getDb } = require('@/lib/db');

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message required' }, { status: 400 });
    }
    const db = getDb();
    db.prepare('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);

    // Send email notification to vejandlasai41@gmail.com
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'your-email@gmail.com', // To be configured in .env
          pass: process.env.EMAIL_PASS || 'your-app-password', // To be configured in .env
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER || email,
        to: 'vejandlasai41@gmail.com',
        subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
        html: `<h3>New Message from VidyaRise Contact Form</h3>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\\n/g, '<br>')}</p>`,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // We continue to return success as the message is saved in the database
    }

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
