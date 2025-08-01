import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Performance optimizations
  pool: true, // Use pooled connections
  maxConnections: 5, // Maximum number of connections to pool
  maxMessages: 100, // Maximum number of messages per connection
  rateLimit: 5, // Maximum number of messages per second
  // Timeout settings
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000, // 5 seconds
  socketTimeout: 10000, // 10 seconds
  // Remove debug mode for production performance
  debug: false,
  logger: false, // Disable logging for better performance
});

export default transporter;