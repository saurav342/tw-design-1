const {
  createUser,
  findByEmail,
  sanitizeUser,
  updatePassword,
  updateUser,
  verifyUser,
} = require('../models/userModel');
const { signToken } = require('../utils/jwt');
const { createResetToken, consumeResetToken } = require('../models/passwordResetModel');
const { createVerificationOTP, verifyOTP, isEmailVerified } = require('../models/emailVerificationModel');
const { sendVerificationEmail } = require('../utils/email');
const bcrypt = require('bcryptjs');

const buildAuthResponse = (user) => ({
  token: signToken({ sub: user.id, role: user.role }),
  user,
});

const truthyValues = new Set(['true', '1', 'yes', 'y', 'on']);
const falsyValues = new Set(['false', '0', 'no', 'n', 'off']);

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (truthyValues.has(normalized)) return true;
    if (falsyValues.has(normalized)) return false;
  }
  return Boolean(value);
};

const sanitizeFilePayload = (file) => {
  if (!file) return null;
  
  // If it's a string (URL), return it as-is
  if (typeof file === 'string') {
    return file;
  }
  
  // If it's an object, validate it has the required file properties
  if (typeof file !== 'object') {
    throw new Error('Invalid file payload supplied.');
  }
  
  const { fileName, mimeType, size, data } = file;
  if (!fileName || !mimeType || data === undefined) {
    throw new Error('Invalid file payload supplied.');
  }

  const parsedSize = typeof size === 'number' ? size : Number(size);
  if (Number.isNaN(parsedSize) || parsedSize < 0) {
    throw new Error('Invalid file size supplied.');
  }

  return {
    fileName,
    mimeType,
    size: parsedSize,
    data,
  };
};


/**
 * Send email verification
 */
const sendEmailVerification = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Validate role
    if (!['founder', 'investor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be founder or investor.' });
    }

    // Check if email already exists
    const existingUser = await findByEmail(email);
    if (existingUser) {
      // Email is unique in the database, so if it exists, suggest they log in instead
      // Provide helpful message based on whether the role matches
      if (existingUser.role === role) {
        return res.status(400).json({ 
          message: 'An account with this email already exists. Please log in instead.',
          existingRole: existingUser.role,
          shouldLogin: true
        });
      } else {
        return res.status(400).json({ 
          message: `An account with this email already exists with the ${existingUser.role} role. Please log in to access your account.`,
          existingRole: existingUser.role,
          requestedRole: role,
          shouldLogin: true
        });
      }
    }

    // Create verification OTP
    const { otp } = await createVerificationOTP(email, role);

    // Send verification email with OTP
    try {
      await sendVerificationEmail(email, role, otp);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the request if email fails, but log it
    }

    return res.status(200).json({
      message: 'Verification code sent successfully. Please check your inbox.',
      email: email.toLowerCase(),
    });
  } catch (error) {
    console.error('Error sending email verification:', error);
    return res.status(500).json({ message: 'Unable to send verification email.' });
  }
};

/**
 * Verify email with OTP
 */
