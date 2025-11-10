const express = require('express');
const {
  getAllPaymentConfigsController,
  createOrUpdatePaymentConfigController,
  deletePaymentConfigController,
  getAllCouponsController,
  createCouponController,
  updateCouponController,
  deleteCouponController,
  getCouponSettings,
  updateCouponSettings,
} = require('../controllers/paymentAdminController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, requireRole('admin'));

// Payment Config routes
router.get('/payment-configs', getAllPaymentConfigsController);
router.post('/payment-configs', createOrUpdatePaymentConfigController);
router.delete('/payment-configs/:email', deletePaymentConfigController);

// Coupon routes
router.get('/coupons', getAllCouponsController);
router.post('/coupons', createCouponController);
router.patch('/coupons/:code', updateCouponController);
router.delete('/coupons/:code', deleteCouponController);

// Coupon Settings routes
router.get('/coupon-settings', getCouponSettings);
router.patch('/coupon-settings', updateCouponSettings);

module.exports = router;

