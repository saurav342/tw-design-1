const Payment = require('./schemas/Payment');
const PaymentConfig = require('./schemas/PaymentConfig');
const Coupon = require('./schemas/Coupon');
const Settings = require('./schemas/Settings');

const createPayment = async (paymentData) => {
  const payment = new Payment(paymentData);
  await payment.save();
  return payment.toObject();
};

const getPaymentByOrderId = async (orderId) => {
  const payment = await Payment.findOne({ razorpayOrderId: orderId });
  return payment ? payment.toObject() : null;
};

const updatePayment = async (orderId, updates) => {
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: orderId },
    updates,
    { new: true }
  );
  return payment ? payment.toObject() : null;
};

const getPaymentByUserId = async (userId) => {
  const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
  return payments.map(p => p.toObject());
};

const getPaymentByEmail = async (email) => {
  const payments = await Payment.find({ founderEmail: email.toLowerCase() }).sort({ createdAt: -1 });
  return payments.map(p => p.toObject());
};

// Payment Config methods
const getPaymentConfigByEmail = async (email) => {
  const config = await PaymentConfig.findOne({ 
    founderEmail: email.toLowerCase(),
    isActive: true 
  });
  return config ? config.toObject() : null;
};

const createOrUpdatePaymentConfig = async (email, customAmount, notes = '', createdBy = null) => {
  const config = await PaymentConfig.findOneAndUpdate(
    { founderEmail: email.toLowerCase() },
    {
      founderEmail: email.toLowerCase(),
      customAmount,
      notes,
      createdBy,
      isActive: true,
    },
    { upsert: true, new: true }
  );
  return config.toObject();
};

const getAllPaymentConfigs = async () => {
  const configs = await PaymentConfig.find({}).sort({ createdAt: -1 });
  return configs.map(c => c.toObject());
};

const deletePaymentConfig = async (email) => {
  const config = await PaymentConfig.findOneAndDelete({ founderEmail: email.toLowerCase() });
  return config ? config.toObject() : null;
};

// Coupon methods
const getCouponByCode = async (code) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  return coupon;
};

const createCoupon = async (couponData) => {
  const coupon = new Coupon({
    ...couponData,
    code: couponData.code.toUpperCase().trim(),
  });
  await coupon.save();
  return coupon.toObject();
};

const getAllCoupons = async () => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  return coupons.map(c => c.toObject());
};

const updateCoupon = async (code, updates) => {
  const coupon = await Coupon.findOneAndUpdate(
    { code: code.toUpperCase() },
    updates,
    { new: true }
  );
  return coupon ? coupon.toObject() : null;
};

const deleteCoupon = async (code) => {
  const coupon = await Coupon.findOneAndDelete({ code: code.toUpperCase() });
  return coupon ? coupon.toObject() : null;
};

const incrementCouponUsage = async (code) => {
  const coupon = await Coupon.findOneAndUpdate(
    { code: code.toUpperCase() },
    { $inc: { usedCount: 1 } },
    { new: true }
  );
  return coupon;
};

const getDefaultAmount = () => 4999; // Default amount in INR

// Settings methods
const getCouponEnabled = async () => {
  try {
    const settings = await Settings.findOne({ key: 'couponEnabled' });
    if (!settings) {
      // Create default setting if it doesn't exist
      const defaultSettings = await Settings.create({
        key: 'couponEnabled',
        value: true,
        description: 'Enable or disable coupon section on payment confirmation page',
      });
      return defaultSettings.value === true || defaultSettings.value === 'true';
    }
    return settings.value === true || settings.value === 'true';
  } catch (error) {
    console.error('Error getting coupon settings:', error);
    return true; // Default to enabled
  }
};

module.exports = {
  createPayment,
  getPaymentByOrderId,
  updatePayment,
  getPaymentByUserId,
  getPaymentByEmail,
  getPaymentConfigByEmail,
  createOrUpdatePaymentConfig,
  getAllPaymentConfigs,
  deletePaymentConfig,
  getCouponByCode,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  incrementCouponUsage,
  getDefaultAmount,
  getCouponEnabled,
};

