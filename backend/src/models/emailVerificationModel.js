const { randomUUID } = require('crypto');
const EmailVerification = require('./schemas/EmailVerification');

const EXPIRY_MINUTES = 30;
const EXPIRY_MS = EXPIRY_MINUTES * 60 * 1000;

/**
 * Create an email verification token
 */
const createVerificationToken = async (email, role) => {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + EXPIRY_MS);

  // Remove any existing unverified tokens for this email and role
  await EmailVerification.deleteMany({
    email: email.toLowerCase(),
    role,
    verified: false,
  });

  const verification = new EmailVerification({
    token,
    email: email.toLowerCase(),
    role,
    expiresAt,
    verified: false,
  });

  await verification.save();
  return { token, expiresAt: expiresAt.getTime(), email: email.toLowerCase() };
};

/**
 * Verify an email verification token
 */
const verifyToken = async (token) => {
  const verification = await EmailVerification.findOne({
    token,
    verified: false,
  });

  if (!verification) {
    throw new Error('Invalid or expired verification token.');
  }

  if (verification.expiresAt < new Date()) {
    await EmailVerification.findByIdAndDelete(verification._id);
    throw new Error('Verification token has expired.');
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
 * Get verification token by email and role
 */
const getVerificationToken = async (email, role) => {
  const verification = await EmailVerification.findOne({
    email: email.toLowerCase(),
    role,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  return verification;
};

module.exports = {
  createVerificationToken,
  verifyToken,
  isEmailVerified,
  getVerificationToken,
};
