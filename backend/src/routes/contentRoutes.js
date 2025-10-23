const express = require('express');
const {
  addFaqController,
  createTestimonialController,
  deleteFaqController,
  deleteTestimonialController,
  getFaqsController,
  getNewsController,
  getStatsController,
  getTeamController,
  getTestimonialsController,
  updateNewsController,
  updateStatsController,
  updateTeamController,
} = require('../controllers/contentController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', getStatsController);
router.put('/stats', authenticate, requireRole('admin'), updateStatsController);

router.get('/testimonials', getTestimonialsController);
router.post('/testimonials', authenticate, requireRole('admin'), createTestimonialController);
router.delete('/testimonials/:id', authenticate, requireRole('admin'), deleteTestimonialController);

router.get('/faqs', getFaqsController);
router.post('/faqs', authenticate, requireRole('admin'), addFaqController);
router.delete('/faqs/:id', authenticate, requireRole('admin'), deleteFaqController);

router.get('/team', getTeamController);
router.put('/team', authenticate, requireRole('admin'), updateTeamController);

router.get('/news', getNewsController);
router.put('/news', authenticate, requireRole('admin'), updateNewsController);

module.exports = router;
