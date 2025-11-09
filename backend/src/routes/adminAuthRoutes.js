const express = require('express');
const { adminLogin, adminSignup } = require('../controllers/adminAuthController');

const router = express.Router();

// Admin authentication routes (separate from public auth)
router.post('/login', adminLogin);
router.post('/signup', adminSignup);

module.exports = router;

