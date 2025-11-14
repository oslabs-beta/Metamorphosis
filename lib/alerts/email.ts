import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;
let lastEmailTime = 0;
const THROTTLE_MS = 60000; // 1 minute

export function initializeEmailTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'sonia.schinner85@ethereal.email',
        pass: process.env.SMTP_PASS || 'test',
      },
    });
  }
  return transporter;
}

export async function throttledSendEmail(
  to: string,
  subject: string,
  text?: string
): Promise<void> {
  const now = Date.now();
  
  if (now - lastEmailTime < THROTTLE_MS) {
    console.log('Email throttled, skipping...');
    return;
  }

  lastEmailTime = now;

  try {
    const emailTransporter = initializeEmailTransporter();
    await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'metamorphosis@example.com',
      to,
      subject,
      text: text || 'Please check your Kafka\'s health',
    });
    console.log(`Alert email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

