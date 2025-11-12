const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional - founders may not be logged in during payment
    default: null,
  },
  founderEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true,
  },
  razorpayPaymentId: {
    type: String,
    sparse: true,
  },
  razorpaySignature: {
    type: String,
    sparse: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  couponCode: {
    type: String,
    default: null,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

PaymentSchema.index({ userId: 1 }, { sparse: true }); // Sparse index since userId can be null
PaymentSchema.index({ founderEmail: 1 });
PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);

