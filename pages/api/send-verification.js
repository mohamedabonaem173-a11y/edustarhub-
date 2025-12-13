import nodemailer from 'nodemailer';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { email, fullName, verificationToken } = req.body;

  if (!email || !verificationToken) return res.status(400).send('Missing email or token');

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const info = await transporter.sendMail({
      from: `"EDUSTARHUB" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Confirm your EDUSTARHUB account',
      html: `
        <h2>Hello ${fullName || 'User'}!</h2>
        <p>Click the link below to confirm your email:</p>
        <a href="${baseUrl}/verify?token=${verificationToken}">Confirm Email</a>
      `,
    });

    res.status(200).json({ message: 'Verification email sent', info });
  } catch (err) {
    console.error('SMTP Error:', err);
    res.status(500).json({ error: 'Failed to send verification email', details: err });
  }
}
