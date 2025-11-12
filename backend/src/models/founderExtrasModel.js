const FounderExtras = require('./schemas/FounderExtras');

const createDefaultFounderExtras = () => ({
  marketplaceListing: null,
  successFeeRequest: null,
  serviceRequests: [],
});

const cloneExtras = (extras) => {
  if (!extras) return createDefaultFounderExtras();
  const extrasObj = extras.toObject ? extras.toObject() : extras;
  // Remove MongoDB internal fields
  const { _id, __v, createdAt, updatedAt, ...cleanExtras } = extrasObj;
  return {
    marketplaceListing: cleanExtras.marketplaceListing ? { ...cleanExtras.marketplaceListing } : null,
    successFeeRequest: cleanExtras.successFeeRequest ? { ...cleanExtras.successFeeRequest } : null,
    serviceRequests: Array.isArray(cleanExtras.serviceRequests)
      ? cleanExtras.serviceRequests.map((item) => ({ ...item }))
      : [],
  };
};

const ensureExtrasRecord = async (founderId) => {
  if (!founderId) {
    throw new Error('founderId is required.');
  }

  let extras = await FounderExtras.findOne({ founderId });
  if (!extras) {
    extras = new FounderExtras({
      founderId,
      marketplaceListing: null,
      successFeeRequest: null,
      serviceRequests: [],
    });
    await extras.save();
  }

  return cloneExtras(extras);
};

const persistExtras = async (founderId, extrasData) => {
  const extras = await FounderExtras.findOneAndUpdate(
    { founderId },
    {
      marketplaceListing: extrasData.marketplaceListing || null,
      successFeeRequest: extrasData.successFeeRequest || null,
      serviceRequests: extrasData.serviceRequests || [],
    },
    { new: true, upsert: true }
  );

  return cloneExtras(extras);
};

const listFounderExtras = async (founderIds = null) => {
  const query = founderIds && Array.isArray(founderIds) && founderIds.length > 0
    ? { founderId: { $in: founderIds } }
    : {};
  const allExtras = await FounderExtras.find(query);
  return allExtras.map((extras) => {
    const extrasObj = extras.toObject ? extras.toObject() : extras;
    return {
      founderId: extrasObj.founderId,
      extras: cloneExtras(extras),
    };
  });
};

const getFounderExtras = async (founderId) => {
  const record = await ensureExtrasRecord(founderId);
  return record;
};

const upsertMarketplaceListing = async (founderId, listing) => {
  const record = await ensureExtrasRecord(founderId);
  const normalized = listing
    ? {
        ...listing,
        id: listing.id || `marketplace-${Date.now()}`,
        lastUpdated: listing.lastUpdated || new Date().toISOString(),
      }
    : null;

  record.marketplaceListing = normalized;
  return await persistExtras(founderId, record);
};

const recordSuccessFeeRequest = async (founderId, request) => {
  const record = await ensureExtrasRecord(founderId);
  record.successFeeRequest = request
    ? {
        ...request,
        createdAt: request.createdAt || new Date().toISOString(),
      }
    : null;
  return await persistExtras(founderId, record);
};

const addServiceRequest = async (founderId, request) => {
  if (!request) {
    throw new Error('A service request payload is required.');
  }

  const record = await ensureExtrasRecord(founderId);
  const normalized = {
    ...request,
    id: request.id || `service-${Date.now()}`,
    createdAt: request.createdAt || new Date().toISOString(),
  };

  const serviceRequests = Array.isArray(record.serviceRequests) ? [...record.serviceRequests] : [];
  serviceRequests.push(normalized);
  record.serviceRequests = serviceRequests;

  return await persistExtras(founderId, record);
};

const clearFounderExtras = async (founderId) => {
  if (!founderId) return;
  await FounderExtras.findOneAndDelete({ founderId });
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
