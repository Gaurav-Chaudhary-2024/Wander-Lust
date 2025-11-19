# 📧 Email Setup Guide

## Why You Didn't Receive Emails

The email system is implemented, but it requires SMTP (email server) credentials to be configured in your `.env` file. Without these credentials, emails cannot be sent.

## Quick Setup

### Step 1: Create/Edit `.env` File

Create a `.env` file in your project root (same directory as `server.js`) if it doesn't exist, and add these lines:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Step 2: Gmail Setup (Recommended)

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the setup process
3. **Generate an App Password**:
   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Enter "WanderLust" as the name
   - Click "Generate"
   - **Copy the 16-character password** (you'll need this for `SMTP_PASS`)

4. **Update your `.env` file**:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # The 16-character app password (remove spaces)
   ```

### Step 3: Restart Your Server

After updating the `.env` file, restart your Node.js server:

```bash
# Stop the server (Ctrl+C)
# Then start it again
npm start
```

You should see one of these messages:
- ✅ `Email service ready` - Email is configured correctly
- ⚠️ `Email service not configured: [error]` - Check your credentials

## When Emails Are Sent

1. **Booking Confirmation Email**: Sent when an admin approves a booking
2. **Payment Receipt Email**: Sent when an admin approves a payment

## Testing Email

1. Make a booking (as a regular user)
2. Log in as admin
3. Go to Admin Panel → Bookings
4. Approve the booking
5. Check the user's email inbox (and spam folder)

## Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## Troubleshooting

### "Email service not configured" Error
- Check that `SMTP_USER` and `SMTP_PASS` are set in `.env`
- Make sure there are no extra spaces in the `.env` file
- Restart the server after making changes

### "Invalid login" Error
- For Gmail: Make sure you're using an **App Password**, not your regular password
- Check that 2-Step Verification is enabled
- Verify the email address is correct

### Emails Not Arriving
- Check spam/junk folder
- Verify the recipient email address is correct
- Check server console for error messages
- Make sure the email provider isn't blocking the connection

### Development Mode (No Email)
If you don't want to set up email for development, the system will:
- Still work normally
- Log email attempts to the console
- Show "⚠️ Email not sent - SMTP credentials not configured" messages

## Security Notes

⚠️ **Never commit your `.env` file to Git!**

The `.env` file should already be in `.gitignore`, but double-check:
- Your `.env` file contains sensitive credentials
- Keep it private and secure
- Use different credentials for development and production

## Next Steps

Once email is configured:
1. Test by approving a booking
2. Check the server console for "✅ Email sent successfully" messages
3. Verify emails arrive in the inbox (and check spam folder)

---

**Need Help?** Check the server console for detailed error messages when emails fail to send.

