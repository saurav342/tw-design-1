const { randomUUID } = require('crypto');
const store = require('../data/store');

const listPortfolio = () => store.portfolio;

const addPortfolioItem = (item) => {
  const newItem = {
    id: randomUUID(),
    name: item.name,
    sector: item.sector,
    founders: item.founders ?? [],
    milestone: item.milestone ?? '',
    summary: item.summary ?? '',
    link: item.link ?? '',
    status: item.status ?? 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.portfolio.push(newItem);
  return newItem;
};

const updatePortfolioItem = (id, updates) => {
  const index = store.portfolio.findIndex((company) => company.id === id);
  if (index === -1) {
    throw new Error('Portfolio entry not found');
  }

  const existing = store.portfolio[index];
  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  store.portfolio[index] = updated;
  return updated;
};

const removePortfolioItem = (id) => {
  const index = store.portfolio.findIndex((company) => company.id === id);
  if (index === -1) {
    throw new Error('Portfolio entry not found');
  }

  const [removed] = store.portfolio.splice(index, 1);
  return removed;
};

module.exports = {
  addPortfolioItem,
  listPortfolio,
  removePortfolioItem,
  updatePortfolioItem,
};
