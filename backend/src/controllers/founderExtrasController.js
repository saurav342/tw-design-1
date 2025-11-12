const {
  addServiceRequest,
  getFounderExtras,
  listFounderExtras,
  recordSuccessFeeRequest,
  upsertMarketplaceListing,
} = require('../models/founderExtrasModel');
const { getFounderIntakesByEmail } = require('../models/founderIntakeModel');

const userHasFounderAccess = (user) => user && (user.role === 'admin' || user.role === 'founder');

const canAccessFounderExtras = async (req, founderId) => {
  if (!userHasFounderAccess(req.user)) {
    return false;
  }

  if (req.user.role === 'admin') {
    return true;
  }

  if (req.user.role === 'founder') {
    // Founders can only access their own founders' extras
    // Check if the founderId belongs to a founder with the user's email
    const userFounders = await getFounderIntakesByEmail(req.user.email);
    const userFounderIds = userFounders.map((founder) => founder.id);
    return userFounderIds.includes(founderId);
  }

  return false;
};

const listExtras = async (req, res) => {
  try {
    let items;
    
    // If user is a founder, only return extras for their own founders
    if (req.user?.role === 'founder') {
      // Get all founders for this user's email
      const userFounders = await getFounderIntakesByEmail(req.user.email);
      const founderIds = userFounders.map((founder) => founder.id);
      
      // Get extras only for these founder IDs
      items = await listFounderExtras(founderIds);
    } else {
      // Admin can see all extras
      items = await listFounderExtras();
    }
    
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to list founder extras.' });
  }
};

const getExtras = async (req, res) => {
  const { founderId } = req.params;
  const canAccess = await canAccessFounderExtras(req, founderId);
  if (!canAccess) {
    return res.status(403).json({ message: 'You do not have permission to view these records.' });
  }

  try {
    const extras = await getFounderExtras(founderId);
    return res.status(200).json({ extras });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to fetch founder extras.' });
  }
};

const upsertMarketplace = async (req, res) => {
  const { founderId } = req.params;
  const canAccess = await canAccessFounderExtras(req, founderId);
  if (!canAccess) {
    return res.status(403).json({ message: 'You do not have permission to update this listing.' });
  }

  try {
    const extras = await upsertMarketplaceListing(founderId, req.body ?? null);
    return res.status(200).json({ extras });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to save marketplace listing.' });
  }
};

const upsertSuccessFee = async (req, res) => {
  const { founderId } = req.params;
  const canAccess = await canAccessFounderExtras(req, founderId);
  if (!canAccess) {
    return res.status(403).json({ message: 'You do not have permission to update this request.' });
  }

  try {
    const extras = await recordSuccessFeeRequest(founderId, req.body ?? null);
    return res.status(200).json({ extras });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to save success-fee request.' });
  }
};

const createServiceRequest = async (req, res) => {
  const { founderId } = req.params;
  const canAccess = await canAccessFounderExtras(req, founderId);
  if (!canAccess) {
    return res.status(403).json({ message: 'You do not have permission to submit this brief.' });
  }

  try {
    const extras = await addServiceRequest(founderId, req.body ?? null);
    return res.status(201).json({ extras });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create service request.' });
  }
};

module.exports = {
  createServiceRequest,
  getExtras,
  listExtras,
  upsertMarketplace,
  upsertSuccessFee,
};
