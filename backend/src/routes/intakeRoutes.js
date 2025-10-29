const express = require('express');
const { getFounderIntakes, submitFounderIntake } = require('../controllers/founderIntakeController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/founders', submitFounderIntake);
router.get('/founders', authenticate, requireRole('admin'), getFounderIntakes);

module.exports = router;
