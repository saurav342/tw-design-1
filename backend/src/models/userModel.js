const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const store = require('../data/store');

const sanitizeUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
};

const findByEmail = (email) => store.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

const findById = (id) => store.users.find((user) => user.id === id);

const getAllUsers = () => store.users.map(sanitizeUser);

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
  if (findByEmail(email)) {
    throw new Error('Account already exists for this email.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  const user = {
    id: randomUUID(),
    fullName,
    email: email.toLowerCase(),
    role,
    organization,
    notes,
    investorDetails,
    founderDetails,
    adminDetails,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  store.users.push(user);
  return sanitizeUser(user);
};

const verifyUser = async ({ email, password, role }) => {
  const user = findByEmail(email);
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
  const user = findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  user.updatedAt = new Date().toISOString();
  return sanitizeUser(user);
};

const updateUser = (id, updates) => {
  const user = findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  Object.assign(user, { ...updates, updatedAt: new Date().toISOString() });
  return sanitizeUser(user);
};

const deleteUser = (id) => {
  const index = store.users.findIndex((user) => user.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }

  const [removed] = store.users.splice(index, 1);
  return sanitizeUser(removed);
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
