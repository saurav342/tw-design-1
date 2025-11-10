const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
  },
  minAmount: {
    type: Number,
    default: 0,
  },
  maxUses: {
    type: Number,
    default: null,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  validFrom: {
    type: Date,
    default: Date.now,
  },
  validUntil: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

CouponSchema.index({ code: 1, isActive: 1 });
CouponSchema.index({ validFrom: 1, validUntil: 1 });

// Method to check if coupon is valid
CouponSchema.methods.isValid = function(amount) {
  if (!this.isActive) return false;
  if (this.validUntil && new Date() > this.validUntil) return false;
  if (this.validFrom && new Date() < this.validFrom) return false;
  if (this.maxUses && this.usedCount >= this.maxUses) return false;
  if (amount < this.minAmount) return false;
  return true;
};

// Method to calculate discount
CouponSchema.methods.calculateDiscount = function(amount) {
  if (!this.isValid(amount)) return 0;
  
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    if (this.maxDiscountAmount) {
      discount = Math.min(discount, this.maxDiscountAmount);
    }
  } else {
    discount = Math.min(this.discountValue, amount);
  }
  
  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

module.exports = mongoose.model('Coupon', CouponSchema);

