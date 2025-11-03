const { randomUUID } = require('crypto');
const store = require('../data/store');
const { ensureExtrasRecord } = require('./founderExtrasModel');

const sanitizeIntake = (record) => ({ ...record });

const listFounderIntakes = () => store.founderIntakes.map(sanitizeIntake);

const createFounderIntake = (input = {}) => {
  const now = new Date().toISOString();
  const id = input.id ?? `founder-${randomUUID()}`;

  const normalized = {
    ...input,
    id,
    status: input.status ?? 'pending',
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };

  const existingIndex = store.founderIntakes.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    store.founderIntakes.splice(existingIndex, 1, normalized);
  } else {
    store.founderIntakes.unshift(normalized);
  }

  ensureExtrasRecord(id);

  return sanitizeIntake(normalized);
};

module.exports = {
  createFounderIntake,
  listFounderIntakes,
};
