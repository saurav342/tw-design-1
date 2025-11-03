const express = require('express');
const {
  createServiceRequest,
  getExtras,
  listExtras,
  upsertMarketplace,
  upsertSuccessFee,
} = require('../controllers/founderExtrasController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', requireRole('admin'), listExtras);
router.get('/:founderId', requireRole('admin', 'founder'), getExtras);
router.put('/:founderId/marketplace', requireRole('admin', 'founder'), upsertMarketplace);
router.put('/:founderId/success-fee', requireRole('admin', 'founder'), upsertSuccessFee);
router.post('/:founderId/service-requests', requireRole('admin', 'founder'), createServiceRequest);

module.exports = router;
