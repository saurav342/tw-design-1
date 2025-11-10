const { verifyToken } = require('../utils/jwt');
const { findById, sanitizeUser } = require('../models/userModel');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid authorization header.' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await findById(decoded.sub);

    if (!user) {
      return res.status(401).json({ message: 'Account no longer exists.' });
    }

    req.user = sanitizeUser(user);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired or invalid. Please sign in again.' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to perform this action.' });
  }
  return next();
};

module.exports = {
  authenticate,
  requireRole,
};
