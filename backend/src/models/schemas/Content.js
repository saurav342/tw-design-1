const mongoose = require('mongoose');

// Stats Schema
const statsSchema = new mongoose.Schema({
  metrics: [{
    label: String,
    value: String,
    caption: String,
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

// Team Schema
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  bio: String,
  linkedin: String,
}, {
  timestamps: true,
});

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// FAQ Schema
const faqSchema = new mongoose.Schema({
  audience: {
    type: String,
    required: true,
    enum: ['investor', 'founder', 'general'],
    default: 'general',
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// News Schema
const newsSchema = new mongoose.Schema({
  outlet: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Content Settings Schema (single document for stats)
const contentSettingsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'settings',
  },
  stats: {
    type: statsSchema,
    default: () => ({
      metrics: [],
      lastUpdated: new Date(),
    }),
  },
}, {
  _id: false,
});

const Team = mongoose.model('Team', teamSchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const FAQ = mongoose.model('FAQ', faqSchema);
const News = mongoose.model('News', newsSchema);
const ContentSettings = mongoose.model('ContentSettings', contentSettingsSchema);

module.exports = {
  Team,
  Testimonial,
  FAQ,
  News,
  ContentSettings,
};

