const { randomUUID } = require('crypto');
const store = require('../data/store');

const createDefaultFounderExtras = () => ({
  marketplaceListing: null,
  successFeeRequest: null,
  serviceRequests: [],
});

const cloneExtras = (extras) => ({
  marketplaceListing: extras.marketplaceListing ? { ...extras.marketplaceListing } : null,
  successFeeRequest: extras.successFeeRequest ? { ...extras.successFeeRequest } : null,
  serviceRequests: Array.isArray(extras.serviceRequests)
    ? extras.serviceRequests.map((item) => ({ ...item }))
    : [],
});

const ensureExtrasRecord = (founderId) => {
  if (!founderId) {
    throw new Error('founderId is required.');
  }

  if (!store.founderExtras) {
    store.founderExtras = {};
  }

  if (!store.founderExtras[founderId]) {
    store.founderExtras[founderId] = createDefaultFounderExtras();
  }

  return store.founderExtras[founderId];
};

const persistExtras = (founderId, extras) => {
  store.founderExtras[founderId] = {
    marketplaceListing: extras.marketplaceListing ? { ...extras.marketplaceListing } : null,
    successFeeRequest: extras.successFeeRequest ? { ...extras.successFeeRequest } : null,
    serviceRequests: Array.isArray(extras.serviceRequests)
      ? extras.serviceRequests.map((item) => ({ ...item }))
      : [],
  };

  return cloneExtras(store.founderExtras[founderId]);
};

const listFounderExtras = () =>
  Object.entries(store.founderExtras ?? {}).map(([founderId, extras]) => ({
    founderId,
    extras: cloneExtras(extras),
  }));

const getFounderExtras = (founderId) => {
  const record = ensureExtrasRecord(founderId);
  return cloneExtras(record);
};

const upsertMarketplaceListing = (founderId, listing) => {
  const record = ensureExtrasRecord(founderId);
  const normalized = listing
    ? {
        ...listing,
        id: listing.id ?? `marketplace-${randomUUID()}`,
        lastUpdated: listing.lastUpdated ?? new Date().toISOString(),
      }
    : null;
  record.marketplaceListing = normalized;
  return persistExtras(founderId, record);
};

const recordSuccessFeeRequest = (founderId, request) => {
  const record = ensureExtrasRecord(founderId);
  if (!request) {
    record.successFeeRequest = null;
    return persistExtras(founderId, record);
  }

  record.successFeeRequest = {
    ...request,
    createdAt: request.createdAt ?? new Date().toISOString(),
  };
  return persistExtras(founderId, record);
};

const addServiceRequest = (founderId, request) => {
  if (!request) {
    throw new Error('A service request payload is required.');
  }
  const record = ensureExtrasRecord(founderId);
  const now = new Date().toISOString();
  const normalized = {
    ...request,
    id: request.id ?? `service-${randomUUID()}`,
    createdAt: request.createdAt ?? now,
  };

  const queue = Array.isArray(record.serviceRequests) ? [...record.serviceRequests] : [];
  queue.push(normalized);
  record.serviceRequests = queue;
  return persistExtras(founderId, record);
};

const clearFounderExtras = (founderId) => {
  if (!founderId || !store.founderExtras) return;
  delete store.founderExtras[founderId];
};

module.exports = {
  addServiceRequest,
  clearFounderExtras,
  getFounderExtras,
  listFounderExtras,
  recordSuccessFeeRequest,
  upsertMarketplaceListing,
  ensureExtrasRecord,
};