const verifyEmail = async (req, res) => {
  try {
    const { email, role, otp } = req.body;

    if (!email || !role || !otp) {
      return res.status(400).json({ message: 'Email, role, and OTP are required.' });
    }

    const verified = await verifyOTP(email, role, otp);

    return res.status(200).json({
      message: 'Email verified successfully.',
      email: verified.email,
      role: verified.role,
      verified: true,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Invalid or expired OTP.' });
  }
};

/**
 * Check if email is verified
 */
const checkEmailVerification = async (req, res) => {
  try {
    const { email, role } = req.query;

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required.' });
    }

    const verified = await isEmailVerified(email, role);

    return res.status(200).json({
      email: email.toLowerCase(),
      role,
      verified,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to check email verification status.' });
  }
};

const signup = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const organization = req.body.organization ?? null;
    const notes = req.body.notes ?? null;

    if (!fullName || !email || !role) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Password is optional for founders (they can use OTP login), but required for investors
    if (role === 'investor' && !password) {
      return res.status(400).json({ message: 'Password is required for investor accounts.' });
    }

    // Restrict public signup to only investor and founder roles
    // Admin signup must use the separate admin auth endpoint
    if (!['investor', 'founder'].includes(role)) {
      return res.status(403).json({ 
        message: 'Admin accounts cannot be created through this endpoint. Please use the admin authentication portal.' 
      });
    }

    // Check if email is verified (only for investor role, founder doesn't use this endpoint)
    if (role === 'investor') {
      const emailVerified = await isEmailVerified(email, role);
      if (!emailVerified) {
        return res.status(400).json({ 
          message: 'Email not verified. Please verify your email before signing up.' 
        });
      }
    }

    let investorDetails = null;
    let founderDetails = null;
    let adminDetails = null;

    if (role === 'investor') {
      const {
        phone,
        linkedinUrl,
        location,
      } = req.body;

      const missing = [
        ['phone', phone],
        ['linkedinUrl', linkedinUrl],
        ['location', location],
      ]
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (missing.length) {
        return res.status(400).json({
          message: `Missing investor onboarding fields: ${missing.join(', ')}`,
        });
      }

      investorDetails = {
        phone,
        linkedinUrl,
        location,
      };
    } else if (role === 'founder') {
      const {
        gender,
        phone,
        phoneVerified,
        linkedinUrl,
        referrer = null,
        singleFounder,
        coFounder = {},
        startupDetails = {},
      } = req.body;

      // Gender is required, but phone and linkedinUrl can be empty strings
      if (!gender || (typeof gender === 'string' && !gender.trim())) {
        return res.status(400).json({
          message: 'Missing founder onboarding field: gender',
        });
      }

      if (singleFounder === undefined) {
        return res.status(400).json({ message: 'singleFounder selection is required.' });
      }

      const requiresCoFounder = !toBoolean(singleFounder);
      const coFounderDetails = requiresCoFounder
        ? {
            name: coFounder.name,
            email: coFounder.email,
            linkedinUrl: coFounder.linkedinUrl,
            gender: coFounder.gender,
          }
        : null;

      if (requiresCoFounder) {
        const missingCoFounder = Object.entries(coFounderDetails).filter(([, value]) => !value).map(([key]) => `coFounder.${key}`);
        if (missingCoFounder.length) {
          return res.status(400).json({
            message: `Missing co-founder details: ${missingCoFounder.join(', ')}`,
          });
        }
      }

      const {
        brandName,
        legalName,
        websiteUrl,
        sector,
        sectorTags = [],
        stage,
        cityOfOperation,
        companyType,
        monthlyRevenue = null,
        preMoneyValuation = null,
        capitalToRaise = null,
        incorporationDate,
        description,
        pitchDeck = null,
      } = startupDetails;

      // Required fields - cityOfOperation and companyType are optional
      const startupMissing = [
        ['brandName', brandName],
        ['legalName', legalName],
        ['websiteUrl', websiteUrl],
        ['sector', sector],
        ['stage', stage],
        ['incorporationDate', incorporationDate],
        ['description', description],
      ]
        .filter(([, value]) => !value)
        .map(([key]) => `startupDetails.${key}`);

      if (startupMissing.length) {
        return res.status(400).json({
          message: `Missing startup details: ${startupMissing.join(', ')}`,
        });
      }

      founderDetails = {
        gender,
        phone,
        phoneVerified: toBoolean(phoneVerified),
        linkedinUrl,
        referrer,
        singleFounder: toBoolean(singleFounder),
        coFounder: coFounderDetails,
        startupDetails: {
          brandName,
          legalName,
          websiteUrl,
          sector,
          sectorTags: Array.isArray(sectorTags) ? sectorTags : sector ? [sector] : [],
          stage,
          cityOfOperation,
          companyType,
          monthlyRevenue,
          preMoneyValuation,
          capitalToRaise,
          incorporationDate,
          description,
          pitchDeck: sanitizeFilePayload(pitchDeck),
        },
      };
    }
    // Admin role is removed from public signup - use admin auth endpoint instead

    const user = await createUser({
      fullName,
      email,
      password,
      role,
      organization,
      notes,
      investorDetails,
      founderDetails,
      adminDetails: null, // Admin details not available in public signup
    });
    return res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role, otp } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // If role is admin, reject - admins must use admin auth endpoint
    if (role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin login is not available through this endpoint. Please use the admin authentication portal.' 
      });
    }

    // Check if user exists
    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Check role match if specified
    if (role && user.role !== role) {
      return res.status(401).json({ message: 'Role mismatch. Please check your selection.' });
    }

    // Double-check: if user is admin, reject even if they didn't specify role
    if (user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin accounts must use the admin authentication portal.' 
      });
    }

    // Check if user has a password
    const hasPassword = !!user.passwordHash;

    // If OTP is provided, handle OTP login
    if (otp) {
      if (hasPassword) {
        return res.status(400).json({ 
          message: 'Password login is available for this account. Please use password instead of OTP.' 
        });
      }

      // Verify OTP
      try {
        const verified = await verifyOTP(email, user.role, otp);
        if (verified && verified.email === email.toLowerCase()) {
          return res.status(200).json(buildAuthResponse(sanitizeUser(user)));
        } else {
          return res.status(401).json({ message: 'Invalid or expired OTP.' });
        }
      } catch (otpError) {
        return res.status(401).json({ message: otpError.message || 'Invalid or expired OTP.' });
      }
    }

    // If password is provided, handle password login
    if (password) {
      if (!hasPassword) {
        // User doesn't have password, need to use OTP
        return res.status(400).json({ 
          message: 'Password not set for this account. Please use OTP login.',
          requiresOTP: true,
          email: email.toLowerCase(),
          role: user.role,
        });
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      return res.status(200).json(buildAuthResponse(sanitizeUser(user)));
    }

    // Neither password nor OTP provided
    if (!hasPassword) {
      return res.status(400).json({ 
        message: 'Password not set for this account. Please use OTP login.',
        requiresOTP: true,
        email: email.toLowerCase(),
        role: user.role,
      });
    }

    return res.status(400).json({ message: 'Password or OTP is required.' });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

const getProfile = (req, res) => res.status(200).json(req.user);

const updateProfile = (req, res) => {
  try {
    const allowedFields = ['fullName', 'organization', 'notes'];
    const updates = Object.fromEntries(
      Object.entries(req.body || {}).filter(([key]) => allowedFields.includes(key)),
    );

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No profile updates supplied.' });
    }

    const updated = updateUser(req.user.id, updates);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const requestPasswordReset = (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const reset = createResetToken(email);
    const resetLink = `${process.env.APP_URL ?? 'http://localhost:5173'}/reset-password?token=${reset.token}`;

    console.log('[Launch & Lift] Password reset requested:', {
      email: reset.email,
      resetLink,
    });

    return res.status(200).json({
      message: 'Password reset instructions have been sent (mocked).',
      resetLink,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const confirmPasswordReset = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required.' });
    }

    const email = consumeResetToken(token);
    const user = findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updated = await updatePassword(user.id, password);
    return res.status(200).json(buildAuthResponse(updated));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  confirmPasswordReset,
  getProfile,
  login,
  sendEmailVerification,
  verifyEmail,
  checkEmailVerification,
  requestPasswordReset,
  signup,
  updateProfile,
};
