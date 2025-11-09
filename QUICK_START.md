# Quick Start Guide

This guide will help you quickly set up S3 file uploads and email notifications.

## Prerequisites

- AWS Account (for S3)
- Email service account (Gmail, AWS SES, SendGrid, or Mailgun)
- Node.js and npm installed

## Step 1: Set Up AWS S3 (5 minutes)

### 1.1 Create S3 Bucket
1. Go to AWS Console → S3
2. Click "Create bucket"
3. Name: `launchandlift-pitch-decks` (or your choice)
4. Region: `us-east-1` (or your preference)
5. Keep all security settings enabled
6. Click "Create bucket"

### 1.2 Create IAM User
1. Go to AWS Console → IAM → Users
2. Click "Add users"
3. Name: `launchandlift-s3-upload`
4. Select "Programmatic access"
5. Attach policy: `AmazonS3FullAccess` (or create custom policy - see AWS_CONFIGURATION.md)
6. Create user and save **Access Key ID** and **Secret Access Key**

### 1.3 Add to `.env`
Create/update `backend/.env`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_S3_BUCKET_NAME=launchandlift-pitch-decks
```

## Step 2: Set Up Email Service (5 minutes)

### Option A: Gmail (Easiest for Development)

1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Save the 16-character password

3. **Add to `.env`**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=LaunchAndLift
ADMIN_NOTIFICATION_EMAIL=admin@launchandlift.com
```

### Option B: AWS SES (Recommended for Production)

1. **Verify Email/Domain** in AWS SES
2. **Create IAM User** with SES permissions
3. **Add to `.env`**:
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_ses_access_key
SMTP_PASS=your_ses_secret_key
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=LaunchAndLift
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com
```

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

## Step 4: Test the Setup

### Test S3 Upload:
```bash
curl -X POST http://localhost:3000/api/upload/pitch-deck \
  -F "pitchDeck=@/path/to/test.pdf"
```

Expected response:
```json
{
  "message": "File uploaded successfully.",
  "fileUrl": "https://your-bucket.s3.region.amazonaws.com/pitch-decks/uuid.pdf",
  "fileName": "test.pdf"
}
```

### Test Email:
1. Start your backend server: `npm run dev`
2. Submit a founder application through the frontend
3. Check your email (and spam folder)
4. Check server logs for email status

## Complete `.env` Example

```env
# Server
PORT=3000
APP_URL=http://localhost:5173
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=12h

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET_NAME=launchandlift-pitch-decks

# Email (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=LaunchAndLift
ADMIN_NOTIFICATION_EMAIL=admin@launchandlift.com
```

## Troubleshooting

### S3 Upload Fails
- ✅ Check AWS credentials are correct
- ✅ Verify bucket name matches exactly
- ✅ Check IAM user has S3 permissions
- ✅ Verify region is correct

### Email Not Sending
- ✅ Check SMTP credentials are correct
- ✅ For Gmail: Use App Password, not regular password
- ✅ Check spam folder
- ✅ Verify SMTP_HOST and SMTP_PORT
- ✅ Check server logs for error messages

### File Upload Not Working in Frontend
- ✅ Check backend is running
- ✅ Verify CORS is configured correctly
- ✅ Check browser console for errors
- ✅ Verify file type and size are within limits

## Next Steps

- Read `AWS_CONFIGURATION.md` for detailed configuration
- Read `IMPLEMENTATION_SUMMARY.md` for feature details
- Test with real files and emails
- Set up production environment variables

## Support

For detailed configuration, see `AWS_CONFIGURATION.md`.

For implementation details, see `IMPLEMENTATION_SUMMARY.md`.

