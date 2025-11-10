const {
  addPortfolioItem,
  listPortfolio,
  removePortfolioItem,
  updatePortfolioItem,
} = require('../models/portfolioModel');

const getPortfolio = async (req, res) => {
  try {
    const items = await listPortfolio();
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createPortfolio = async (req, res) => {
  try {
    const newItem = await addPortfolioItem(req.body ?? {});
    return res.status(201).json({ item: newItem });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const editPortfolio = async (req, res) => {
  try {
    const updated = await updatePortfolioItem(req.params.id, req.body ?? {});
    return res.status(200).json({ item: updated });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const removed = await removePortfolioItem(req.params.id);
    return res.status(200).json({ item: removed });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createPortfolio,
  deletePortfolio,
  editPortfolio,
  getPortfolio,
};
