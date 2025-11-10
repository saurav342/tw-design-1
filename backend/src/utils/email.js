const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@launchandlift.com';
const FROM_NAME = process.env.SMTP_FROM_NAME || 'LaunchAndLift';

/**
 * Email template for founder signup welcome
 */
const getFounderWelcomeEmailTemplate = (founderName, email) => ({
  subject: 'Welcome to LaunchAndLift - Your Journey Begins! 🚀',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to LaunchAndLift</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 20px; text-align: center;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 30px 30px; background: linear-gradient(135deg, #5b21d6 0%, #7c3aed 100%); border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to LaunchAndLift! 🚀</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #1e293b; font-size: 16px; line-height: 1.6;">
                    Hi ${founderName || 'Founder'},
                  </p>
                  
                  <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                    Thank you for joining LaunchAndLift! We're excited to have you on board and look forward to supporting your startup journey.
                  </p>
                  
                  <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                    Your application has been received and our team will review it within <strong>2 business days</strong>. You'll receive an email with next steps once the review is complete.
                  </p>
                  
                  <!-- Highlight Box -->
                  <div style="background-color: #f1f5f9; border-left: 4px solid #7c3aed; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <p style="margin: 0 0 10px; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">What's Next?</p>
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li>Our team reviews your application</li>
                      <li>You'll receive Mission Control credentials</li>
                      <li>Access to operator pods and resources</li>
                      <li>Personalized support for your fundraising journey</li>
                    </ul>
                  </div>
                  
                  <p style="margin: 30px 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                    If you have any questions, feel free to reach out to us at <a href="mailto:support@launchandlift.com" style="color: #7c3aed; text-decoration: none;">support@launchandlift.com</a>.
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; margin: 30px 0;">
                    <tr>
                      <td style="text-align: center;">
                        <a href="${process.env.APP_URL || 'https://launchandlift.com'}/dashboard/founder" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #5b21d6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">Access Your Dashboard</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                    Best regards,<br>
                    <strong>The LaunchAndLift Team</strong>
                  </p>
                  <p style="margin: 20px 0 0; color: #94a3b8; font-size: 12px;">
                    This email was sent to ${email}. If you didn't create an account, please ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
});

/**
 * Email template for admin signup notification
 */
const getAdminWelcomeEmailTemplate = (adminName, email) => ({
  subject: 'Welcome to LaunchAndLift Admin Portal 👨‍💼',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to LaunchAndLift Admin</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 20px; text-align: center;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 30px 30px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Admin Portal 👨‍💼</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #1e293b; font-size: 16px; line-height: 1.6;">
                    Hi ${adminName || 'Admin'},
                  </p>
                  
                  <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                    Your admin account has been successfully created for LaunchAndLift. You now have access to the admin dashboard with full administrative privileges.
                  </p>
                  
                  <!-- Highlight Box -->
                  <div style="background-color: #f1f5f9; border-left: 4px solid #1e293b; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <p style="margin: 0 0 10px; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Admin Capabilities</p>
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li>Manage founder applications and intakes</li>
                      <li>View and manage investor accounts</li>
                      <li>Access analytics and metrics</li>
                      <li>Manage content and portfolio items</li>
                    </ul>
                  </div>
                  
                  <p style="margin: 30px 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                    Please keep your credentials secure and don't share them with anyone. If you have any questions, contact the system administrator.
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; margin: 30px 0;">
                    <tr>
                      <td style="text-align: center;">
                        <a href="${process.env.APP_URL || 'https://launchandlift.com'}/admin/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(30, 41, 59, 0.3);">Access Admin Dashboard</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                    Best regards,<br>
                    <strong>The LaunchAndLift Team</strong>
                  </p>
                  <p style="margin: 20px 0 0; color: #94a3b8; font-size: 12px;">
                    This email was sent to ${email}. This is an automated notification for admin account creation.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
});

/**
 * Email template for founder intake submission notification (to admin)
 */
const getFounderIntakeNotificationTemplate = (founderData) => ({
  subject: `New Founder Application: ${founderData.startupName || founderData.companyLegalName || 'New Startup'}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Founder Application</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 20px; text-align: center;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 30px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">New Founder Application 🎯</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #1e293b; font-size: 16px; line-height: 1.6;">
                    A new founder application has been submitted and requires review.
                  </p>
                  
                  <!-- Founder Details -->
                  <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <h2 style="margin: 0 0 15px; color: #1e293b; font-size: 18px; font-weight: 600;">Founder Information</h2>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #475569; font-size: 14px; width: 140px;"><strong>Name:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${founderData.fullName || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #475569; font-size: 14px;"><strong>Email:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${founderData.email || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #475569; font-size: 14px;"><strong>Phone:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${founderData.phoneNumber || 'N/A'}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Company Details -->
                  <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <h2 style="margin: 0 0 15px; color: #1e293b; font-size: 18px; font-weight: 600;">Company Information</h2>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #475569; font-size: 14px; width: 140px;"><strong>Company:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${founderData.companyLegalName || founderData.startupName || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #475569; font-size: 14px;"><strong>Brand:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${founderData.brandName || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #475569; font-size: 14px;"><strong>Website:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">
                          ${founderData.companyWebsite ? `<a href="${founderData.companyWebsite}" style="color: #7c3aed; text-decoration: none;">${founderData.companyWebsite}</a>` : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #475569; font-size: 14px;"><strong>Sector:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${founderData.sector || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #475569; font-size: 14px;"><strong>Stage:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${founderData.currentStage || founderData.raiseStage || 'N/A'}</td>
                      </tr>
                    </table>
                  </div>
                  
                  ${founderData.company?.brief || founderData.brief ? `
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 0 0 8px; color: #92400e; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Brief</p>
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">${(founderData.company?.brief || founderData.brief || '').substring(0, 300)}${(founderData.company?.brief || founderData.brief || '').length > 300 ? '...' : ''}</p>
                  </div>
                  ` : ''}
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; margin: 30px 0;">
                    <tr>
                      <td style="text-align: center;">
                        <a href="${process.env.APP_URL || 'https://launchandlift.com'}/admin/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">Review Application</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                    This is an automated notification from LaunchAndLift Admin Portal.
                  </p>
                  <p style="margin: 20px 0 0; color: #94a3b8; font-size: 12px;">
                    Application ID: ${founderData.id || 'N/A'} | Submitted: ${new Date().toLocaleString()}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
});

/**
 * Send email
 */
const sendEmail = async (to, subject, html, fromEmail = FROM_EMAIL, fromName = FROM_NAME) => {
  try {
    // Verify transporter configuration
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP credentials not configured. Email sending is disabled.');
      console.log('Would send email to:', to, 'Subject:', subject);
      return { success: false, message: 'SMTP not configured' };
    }

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send founder welcome email
 */
const sendFounderWelcomeEmail = async (founderName, email) => {
  const template = getFounderWelcomeEmailTemplate(founderName, email);
  return sendEmail(email, template.subject, template.html);
};

/**
 * Send admin welcome email
 */
const sendAdminWelcomeEmail = async (adminName, email) => {
  const template = getAdminWelcomeEmailTemplate(adminName, email);
  return sendEmail(email, template.subject, template.html);
};

/**
 * Email template for email verification
 */
const getEmailVerificationTemplate = (email, role, verificationLink) => ({
  subject: 'Verify Your Email - LaunchAndLift',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 20px; text-align: center;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 30px 30px; background: linear-gradient(135deg, #7c3aed 0%, #5b21d6 100%); border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Verify Your Email 📧</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #1e293b; font-size: 16px; line-height: 1.6;">
                    Hi there,
                  </p>
                  
                  <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                    Thank you for signing up for LaunchAndLift as a <strong>${role === 'founder' ? 'Founder' : 'Investor'}</strong>! To complete your registration, please verify your email address by clicking the button below.
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; margin: 30px 0;">
                    <tr>
                      <td style="text-align: center;">
                        <a href="${verificationLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #5b21d6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">Verify Email Address</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 20px; color: #64748b; font-size: 14px; line-height: 1.6;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="margin: 0 0 30px; color: #7c3aed; font-size: 12px; word-break: break-all; padding: 15px; background-color: #f1f5f9; border-radius: 8px;">
                    ${verificationLink}
                  </p>
                  
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 8px;">
                    <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                      <strong>⚠️ Important:</strong> This verification link will expire in 30 minutes. If you didn't create an account, please ignore this email.
                    </p>
                  </div>
                  
                  <p style="margin: 30px 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                    If you have any questions, feel free to reach out to us at <a href="mailto:support@launchandlift.com" style="color: #7c3aed; text-decoration: none;">support@launchandlift.com</a>.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                    Best regards,<br>
                    <strong>The LaunchAndLift Team</strong>
                  </p>
                  <p style="margin: 20px 0 0; color: #94a3b8; font-size: 12px;">
                    This email was sent to ${email}. If you didn't create an account, please ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
});

/**
 * Send founder intake notification to admin
 */
const sendFounderIntakeNotification = async (founderData, adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@launchandlift.com') => {
  const template = getFounderIntakeNotificationTemplate(founderData);
  return sendEmail(adminEmail, template.subject, template.html);
};

/**
 * Send email verification email
 */
const sendVerificationEmail = async (email, role, verificationToken) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  const verificationLink = `${appUrl}/verify-email?token=${verificationToken}&role=${role}`;
  
  const template = getEmailVerificationTemplate(email, role, verificationLink);
  return sendEmail(email, template.subject, template.html);
};

module.exports = {
  sendEmail,
  sendFounderWelcomeEmail,
  sendAdminWelcomeEmail,
  sendFounderIntakeNotification,
  sendVerificationEmail,
  transporter,
};

