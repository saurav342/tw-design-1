const FounderIntake = require('./schemas/FounderIntake');
const { ensureExtrasRecord } = require('./founderExtrasModel');

const sanitizeIntake = (record) => {
  if (!record) return null;
  const recordObj = record.toObject ? record.toObject() : record;
  // Convert _id to id for consistency with frontend
  if (recordObj._id) {
    recordObj.id = recordObj._id.toString();
    delete recordObj._id;
  }
  // Remove MongoDB internal fields
  delete recordObj.__v;
  return recordObj;
};

const listFounderIntakes = async (emailFilter = null) => {
  const query = emailFilter ? { email: emailFilter.toLowerCase() } : {};
  const intakes = await FounderIntake.find(query).sort({ createdAt: -1 });
  return intakes.map(sanitizeIntake);
};

const createFounderIntake = async (input = {}) => {
  const normalized = {
    ...input,
    status: input.status ?? 'pending',
  };

  // Remove id from normalized if it exists (MongoDB will generate _id)
  delete normalized.id;

  // Check if ID is provided for update (convert to MongoDB _id format if needed)
  if (input.id) {
    try {
      const existing = await FounderIntake.findById(input.id);
      if (existing) {
        const updated = await FounderIntake.findByIdAndUpdate(
          input.id,
          normalized,
          { new: true, runValidators: true }
        );
        await ensureExtrasRecord(updated._id.toString());
        return sanitizeIntake(updated);
      }
    } catch (error) {
      // If ID format is invalid, continue to create new
      console.log('Invalid ID format, creating new intake');
    }
  }

  // Create new intake
  const intake = new FounderIntake(normalized);
  await intake.save();

  // Ensure extras record exists
  await ensureExtrasRecord(intake._id.toString());

  return sanitizeIntake(intake);
};

const getFounderIntakesByEmail = async (email) => {
  if (!email) return [];
  const intakes = await FounderIntake.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
  return intakes.map(sanitizeIntake);
};

module.exports = {
  createFounderIntake,
  listFounderIntakes,
  getFounderIntakesByEmail,
};
