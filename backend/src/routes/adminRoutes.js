const express = require('express');
const {
  deleteUserController,
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

module.exports = router;
