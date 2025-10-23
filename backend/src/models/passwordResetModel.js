const { randomUUID } = require('crypto');
const store = require('../data/store');
const { findByEmail } = require('./userModel');

const EXPIRY_MINUTES = 30;

const createResetToken = (email) => {
  const user = findByEmail(email);
  if (!user) {
    throw new Error('No account found for that email.');
  }

  const token = randomUUID();
  const expiresAt = Date.now() + EXPIRY_MINUTES * 60 * 1000;

  store.passwordResets.push({ token, email: user.email, expiresAt });
  return { token, expiresAt, email: user.email };
};

const consumeResetToken = (token) => {
  const recordIndex = store.passwordResets.findIndex((entry) => entry.token === token);
  if (recordIndex === -1) {
    throw new Error('Reset token not found or already used.');
  }

  const record = store.passwordResets[recordIndex];
  if (Date.now() > record.expiresAt) {
    store.passwordResets.splice(recordIndex, 1);
    throw new Error('Reset token has expired.');
  }

  store.passwordResets.splice(recordIndex, 1);
  return record.email;
};

module.exports = {
  consumeResetToken,
  createResetToken,
};
