const Portfolio = require('./schemas/Portfolio');

const sanitizePortfolioItem = (item) => {
  if (!item) return null;
  const itemObj = item.toObject ? item.toObject() : item;
  // Convert _id to id for consistency with frontend
  if (itemObj._id) {
    itemObj.id = itemObj._id.toString();
    delete itemObj._id;
  }
  delete itemObj.__v;
  return itemObj;
};

const listPortfolio = async () => {
  const portfolio = await Portfolio.find({}).sort({ createdAt: -1 });
  return portfolio.map(sanitizePortfolioItem);
};

const addPortfolioItem = async (item) => {
  const portfolioItem = new Portfolio({
    name: item.name,
    sector: item.sector,
    founders: item.founders ?? [],
    milestone: item.milestone ?? '',
    summary: item.summary ?? '',
    link: item.link ?? '',
    status: item.status ?? 'Active',
  });

  await portfolioItem.save();
  return sanitizePortfolioItem(portfolioItem);
};

const updatePortfolioItem = async (id, updates) => {
  const portfolioItem = await Portfolio.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );

  if (!portfolioItem) {
    throw new Error('Portfolio entry not found');
  }

  return sanitizePortfolioItem(portfolioItem);
};

const removePortfolioItem = async (id) => {
  const portfolioItem = await Portfolio.findByIdAndDelete(id);
  if (!portfolioItem) {
    throw new Error('Portfolio entry not found');
  }
  return sanitizePortfolioItem(portfolioItem);
};

module.exports = {
  addPortfolioItem,
  listPortfolio,
  removePortfolioItem,
  updatePortfolioItem,
};
