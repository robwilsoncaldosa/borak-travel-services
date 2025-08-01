import transporter from '../config/mailer';
import { Request, Response } from 'express';
import emailService from '../services/emailService';



export const sendContactEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, mobileNumber, message } = req.body;

        // Validate required fields
        if (!fullName || !email || !mobileNumber) {
            res.status(400).json({
                success: false,
                message: 'Full name, email, and mobile number are required'
            });
            return;
        }

        // Prepare SMTP notification content
        const smtpNotificationContent = `
New Contact Form Submission Notification

A new contact form has been submitted on your website.

Details:
- Name: ${fullName}
- Email: ${email}
- Mobile Number: ${mobileNumber}
- Message: ${message || 'No message provided'}
- Submitted on: ${new Date().toLocaleString()}

This is an automated notification to inform you of the new submission.
        `;

        const smtpNotificationHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2E2E2E; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2E2E2E; }
        .value { margin-left: 10px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .notification { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Contact Form Submission</h2>
            <p>Website Notification</p>
        </div>
        <div class="content">
            <div class="notification">
                <strong>🔔 Notification:</strong> A new contact form has been submitted on your website.
            </div>
            <div class="field">
                <span class="label">Name:</span>
                <span class="value">${fullName}</span>
            </div>
            <div class="field">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
            </div>
            <div class="field">
                <span class="label">Mobile Number:</span>
                <span class="value">${mobileNumber}</span>
            </div>
            <div class="field">
                <span class="label">Message:</span>
                <span class="value">${message || 'No message provided'}</span>
            </div>
            <div class="field">
                <span class="label">Submitted on:</span>
                <span class="value">${new Date().toLocaleString()}</span>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated notification from your website contact form.</p>
        </div>
    </div>
</body>
</html>
        `;

        // Send main emails and SMTP notification in parallel
        const promises: Promise<any>[] = [
            emailService.sendContactFormEmail({
                fullName,
                email,
                mobileNumber,
                message: message || ''
            })
        ];

        // Add SMTP notification if SMTP_USER is different from user email
        if (process.env.SMTP_USER && process.env.SMTP_USER !== email) {
            promises.push(
                transporter.sendMail({
                    from: `"BORAK Website Notification" <${process.env.SMTP_USER}>`,
                    to: process.env.SMTP_USER,
                    subject: `🔔 New Contact Form Submission from ${fullName}`,
                    text: smtpNotificationContent,
                    html: smtpNotificationHtml,
                }).catch((error: any) => {
                    console.error('Failed to send SMTP user notification:', error);
                    return null; // Don't fail the main request
                })
            );
        }

        // Wait for all emails to complete with timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Email timeout')), 15000); // 15 second timeout
        });

        const results = await Promise.race([
            Promise.all(promises),
            timeoutPromise
        ]) as any[];

        const mainResult = results[0];

        if (mainResult && mainResult.success) {
            console.log('Contact email sent successfully.');
            res.status(200).json({
                success: true,
                message: mainResult.message
            });
        } else {
            console.error('Contact email send failed:', mainResult?.message);
            res.status(500).json({
                success: false,
                message: mainResult?.message || 'Failed to send email'
            });
        }
    } catch (error) {
        console.error('Contact email send failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email. Please try again later.'
        });
    }
};
