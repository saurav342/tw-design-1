const express = require('express');
const {
  confirmPasswordReset,
  getProfile,
  login,
  requestPasswordReset,
  signup,
  updateProfile,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/reset-password', requestPasswordReset);
router.post('/reset-password/confirm', confirmPasswordReset);

module.exports = router;
