const Razorpay = require('razorpay');
const crypto = require('crypto');
const {
  createPayment,
  getPaymentByOrderId,
  updatePayment,
  getPaymentConfigByEmail,
  getCouponByCode,
  incrementCouponUsage,
  getDefaultAmount,
  getCouponEnabled,
} = require('../models/paymentModel');

// Validate Razorpay credentials
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('⚠️  Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.');
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get payment amount for a founder email
const getPaymentAmount = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Check for custom amount configuration
    const config = await getPaymentConfigByEmail(email);
    const amount = config ? config.customAmount : getDefaultAmount();

    return res.status(200).json({
      amount,
      currency: 'INR',
      hasCustomAmount: !!config,
    });
  } catch (error) {
    console.error('Error getting payment amount:', error);
    return res.status(500).json({ message: 'Unable to fetch payment amount.' });
  }
};

// Create Razorpay order
const createOrder = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      return res.status(500).json({ 
        message: 'Payment gateway is not configured. Please contact support.' 
      });
    }

    const { amount, email, couponCode } = req.body;
    // Authentication is optional - founders may not be logged in yet
    const userId = req.user?.id || null;

    if (!amount || !email) {
      return res.status(400).json({ message: 'Amount and email are required.' });
    }

    // Validate amount
    const paymentAmount = parseInt(amount, 10);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount.' });
    }

    let finalAmount = paymentAmount;
    let discountAmount = 0;
    let appliedCoupon = null;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await getCouponByCode(couponCode);
      if (coupon && coupon.isValid(paymentAmount)) {
        discountAmount = coupon.calculateDiscount(paymentAmount);
        finalAmount = paymentAmount - discountAmount;
        appliedCoupon = coupon.code;
      } else {
        return res.status(400).json({ message: 'Invalid or expired coupon code.' });
      }
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(finalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        email: email.toLowerCase(),
        userId: userId || 'guest',
        couponCode: appliedCoupon || '',
        originalAmount: paymentAmount,
        discountAmount: discountAmount,
      },
    };

    console.log('[Payment] Creating Razorpay order with options:', {
      ...options,
      key_id: process.env.RAZORPAY_KEY_ID ? '***configured***' : 'missing',
    });

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
      console.log('[Payment] Razorpay order created:', razorpayOrder.id);
    } catch (razorpayError) {
      console.error('[Payment] Razorpay order creation failed:', razorpayError);
      if (razorpayError.error && razorpayError.error.description) {
        return res.status(500).json({ 
          message: `Failed to create payment order: ${razorpayError.error.description}` 
        });
      }
      throw razorpayError;
    }

    // Save payment record
    const payment = await createPayment({
      userId: userId || null,
      founderEmail: email.toLowerCase(),
      amount: paymentAmount,
      currency: 'INR',
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
      couponCode: appliedCoupon,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
      metadata: {
        receipt: options.receipt,
      },
    });

    return res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id || payment.id,
      appliedCoupon: appliedCoupon,
      discountAmount: discountAmount,
      originalAmount: paymentAmount,
      finalAmount: finalAmount,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      message: error.message || 'Unable to create payment order.' 
    });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, couponCode } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('[Payment] Missing verification data:', {
        hasOrderId: !!razorpay_order_id,
        hasPaymentId: !!razorpay_payment_id,
        hasSignature: !!razorpay_signature,
      });
      return res.status(400).json({ message: 'Missing payment verification data.' });
    }

    // Check if Razorpay secret is configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('[Payment] Razorpay key secret not configured');
      return res.status(500).json({ message: 'Payment gateway configuration error. Please contact support.' });
    }

    // Get payment record
    const payment = await getPaymentByOrderId(razorpay_order_id);
    if (!payment) {
      console.error('[Payment] Payment order not found:', razorpay_order_id);
      return res.status(404).json({ message: 'Payment order not found.' });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('[Payment] Signature verification failed:', {
        orderId: razorpay_order_id,
        expected: generatedSignature.substring(0, 10) + '...',
        received: razorpay_signature.substring(0, 10) + '...',
      });
      
      // Update payment status to failed
      await updatePayment(razorpay_order_id, {
        status: 'failed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        verificationError: 'Signature mismatch',
      });
      return res.status(400).json({ message: 'Payment verification failed. Signature mismatch.' });
    }

    // If payment is already completed, return the existing payment
    if (payment.status === 'completed') {
      console.log('[Payment] Payment already verified:', razorpay_order_id);
      return res.status(200).json({
        message: 'Payment already verified.',
        payment: payment,
      });
    }

    // Increment coupon usage if coupon was used
    if (payment.couponCode) {
      try {
        await incrementCouponUsage(payment.couponCode);
      } catch (couponError) {
        console.error('[Payment] Error incrementing coupon usage:', couponError);
        // Don't fail the payment verification if coupon increment fails
      }
    }

    // Update payment status to completed
    const updatedPayment = await updatePayment(razorpay_order_id, {
      status: 'completed',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      completedAt: new Date(),
    });

    if (!updatedPayment) {
      console.error('[Payment] Failed to update payment status:', razorpay_order_id);
      return res.status(500).json({ message: 'Failed to update payment status. Please contact support.' });
    }

    console.log('[Payment] Payment verified successfully:', razorpay_order_id);
    return res.status(200).json({
      message: 'Payment verified successfully.',
      payment: updatedPayment,
    });
  } catch (error) {
    console.error('[Payment] Error verifying payment:', error);
    return res.status(500).json({ 
      message: error.message || 'Unable to verify payment.' 
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }

    console.log('[Payment] Fetching payment status for orderId:', orderId);
    
    const payment = await getPaymentByOrderId(orderId);
    if (!payment) {
      console.log('[Payment] Payment not found for orderId:', orderId);
      return res.status(404).json({ message: 'Payment not found.' });
    }

    console.log('[Payment] Payment status retrieved:', {
      orderId: payment.razorpayOrderId,
      status: payment.status,
      email: payment.founderEmail,
    });

    return res.status(200).json({ payment });
  } catch (error) {
    console.error('[Payment] Error getting payment status:', error);
    return res.status(500).json({ message: 'Unable to fetch payment status.' });
  }
};

// Validate coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code || !amount) {
      return res.status(400).json({ message: 'Coupon code and amount are required.' });
    }

    // Check if coupons are enabled
    const couponEnabled = await getCouponEnabled();
    if (!couponEnabled) {
      return res.status(400).json({ message: 'Coupons are currently disabled.' });
    }

    const coupon = await getCouponByCode(code);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    const isValid = coupon.isValid(parseFloat(amount));
    if (!isValid) {
      return res.status(400).json({ 
        message: 'Coupon is not valid for this amount or has expired.' 
      });
    }

    const discountAmount = coupon.calculateDiscount(parseFloat(amount));
    const finalAmount = parseFloat(amount) - discountAmount;

    return res.status(200).json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      finalAmount,
      originalAmount: parseFloat(amount),
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return res.status(500).json({ message: 'Unable to validate coupon.' });
  }
};

// Get coupon settings (public endpoint to check if coupons are enabled)
const getCouponSettings = async (req, res) => {
  try {
    const couponEnabled = await getCouponEnabled();
    return res.status(200).json({ couponEnabled });
  } catch (error) {
    console.error('Error getting coupon settings:', error);
    return res.status(500).json({ message: 'Unable to fetch coupon settings.' });
  }
};

module.exports = {
  getPaymentAmount,
  createOrder,
  verifyPayment,
  getPaymentStatus,
  validateCoupon,
  getCouponSettings,
};

