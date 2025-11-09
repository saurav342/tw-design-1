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

const buildAuthResponse = (user) => ({
  token: signToken({ sub: user.id, role: user.role }),
  user,
});

const truthyValues = new Set(['true', '1', 'yes', 'y', 'on']);
const falsyValues = new Set(['false', '0', 'no', 'n', 'off']);

const TEST_PHONE_NUMBER = '9312121212';
const TEST_OTP_CODE = '1234';
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const otpStore = new Map();

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

const normalizePhone = (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : '');

const sendOtp = (req, res) => {
  try {
    const { phone } = req.body;
    const normalized = normalizePhone(phone);
    if (!normalized) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    if (normalized !== TEST_PHONE_NUMBER) {
      return res.status(400).json({
        message: `Only the test number ${TEST_PHONE_NUMBER} is enabled in this environment.`,
      });
    }

    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    otpStore.set(normalized, { code: TEST_OTP_CODE, expiresAt });

    console.log('[LaunchAndLift] OTP issued', {
      phone: normalized,
      otp: TEST_OTP_CODE,
      expiresAt: new Date(expiresAt).toISOString(),
    });

    return res.status(200).json({
      message: 'OTP sent successfully. Use 1234 for verification.',
      phone: normalized,
      otp: TEST_OTP_CODE,
      expiresAt: new Date(expiresAt).toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to issue OTP.' });
  }
};

const verifyOtp = (req, res) => {
  try {
    const { phone, otp } = req.body;
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required.' });
    }

    const entry = otpStore.get(normalizedPhone);
    if (!entry) {
      return res.status(400).json({ message: 'No OTP request found. Please request a new code.' });
    }

    if (entry.expiresAt < Date.now()) {
      otpStore.delete(normalizedPhone);
      return res.status(400).json({ message: 'OTP expired. Please request a new code.' });
    }

    if (entry.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Use 1234 for this environment.' });
    }

    otpStore.delete(normalizedPhone);
    return res.status(200).json({ message: 'OTP verified successfully.', phone: normalizedPhone });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to verify OTP.' });
  }
};

const signup = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const organization = req.body.organization ?? null;
    const notes = req.body.notes ?? null;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Restrict public signup to only investor and founder roles
    // Admin signup must use the separate admin auth endpoint
    if (!['investor', 'founder'].includes(role)) {
      return res.status(403).json({ 
        message: 'Admin accounts cannot be created through this endpoint. Please use the admin authentication portal.' 
      });
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

      const founderMissing = [
        ['gender', gender],
        ['phone', phone],
        ['linkedinUrl', linkedinUrl],
      ]
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (founderMissing.length) {
        return res.status(400).json({
          message: `Missing founder onboarding fields: ${founderMissing.join(', ')}`,
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

      const startupMissing = [
        ['brandName', brandName],
        ['legalName', legalName],
        ['websiteUrl', websiteUrl],
        ['sector', sector],
        ['stage', stage],
        ['cityOfOperation', cityOfOperation],
        ['companyType', companyType],
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
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // If role is admin, reject - admins must use admin auth endpoint
    if (role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin login is not available through this endpoint. Please use the admin authentication portal.' 
      });
    }

    // Allow login without role specification, or with investor/founder role
    const user = await verifyUser({ email, password, role: role || undefined });
    
    // Double-check: if user is admin, reject even if they didn't specify role
    if (user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin accounts must use the admin authentication portal.' 
      });
    }

    return res.status(200).json(buildAuthResponse(user));
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

    console.log('[LaunchAndLift] Password reset requested:', {
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
  sendOtp,
  requestPasswordReset,
  signup,
  updateProfile,
  verifyOtp,
};
