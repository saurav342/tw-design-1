const mongoose = require('mongoose');

const founderIntakeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: String,
  linkedInUrl: String,
  numberOfFounders: {
    type: Number,
    default: 1,
  },
  secondFounder: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  startupName: {
    type: String,
    required: true,
  },
  brandName: String,
  companyLegalName: String,
  companyWebsite: String,
  sector: String,
  currentStage: String,
  raiseStage: String,
  tractionSummary: String,
  brief: String,
  teamSize: Number,
  geography: String,
  raiseAmountUSD: Number,
  revenueRunRateUSD: Number,
  pitchDeckUrl: String,
  company: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected', 'reviewed'],
  },
  submittedFrom: String,
  readiness: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  benchmarks: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  benchmarkNotes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  matches: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  subSectors: {
    type: [String],
    default: [],
  },
  aiSummary: String,
  metrics: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
founderIntakeSchema.index({ email: 1 });
founderIntakeSchema.index({ status: 1 });
founderIntakeSchema.index({ createdAt: -1 });

const FounderIntake = mongoose.model('FounderIntake', founderIntakeSchema);

module.exports = FounderIntake;

