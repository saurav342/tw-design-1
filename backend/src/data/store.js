// This file is no longer used for data storage.
// All data is now stored in MongoDB.
// This file is kept for backwards compatibility but should not be used for new features.

// If you need to access data, use the models in src/models/ instead.
// Example: const User = require('../models/schemas/User');

module.exports = {
  // Empty store - all data is in MongoDB
  users: [],
  portfolio: [],
  testimonials: [],
  faqs: [],
  team: [],
  stats: { metrics: [], lastUpdated: new Date().toISOString() },
  news: [],
  founderIntakes: [],
  passwordResets: [],
  emailVerifications: [],
  founderExtras: {},
};
