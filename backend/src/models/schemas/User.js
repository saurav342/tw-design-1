const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: false,
    default: null,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'investor', 'founder'],
  },
  organization: {
    type: String,
    default: null,
  },
  notes: {
    type: String,
    default: null,
  },
  investorDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  founderDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  adminDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for faster email lookups
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

