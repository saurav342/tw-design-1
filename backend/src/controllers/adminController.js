const store = require('../data/store');
const { getAllUsers, updateUser, deleteUser } = require('../models/userModel');

const getUsers = (req, res) => res.status(200).json({ items: getAllUsers() });

const updateUserController = (req, res) => {
  try {
    const { id } = req.params;
    const { role, organization, notes } = req.body || {};
    const updates = {};
    if (role) updates.role = role;
    if (organization) updates.organization = organization;
    if (notes) updates.notes = notes;
    const user = updateUser(id, updates);
    return res.status(200).json({ item: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteUserController = (req, res) => {
  try {
    const user = deleteUser(req.params.id);
    return res.status(200).json({ item: user });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getSiteMetrics = (req, res) => {
  const metrics = {
    totalUsers: store.users.length,
    investors: store.users.filter((user) => user.role === 'investor').length,
    founders: store.users.filter((user) => user.role === 'founder').length,
    admins: store.users.filter((user) => user.role === 'admin').length,
    portfolioCompanies: store.portfolio.length,
    testimonials: store.testimonials.length,
    faqs: store.faqs.length,
  };

  return res.status(200).json({ metrics });
};

module.exports = {
  deleteUserController,
  getSiteMetrics,
  getUsers,
  updateUserController,
};
