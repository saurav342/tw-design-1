const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  founders: {
    type: [String],
    default: [],
  },
  milestone: String,
  summary: String,
  link: String,
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Exited', 'Inactive'],
  },
}, {
  timestamps: true,
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;

