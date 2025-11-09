# AWS Configuration Guide

This guide explains how to configure AWS S3 for pitch deck uploads and email service for the LaunchAndLift application.

## Table of Contents
1. [AWS S3 Configuration](#aws-s3-configuration)
2. [Email Service Configuration](#email-service-configuration)
3. [Environment Variables](#environment-variables)

---

## AWS S3 Configuration

### Step 1: Create an S3 Bucket

1. Log in to your AWS Console
2. Navigate to S3 service
3. Click "Create bucket"
4. Configure the bucket:
   - **Bucket name**: Choose a unique name (e.g., `launchandlift-pitch-decks`)
   - **Region**: Select your preferred region (e.g., `us-east-1`)
   - **Block Public Access**: Keep all settings enabled for security (files will be private)
   - **Bucket Versioning**: Optional, but recommended
   - **Default encryption**: Enable (SSE-S3 or SSE-KMS)

### Step 2: Create IAM User and Access Keys

1. Navigate to IAM service in AWS Console
2. Click "Users" → "Add users"
3. Create a user (e.g., `launchandlift-s3-upload`)
4. Attach a policy with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
    }
  ]
}
```

5. Create Access Keys:
   - Go to the user → "Security credentials" tab
   - Click "Create access key"
   - Choose "Application running outside AWS"
   - Save the **Access Key ID** and **Secret Access Key** (you won't be able to see the secret again)

### Step 3: Configure CORS (if needed)

If you need to access files directly from the browser, configure CORS on your S3 bucket:

1. Go to your S3 bucket → "Permissions" tab
2. Scroll to "Cross-origin resource sharing (CORS)"
3. Add the following configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:5173"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### Step 4: Set Up Bucket Policy (Optional - for public access)

If you want to make uploaded files publicly accessible, create a bucket policy:

1. Go to your S3 bucket → "Permissions" tab
2. Click "Bucket policy"
3. Add the following policy (replace `YOUR_BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

**Note**: For security, it's recommended to keep files private and use presigned URLs instead of public access.

### Step 5: Environment Variables

Add the following environment variables to your `.env` file:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=your_bucket_name
```

---

## Email Service Configuration

The application uses Nodemailer for sending emails. You can configure it to use various email providers.

### Option 1: Gmail (Development/Testing)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password for "Mail"
   - Save the 16-character password

3. Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=LaunchAndLift
```

### Option 2: AWS SES (Production Recommended)

1. **Verify your email domain**:
   - Go to AWS SES → Verified identities
   - Click "Create identity"
   - Choose "Domain" and enter your domain
   - Follow DNS verification steps

2. **Verify sender email** (if using email address):
   - Go to AWS SES → Verified identities
   - Click "Create identity"
   - Choose "Email address"
   - Enter your email and verify it

3. **Move out of SES Sandbox** (for production):
   - Request production access in AWS SES
   - This allows sending to any email address

4. **Create IAM User for SES**:
   - Create an IAM user with `AmazonSESFullAccess` policy
   - Or create a custom policy with `ses:SendEmail` and `ses:SendRawEmail` permissions

5. **Add to `.env`**:
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_ses_access_key_id
SMTP_PASS=your_ses_secret_access_key
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=LaunchAndLift
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com
```

### Option 3: SendGrid

1. Create a SendGrid account
2. Create an API key with "Mail Send" permissions
3. Add to `.env`:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=LaunchAndLift
```

### Option 4: Mailgun

1. Create a Mailgun account
2. Verify your domain
3. Get your SMTP credentials from the dashboard
4. Add to `.env`:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_mailgun_smtp_username
SMTP_PASS=your_mailgun_smtp_password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=LaunchAndLift
```

---

## Complete Environment Variables

Add all required environment variables to `backend/.env`:

```env
# Server Configuration
PORT=3000
APP_URL=http://localhost:5173
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=12h

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=your_bucket_name

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=LaunchAndLift
ADMIN_NOTIFICATION_EMAIL=admin@launchandlift.com
```

---

## Testing the Configuration

### Test S3 Upload

1. Start your backend server
2. Use the upload endpoint:
```bash
curl -X POST http://localhost:3000/api/upload/pitch-deck \
  -F "pitchDeck=@/path/to/test.pdf"
```

### Test Email Sending

The email service will automatically send emails when:
- A founder submits their application
- An admin account is created
- A founder intake is submitted

Check your server logs for email sending status. If SMTP is not configured, the application will log the email details without failing.

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use IAM roles** instead of access keys when running on AWS (EC2, Lambda, etc.)
3. **Rotate access keys** regularly
4. **Use bucket policies** to restrict access
5. **Enable S3 bucket versioning** for important files
6. **Enable S3 bucket logging** for audit trails
7. **Use presigned URLs** for private file access instead of public URLs
8. **Verify email domains** in production
9. **Use environment-specific credentials** (development, staging, production)

---

## Troubleshooting

### S3 Upload Issues

- **Error: "Access Denied"**: Check IAM user permissions and bucket policy
- **Error: "Bucket not found"**: Verify bucket name and region
- **Error: "Invalid credentials"**: Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

### Email Sending Issues

- **Gmail: "Less secure app" error**: Use App Passwords instead of regular password
- **AWS SES: "Email not verified"**: Verify sender email/domain in SES
- **AWS SES: "Sandbox mode"**: Request production access or verify recipient emails
- **Connection timeout**: Check SMTP_HOST and SMTP_PORT settings
- **Authentication failed**: Verify SMTP_USER and SMTP_PASS

---

## Support

For additional help, refer to:
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [Nodemailer Documentation](https://nodemailer.com/about/)

