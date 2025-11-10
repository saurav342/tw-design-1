const { randomUUID } = require('crypto');
const store = require('../data/store');

const EXPIRY_MINUTES = 30;
const EXPIRY_MS = EXPIRY_MINUTES * 60 * 1000;

// Initialize emailVerifications array if it doesn't exist
if (!store.emailVerifications) {
  store.emailVerifications = [];
}

/**
 * Create an email verification token
 * @param {string} email - Email address to verify
 * @param {string} role - User role (founder, investor)
 * @returns {Object} - Verification token object
 */
const createVerificationToken = (email, role) => {
  const token = randomUUID();
  const expiresAt = Date.now() + EXPIRY_MS;
  const now = new Date().toISOString();

  const verification = {
    token,
    email: email.toLowerCase(),
    role,
    expiresAt,
    verified: false,
    createdAt: now,
  };

  // Remove any existing unverified tokens for this email
  store.emailVerifications = store.emailVerifications.filter(
    (v) => !(v.email === email.toLowerCase() && v.role === role && !v.verified)
  );

  store.emailVerifications.push(verification);
  return { token, expiresAt, email: email.toLowerCase() };
};

/**
 * Verify an email verification token
 * @param {string} token - Verification token
 * @returns {Object} - Verification result with email and role
 */
const verifyToken = (token) => {
  const verification = store.emailVerifications.find(
    (v) => v.token === token && !v.verified
  );

  if (!verification) {
    throw new Error('Invalid or expired verification token.');
  }

  if (verification.expiresAt < Date.now()) {
    throw new Error('Verification token has expired.');
  }

  // Mark as verified
  verification.verified = true;
  verification.verifiedAt = new Date().toISOString();

  return {
    email: verification.email,
    role: verification.role,
  };
};

/**
 * Check if email is verified
 * @param {string} email - Email address
 * @param {string} role - User role
 * @returns {boolean} - True if email is verified
 */
const isEmailVerified = (email, role) => {
  return store.emailVerifications.some(
    (v) => v.email === email.toLowerCase() && v.role === role && v.verified
  );
};

/**
 * Get verification token by email and role
 * @param {string} email - Email address
 * @param {string} role - User role
 * @returns {Object|null} - Verification token object or null
 */
const getVerificationToken = (email, role) => {
  return store.emailVerifications.find(
    (v) => v.email === email.toLowerCase() && v.role === role && !v.verified && v.expiresAt > Date.now()
  );
};

module.exports = {
  createVerificationToken,
  verifyToken,
  isEmailVerified,
  getVerificationToken,
};

