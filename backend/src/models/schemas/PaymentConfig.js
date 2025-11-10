const mongoose = require('mongoose');

const PaymentConfigSchema = new mongoose.Schema({
  founderEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  customAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

PaymentConfigSchema.index({ founderEmail: 1, isActive: 1 });

module.exports = mongoose.model('PaymentConfig', PaymentConfigSchema);

