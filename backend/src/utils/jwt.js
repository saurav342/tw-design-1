const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'launchandlift-development-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  signToken,
  verifyToken,
};
