const { randomUUID } = require('crypto');
const PasswordReset = require('./schemas/PasswordReset');
const { findByEmail } = require('./userModel');

const EXPIRY_MINUTES = 30;

const createResetToken = async (email) => {
  const user = await findByEmail(email);
  if (!user) {
    throw new Error('No account found for that email.');
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  // Remove any existing tokens for this email
  await PasswordReset.deleteMany({ email: user.email });

  const resetToken = new PasswordReset({
    token,
    email: user.email,
    expiresAt,
  });

  await resetToken.save();
  return { token, expiresAt: expiresAt.getTime(), email: user.email };
};

const consumeResetToken = async (token) => {
  const resetToken = await PasswordReset.findOne({ token });

  if (!resetToken) {
    throw new Error('Reset token not found or already used.');
  }

  if (new Date() > resetToken.expiresAt) {
    await PasswordReset.findByIdAndDelete(resetToken._id);
    throw new Error('Reset token has expired.');
  }

  const email = resetToken.email;
  await PasswordReset.findByIdAndDelete(resetToken._id);

  return email;
};

module.exports = {
  consumeResetToken,
  createResetToken,
};
