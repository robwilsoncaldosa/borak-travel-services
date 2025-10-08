# Email Setup Guide for BORAK Travel Services

## Overview
The contact form now sends emails using nodemailer with the following features:
- Sends contact form submissions to the business owner
- Sends confirmation emails to customers
- Uses professional HTML email templates
- Handles errors gracefully

## Environment Variables Required

Add these to your `.env` file in the backend directory:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Business Email (where contact form submissions will be sent)
ADMIN_EMAIL=work.boraktravel@gmail.com
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## Testing the Email Functionality

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the contact form** by filling out the form on the frontend

3. **Check the console logs** for email sending status

4. **Verify emails are received** by both the business owner and the customer

## API Endpoints

- `POST /api/email/contact` - Handle contact form submissions
- `POST /api/email/send-email` - Test email endpoint

## Frontend Integration

The contact form now uses the `mailerApi` from `frontend/lib/backend_api/mailerapi.ts` which:
- Uses axios for HTTP requests
- Handles errors gracefully
- Provides proper TypeScript interfaces
- Shows success/error messages to users

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**:
   - Check your SMTP credentials
   - Ensure 2FA is enabled and app password is used for Gmail

2. **"Connection timeout"**:
   - Verify SMTP_HOST and SMTP_PORT are correct
   - Check firewall settings

3. **"Email not received"**:
   - Check spam folder
   - Verify ADMIN_EMAIL is correct
   - Check console logs for errors

### Debug Mode:
The mailer is configured with `debug: true` to help troubleshoot issues. Check the backend console for detailed SMTP logs. 