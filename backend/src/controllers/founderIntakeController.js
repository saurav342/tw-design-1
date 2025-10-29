const { createFounderIntake, listFounderIntakes } = require('../models/founderIntakeModel');

const REQUIRED_FIELDS = ['fullName', 'email', 'startupName'];

const submitFounderIntake = (req, res) => {
  try {
    const payload = req.body ?? {};

    const missing = REQUIRED_FIELDS.filter((field) => !payload[field]);
    if (missing.length) {
      return res.status(400).json({
        message: `Missing founder intake fields: ${missing.join(', ')}`,
      });
    }

    if (payload.matches && !Array.isArray(payload.matches)) {
      return res.status(400).json({ message: 'matches must be an array when supplied.' });
    }

    const created = createFounderIntake(payload);
    return res.status(201).json({ item: created });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to submit founder intake.' });
  }
};

const getFounderIntakes = (req, res) => {
  const items = listFounderIntakes();
  return res.status(200).json({ items });
};

module.exports = {
  getFounderIntakes,
  submitFounderIntake,
};
