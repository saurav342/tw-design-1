const EmailVerification = require('./schemas/EmailVerification');

const EXPIRY_MINUTES = 10; // OTP expires in 10 minutes
const EXPIRY_MS = EXPIRY_MINUTES * 60 * 1000;
const OTP_LENGTH = 6;

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create an email verification OTP
 */
const createVerificationOTP = async (email, role) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + EXPIRY_MS);

  // Remove any existing unverified OTPs for this email and role
  await EmailVerification.deleteMany({
    email: email.toLowerCase(),
    role,
    verified: false,
  });

  const verification = new EmailVerification({
    otp,
    email: email.toLowerCase(),
    role,
    expiresAt,
    verified: false,
  });

  await verification.save();
  return { otp, expiresAt: expiresAt.getTime(), email: email.toLowerCase() };
};

/**
 * Verify an email verification OTP
 */
const verifyOTP = async (email, role, otp) => {
  const verification = await EmailVerification.findOne({
    email: email.toLowerCase(),
    role,
    otp,
    verified: false,
  });

  if (!verification) {
    throw new Error('Invalid or expired OTP.');
  }

  if (verification.expiresAt < new Date()) {
    await EmailVerification.findByIdAndDelete(verification._id);
    throw new Error('OTP has expired. Please request a new one.');
  }

  // Mark as verified
  verification.verified = true;
  verification.verifiedAt = new Date();
  await verification.save();

  return {
    email: verification.email,
    role: verification.role,
  };
};

/**
 * Check if email is verified
 */
const isEmailVerified = async (email, role) => {
  const verification = await EmailVerification.findOne({
    email: email.toLowerCase(),
    role,
    verified: true,
  });

  return !!verification;
};

/**
 * Get verification OTP by email and role
 */
const getVerificationOTP = async (email, role) => {
  const verification = await EmailVerification.findOne({
    email: email.toLowerCase(),
    role,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  return verification;
};

module.exports = {
  createVerificationOTP,
  verifyOTP,
  isEmailVerified,
  getVerificationOTP,
};
