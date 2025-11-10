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

const getStatsController = async (req, res) => {
  try {
    const stats = await getStats();
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateStatsController = async (req, res) => {
  try {
    const { metrics } = req.body || {};
    if (!Array.isArray(metrics)) {
      return res.status(400).json({ message: 'Metrics must be an array.' });
    }
    const updated = await updateStats(metrics);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getTestimonialsController = async (req, res) => {
  try {
    const items = await getTestimonials();
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createTestimonialController = async (req, res) => {
  try {
    const { name, role, quote } = req.body;
    if (!name || !role || !quote) {
      return res.status(400).json({ message: 'Name, role, and quote are required.' });
    }
    const item = await addTestimonial({ name, role, quote });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteTestimonialController = async (req, res) => {
  try {
    const item = await removeTestimonial(req.params.id);
    return res.status(200).json({ item });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getFaqsController = async (req, res) => {
  try {
    const items = await getFaqs(req.query.audience);
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addFaqController = async (req, res) => {
  try {
    const { question, answer, audience } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required.' });
    }
    const item = await addFaq({ question, answer, audience });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteFaqController = async (req, res) => {
  try {
    const item = await removeFaq(req.params.id);
    return res.status(200).json({ item });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getTeamController = async (req, res) => {
  try {
    const items = await getTeam();
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateTeamController = async (req, res) => {
  try {
    const { members } = req.body || {};
    if (!Array.isArray(members)) {
      return res.status(400).json({ message: 'Members must be an array.' });
    }
    const items = await setTeam(members);
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getNewsController = async (req, res) => {
  try {
    const items = await getNews();
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateNewsController = async (req, res) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'News items must be an array.' });
    }
    const updated = await setNews(items);
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
