const {
  addPortfolioItem,
  listPortfolio,
  removePortfolioItem,
  updatePortfolioItem,
} = require('../models/portfolioModel');

const getPortfolio = (req, res) => {
  const items = listPortfolio();
  return res.status(200).json({ items });
};

const createPortfolio = (req, res) => {
  try {
    const newItem = addPortfolioItem(req.body ?? {});
    return res.status(201).json({ item: newItem });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const editPortfolio = (req, res) => {
  try {
    const updated = updatePortfolioItem(req.params.id, req.body ?? {});
    return res.status(200).json({ item: updated });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const deletePortfolio = (req, res) => {
  try {
    const removed = removePortfolioItem(req.params.id);
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
