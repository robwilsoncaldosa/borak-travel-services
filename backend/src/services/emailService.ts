import transporter from '../config/mailer';
import { Request } from 'express';

// Email interfaces
export interface ContactFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  message: string;
}

export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

// Email service class
export class EmailService {
  private static instance: EmailService;
  private defaultFrom: string;

  private constructor() {
    this.defaultFrom = `"Borak Travel Services" <${process.env.SMTP_USER}>`;
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send contact form email
  public async sendContactFormEmail(formData: ContactFormData): Promise<EmailResponse> {
    try {
      const { fullName, email, mobileNumber, message } = formData;
      
      // Email to admin
      const adminEmail = process.env.ADMIN_EMAIL || 'borak@gmail.com';
      
      const adminSubject = 'New Contact Form Submission - Borak Travel Services';
      const adminHtml = this.generateContactFormAdminEmail(formData);
      
      const userSubject = 'Thank you for contacting Borak Travel Services';
      const userHtml = this.generateContactFormUserEmail(formData);
      
      // Send both emails in parallel for faster response
      const [adminResult, userResult] = await Promise.all([
        this.sendEmail({
          from: this.defaultFrom,
          to: adminEmail,
          subject: adminSubject,
          html: adminHtml,
        }),
        this.sendEmail({
          from: this.defaultFrom,
          to: email,
          subject: userSubject,
          html: userHtml,
        })
      ]);

      // Check if both emails were sent successfully
      if (adminResult.success && userResult.success) {
        return {
          success: true,
          message: 'Contact form submitted successfully. You will receive a confirmation email shortly.',
        };
      } else {
        // If one fails, still return success but log the issue
        console.warn('One or more emails failed to send:', { adminResult, userResult });
        return {
          success: true,
          message: 'Contact form submitted successfully. You will receive a confirmation email shortly.',
        };
      }
    } catch (error) {
      console.error('Error sending contact form email:', error);
      return {
        success: false,
        message: 'Failed to send contact form email. Please try again later.',
      };
    }
  }

  // Generic email sending method
  public async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    try {
      const mailOptions = {
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', info.messageId);
      
      return {
        success: true,
        message: 'Email sent successfully',
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: 'Failed to send email',
      };
    }
  }

  // Generate admin email HTML for contact form
  private generateContactFormAdminEmail(formData: ContactFormData): string {
    const { fullName, email, mobileNumber, message } = formData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2E2E2E; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #2E2E2E; }
          .value { margin-top: 5px; }
          .message-box { background-color: white; padding: 15px; border-left: 4px solid #2E2E2E; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>Borak Travel Services</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Full Name:</div>
              <div class="value">${fullName}</div>
            </div>
            <div class="field">
              <div class="label">Email Address:</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Mobile Number:</div>
              <div class="value">${mobileNumber}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${message || 'No message provided'}</div>
            </div>
            <div class="field">
              <div class="label">Submission Time:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate user confirmation email HTML
  private generateContactFormUserEmail(formData: ContactFormData): string {
    const { fullName } = formData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for contacting us</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2E2E2E; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for contacting us!</h1>
            <p>Borak Travel Services</p>
          </div>
          <div class="content">
            <p>Dear ${fullName},</p>
            <p>Thank you for reaching out to Borak Travel Services. We have received your message and will get back to you as soon as possible.</p>
            <p>Our team typically responds within 24-48 hours during business days.</p>
            <p>If you have any urgent inquiries, please feel free to call us at:</p>
            <ul>
              <li>Phone: +1 234 567 890</li>
              <li>Email: borak@gmail.com</li>
            </ul>
            <p>Best regards,<br>The Borak Travel Services Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default EmailService.getInstance(); 