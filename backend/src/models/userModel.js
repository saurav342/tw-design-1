const bcrypt = require('bcryptjs');
const User = require('./schemas/User');

const sanitizeUser = (user) => {
  if (!user) return null;
  const userObj = user.toObject ? user.toObject() : user;
  const { passwordHash, __v, ...rest } = userObj;
  // Convert _id to id for consistency with frontend
  if (rest._id) {
    rest.id = rest._id.toString();
    delete rest._id;
  }
  return rest;
};

const findByEmail = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  return user;
};

const findById = async (id) => {
  if (!id) return null;
  // MongoDB _id can be either ObjectId or string
  const user = await User.findById(id);
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({}).sort({ createdAt: -1 });
  return users.map(sanitizeUser);
};

const createUser = async ({
  fullName,
  email,
  password,
  role,
  organization = null,
  notes = null,
  investorDetails = null,
  founderDetails = null,
  adminDetails = null,
}) => {
  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new Error('Account already exists for this email.');
  }

  // Hash password if provided, otherwise set to null for OTP-only accounts
  const passwordHash = password ? await bcrypt.hash(password, 10) : null;

  const user = new User({
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    role,
    organization,
    notes,
    investorDetails,
    founderDetails,
    adminDetails,
  });

  await user.save();
  return sanitizeUser(user);
};

const verifyUser = async ({ email, password, role }) => {
  const user = await findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials.');
  }

  if (role && user.role !== role) {
    throw new Error('Role mismatch. Please check your selection.');
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    throw new Error('Invalid credentials.');
  }

  return sanitizeUser(user);
};

const updatePassword = async (id, password) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  await user.save();
  return sanitizeUser(user);
};

const updateUser = async (id, updates) => {
  const user = await User.findByIdAndUpdate(
    id,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUser(user);
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('User not found');
  }
  return sanitizeUser(user);
};

module.exports = {
  createUser,
  deleteUser,
  findByEmail,
  findById,
  getAllUsers,
  sanitizeUser,
  updatePassword,
  updateUser,
  verifyUser,
};
