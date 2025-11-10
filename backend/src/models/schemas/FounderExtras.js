const mongoose = require('mongoose');

const founderExtrasSchema = new mongoose.Schema({
  founderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  marketplaceListing: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  successFeeRequest: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  serviceRequests: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
}, {
  timestamps: true,
});

const FounderExtras = mongoose.model('FounderExtras', founderExtrasSchema);

module.exports = FounderExtras;

