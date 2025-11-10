const express = require('express');
const {
  getPaymentAmount,
  createOrder,
  verifyPayment,
  getPaymentStatus,
  validateCoupon,
  getCouponSettings,
} = require('../controllers/paymentController');

const router = express.Router();

// Public routes (authentication is optional - founders may not be logged in yet)
router.get('/amount', getPaymentAmount);
router.get('/coupon-settings', getCouponSettings);
router.post('/validate-coupon', validateCoupon);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/status/:orderId', getPaymentStatus);

module.exports = router;

