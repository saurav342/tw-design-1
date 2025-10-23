const {
  addFaq,
  addTestimonial,
  getFaqs,
  getNews,
  getStats,
  getTeam,
  removeFaq,
  removeTestimonial,
  setNews,
  setTeam,
  updateStats,
} = require('../models/contentModel');

const getStatsController = (req, res) => res.status(200).json(getStats());

const updateStatsController = (req, res) => {
  try {
    const { metrics } = req.body || {};
    if (!Array.isArray(metrics)) {
      return res.status(400).json({ message: 'Metrics must be an array.' });
    }
    const updated = updateStats(metrics);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getTestimonialsController = (req, res) => res.status(200).json({ items: getTestimonials() });

const createTestimonialController = (req, res) => {
  try {
    const { name, role, quote } = req.body;
    if (!name || !role || !quote) {
      return res.status(400).json({ message: 'Name, role, and quote are required.' });
    }
    const item = addTestimonial({ name, role, quote });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteTestimonialController = (req, res) => {
  try {
    const item = removeTestimonial(req.params.id);
    return res.status(200).json({ item });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getFaqsController = (req, res) => {
  const items = getFaqs(req.query.audience);
  return res.status(200).json({ items });
};

const addFaqController = (req, res) => {
  try {
    const { question, answer, audience } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required.' });
    }
    const item = addFaq({ question, answer, audience });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteFaqController = (req, res) => {
  try {
    const item = removeFaq(req.params.id);
    return res.status(200).json({ item });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getTeamController = (req, res) => res.status(200).json({ items: getTeam() });

const updateTeamController = (req, res) => {
  try {
    const { members } = req.body || {};
    if (!Array.isArray(members)) {
      return res.status(400).json({ message: 'Members must be an array.' });
    }
    const items = setTeam(members);
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getNewsController = (req, res) => res.status(200).json({ items: getNews() });

const updateNewsController = (req, res) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'News items must be an array.' });
    }
    const updated = setNews(items);
    return res.status(200).json({ items: updated });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
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
};
