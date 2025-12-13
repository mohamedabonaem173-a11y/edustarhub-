// pages/api/send-confirmation.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, fullName, token } = req.body;
  if (!email || !token) return res.status(400).json({ error: 'Missing email or token' });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"EDUSTARHUB" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Confirm your EDUSTARHUB account',
      html: `
        <h2>Hello ${fullName || 'User'}!</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}">Verify Email</a>
      `,
    });

    return res.status(200).json({ message: 'Verification email sent' });
  } catch (err) {
    console.error('SMTP Error:', err);
    return res.status(500).json({ error: 'Failed to send verification email' });
  }
}
