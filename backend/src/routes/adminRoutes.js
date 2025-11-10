const express = require('express');
const {
  deleteUserController,
  getActivityLog,
  getAnalytics,
  getDashboardSummary,
  getFounders,
  getInvestors,
  getSiteMetrics,
  getUsers,
  updateUserController,
} = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/users', getUsers);
router.patch('/users/:id', updateUserController);
router.delete('/users/:id', deleteUserController);
router.get('/metrics', getSiteMetrics);
router.get('/analytics', getAnalytics);
router.get('/activity-log', getActivityLog);
router.get('/dashboard-summary', getDashboardSummary);
router.get('/founders', getFounders);
router.get('/investors', getInvestors);

module.exports = router;
