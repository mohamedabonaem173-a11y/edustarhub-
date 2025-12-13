const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true,
  });

  try {
    const info = await transporter.sendMail({
      from: `"EDUSTARHUB" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: 'Test Email from EDUSTARHUB',
      text: 'This is a test email sent from localhost.',
    });
    console.log('Email sent successfully:', info.messageId);
  } catch (err) {
    console.error('SMTP Error:', err);
  }
}

testEmail();
