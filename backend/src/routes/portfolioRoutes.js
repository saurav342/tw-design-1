const express = require('express');
const {
  createPortfolio,
  deletePortfolio,
  editPortfolio,
  getPortfolio,
} = require('../controllers/portfolioController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPortfolio);
router.post('/', authenticate, requireRole('admin'), createPortfolio);
router.put('/:id', authenticate, requireRole('admin'), editPortfolio);
router.delete('/:id', authenticate, requireRole('admin'), deletePortfolio);

module.exports = router;
