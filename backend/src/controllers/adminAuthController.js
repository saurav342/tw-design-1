const {
  createUser,
  findByEmail,
  sanitizeUser,
  verifyUser,
} = require('../models/userModel');
const { signToken } = require('../utils/jwt');

const buildAuthResponse = (user) => ({
  token: signToken({ sub: user.id, role: user.role }),
  user,
});

/**
 * Admin Login
 * Separate endpoint for admin authentication
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Verify user exists and is an admin
    const user = await verifyUser({ email, password, role: 'admin' });
    return res.status(200).json(buildAuthResponse(user));
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

/**
 * Admin Signup
 * Restricted endpoint for creating admin accounts
 * In production, this should be further restricted (e.g., require super-admin approval)
 */
const adminSignup = async (req, res) => {
  try {
    const { fullName, email, password, adminDetails = {} } = req.body;
    const organization = req.body.organization ?? null;
    const notes = req.body.notes ?? null;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Create admin user with role fixed to 'admin'
    const user = await createUser({
      fullName,
      email,
      password,
      role: 'admin', // Fixed role
      organization,
      notes,
      investorDetails: null,
      founderDetails: null,
      adminDetails,
    });

    return res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
  adminSignup,
};

