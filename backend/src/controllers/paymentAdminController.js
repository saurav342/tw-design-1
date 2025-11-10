const {
  getAllPaymentConfigs,
  createOrUpdatePaymentConfig,
  deletePaymentConfig,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponByCode,
} = require('../models/paymentModel');
const PaymentConfig = require('../models/schemas/PaymentConfig');
const Coupon = require('../models/schemas/Coupon');
const Settings = require('../models/schemas/Settings');

// Payment Config Management

// Get all payment configs
const getAllPaymentConfigsController = async (req, res) => {
  try {
    const configs = await getAllPaymentConfigs();
    return res.status(200).json({ items: configs });
  } catch (error) {
    console.error('Error getting payment configs:', error);
    return res.status(500).json({ message: 'Unable to fetch payment configs.' });
  }
};

// Create or update payment config
const createOrUpdatePaymentConfigController = async (req, res) => {
  try {
    const { founderEmail, customAmount, notes } = req.body;
    const createdBy = req.user?.id;

    if (!founderEmail || !customAmount) {
      return res.status(400).json({ 
        message: 'Founder email and custom amount are required.' 
      });
    }

    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({ message: 'Invalid amount.' });
    }

    const config = await createOrUpdatePaymentConfig(
      founderEmail,
      amount,
      notes || '',
      createdBy
    );

    return res.status(200).json({ item: config });
  } catch (error) {
    console.error('Error creating/updating payment config:', error);
    return res.status(500).json({ 
      message: error.message || 'Unable to create/update payment config.' 
    });
  }
};

// Delete payment config
const deletePaymentConfigController = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const config = await deletePaymentConfig(email);
    if (!config) {
      return res.status(404).json({ message: 'Payment config not found.' });
    }

    return res.status(200).json({ item: config });
  } catch (error) {
    console.error('Error deleting payment config:', error);
    return res.status(500).json({ message: 'Unable to delete payment config.' });
  }
};

// Coupon Management

// Get all coupons
const getAllCouponsController = async (req, res) => {
  try {
    const coupons = await getAllCoupons();
    return res.status(200).json({ items: coupons });
  } catch (error) {
    console.error('Error getting coupons:', error);
    return res.status(500).json({ message: 'Unable to fetch coupons.' });
  }
};

// Create coupon
const createCouponController = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscountAmount,
      minAmount,
      maxUses,
      validFrom,
      validUntil,
      isActive,
    } = req.body;
    const createdBy = req.user?.id;

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ 
        message: 'Code, discount type, and discount value are required.' 
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await getCouponByCode(code);
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists.' });
    }

    const couponData = {
      code,
      description: description || '',
      discountType,
      discountValue: parseFloat(discountValue),
      maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
      minAmount: minAmount ? parseFloat(minAmount) : 0,
      maxUses: maxUses ? parseInt(maxUses, 10) : null,
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validUntil: validUntil ? new Date(validUntil) : null,
      isActive: isActive !== undefined ? isActive : true,
      createdBy,
    };

    const coupon = await createCoupon(couponData);
    return res.status(201).json({ item: coupon });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return res.status(500).json({ 
      message: error.message || 'Unable to create coupon.' 
    });
  }
};

// Update coupon
const updateCouponController = async (req, res) => {
  try {
    const { code } = req.params;
    const updates = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required.' });
    }

    // Parse numeric fields
    if (updates.discountValue) {
      updates.discountValue = parseFloat(updates.discountValue);
    }
    if (updates.maxDiscountAmount !== undefined) {
      updates.maxDiscountAmount = updates.maxDiscountAmount 
        ? parseFloat(updates.maxDiscountAmount) 
        : null;
    }
    if (updates.minAmount !== undefined) {
      updates.minAmount = parseFloat(updates.minAmount);
    }
    if (updates.maxUses !== undefined) {
      updates.maxUses = updates.maxUses ? parseInt(updates.maxUses, 10) : null;
    }
    if (updates.validFrom) {
      updates.validFrom = new Date(updates.validFrom);
    }
    if (updates.validUntil !== undefined) {
      updates.validUntil = updates.validUntil ? new Date(updates.validUntil) : null;
    }

    const coupon = await updateCoupon(code, updates);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    return res.status(200).json({ item: coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return res.status(500).json({ 
      message: error.message || 'Unable to update coupon.' 
    });
  }
};

// Delete coupon
const deleteCouponController = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required.' });
    }

    const coupon = await deleteCoupon(code);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    return res.status(200).json({ item: coupon });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return res.status(500).json({ message: 'Unable to delete coupon.' });
  }
};

// Get coupon settings (toggle status)
const getCouponSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'couponEnabled' });
    
    // If settings don't exist, create with default value (true)
    if (!settings) {
      settings = await Settings.create({
        key: 'couponEnabled',
        value: true,
        description: 'Enable or disable coupon section on payment confirmation page',
        updatedBy: req.user?.id,
      });
    }
    
    return res.status(200).json({
      couponEnabled: settings.value === true || settings.value === 'true',
    });
  } catch (error) {
    console.error('Error getting coupon settings:', error);
    return res.status(500).json({ message: 'Unable to fetch coupon settings.' });
  }
};

// Update coupon settings (toggle status)
const updateCouponSettings = async (req, res) => {
  try {
    const { couponEnabled } = req.body;

    if (typeof couponEnabled !== 'boolean') {
      return res.status(400).json({ message: 'couponEnabled must be a boolean.' });
    }

    const settings = await Settings.findOneAndUpdate(
      { key: 'couponEnabled' },
      {
        key: 'couponEnabled',
        value: couponEnabled,
        description: 'Enable or disable coupon section on payment confirmation page',
        updatedBy: req.user?.id,
      },
      { upsert: true, new: true }
    );
    
    return res.status(200).json({
      couponEnabled: settings.value,
      message: 'Coupon settings updated successfully.',
    });
  } catch (error) {
    console.error('Error updating coupon settings:', error);
    return res.status(500).json({ message: 'Unable to update coupon settings.' });
  }
};

module.exports = {
  getAllPaymentConfigsController,
  createOrUpdatePaymentConfigController,
  deletePaymentConfigController,
  getAllCouponsController,
  createCouponController,
  updateCouponController,
  deleteCouponController,
  getCouponSettings,
  updateCouponSettings,
};

