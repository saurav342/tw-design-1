const { createFounderIntake, listFounderIntakes } = require('../models/founderIntakeModel');
const { addPortfolioItem } = require('../models/portfolioModel');
const { sendFounderIntakeNotification, sendFounderWelcomeEmail } = require('../utils/email');

const REQUIRED_FIELDS = ['fullName', 'email', 'startupName'];

const sanitizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const coercePositiveInteger = (value, fallback = null) => {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const buildSecondFounder = (input) => {
  // Handle null, undefined, or empty input
  if (!input || typeof input !== 'object') {
    return null;
  }

  const details = {
    fullName: sanitizeString(input.fullName ?? ''),
    email: sanitizeString(input.email ?? ''),
    phoneNumber: sanitizeString(input.phoneNumber ?? ''),
    linkedInUrl: sanitizeString(input.linkedInUrl ?? input.linkedin ?? ''),
  };

  const hasContent = Object.values(details).some((field) => field);
  return hasContent ? details : null;
};

const submitFounderIntake = async (req, res) => {
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

    const numberOfFounders = coercePositiveInteger(payload.numberOfFounders, 1);
    const secondFounder = buildSecondFounder(payload.secondFounder);
    const companyInput = payload.company ?? {};

    const companyDetails = {
      legalName: sanitizeString(companyInput.legalName ?? payload.companyLegalName),
      brandName: sanitizeString(companyInput.brandName ?? payload.brandName ?? payload.startupName),
      website: sanitizeString(companyInput.website ?? payload.companyWebsite),
      foundingDate: sanitizeString(
        companyInput.foundingDate ?? 
        payload.companyFoundingDate ?? 
        payload.foundedOn ?? 
        ''
      ),
      sector: sanitizeString(companyInput.sector ?? payload.sector),
      currentStage: sanitizeString(
        companyInput.currentStage ?? payload.currentStage ?? payload.raiseStage,
      ),
      brief: sanitizeString(companyInput.brief ?? payload.brief ?? payload.tractionSummary),
      pitchDeckUrl: sanitizeString(
        companyInput.pitchDeckUrl ?? 
        payload.pitchDeckUrl ?? 
        payload.pitchDeck ?? 
        ''
      ),
    };

    const normalized = {
      ...payload,
      fullName: sanitizeString(payload.fullName),
      email: sanitizeString(payload.email),
      phoneNumber: sanitizeString(payload.phoneNumber),
      linkedInUrl: sanitizeString(payload.linkedInUrl ?? payload.linkedin),
      numberOfFounders,
      secondFounder,
      company: companyDetails,
      startupName:
        sanitizeString(payload.startupName) ||
        companyDetails.brandName ||
        companyDetails.legalName,
      brandName: companyDetails.brandName,
      companyLegalName: companyDetails.legalName,
      companyWebsite: companyDetails.website,
      sector: companyDetails.sector,
      currentStage: companyDetails.currentStage,
      tractionSummary: companyDetails.brief,
      raiseStage: companyDetails.currentStage || payload.raiseStage,
      teamSize: numberOfFounders ?? payload.teamSize,
      foundedOn: companyDetails.foundingDate || payload.foundedOn || '',
      pitchDeckUrl: companyDetails.pitchDeckUrl || payload.pitchDeckUrl || '',
      matches: Array.isArray(payload.matches) ? payload.matches : [],
      submittedFrom: payload.submittedFrom ?? 'founder-signup-v2',
      readiness: Array.isArray(payload.readiness) ? payload.readiness : [],
      benchmarkNotes: payload.benchmarkNotes || {},
      benchmarks: Array.isArray(payload.benchmarks) ? payload.benchmarks : [],
      aiSummary: payload.aiSummary || '',
    };

    const created = await createFounderIntake(normalized);

    // Automatically create portfolio item from founder intake
    try {
      const foundersList = [normalized.fullName || 'Unknown Founder'];
      if (secondFounder && typeof secondFounder === 'object' && secondFounder.fullName) {
        foundersList.push(secondFounder.fullName);
      }

      const portfolioItem = {
        name: companyDetails.brandName || companyDetails.legalName || normalized.startupName || 'New Company',
        sector: companyDetails.sector || normalized.sector || 'Not Specified',
        founders: foundersList,
        milestone: companyDetails.currentStage 
          ? `Currently at ${companyDetails.currentStage} stage` 
          : 'Early stage startup',
        summary: companyDetails.brief || normalized.tractionSummary || normalized.brief || 'Building innovative solutions',
        link: companyDetails.website || normalized.companyWebsite || '#',
        status: 'Active',
      };

      await addPortfolioItem(portfolioItem);
    } catch (portfolioError) {
      // Log error but don't fail the founder intake submission
      console.error('Failed to create portfolio item:', portfolioError);
    }

    // Send emails (non-blocking)
    try {
      // Send welcome email to founder
      sendFounderWelcomeEmail(normalized.fullName, normalized.email).catch((err) => {
        console.error('Failed to send founder welcome email:', err);
      });

      // Send notification email to admin
      sendFounderIntakeNotification(created).catch((err) => {
        console.error('Failed to send admin notification email:', err);
      });
    } catch (emailError) {
      // Log error but don't fail the submission
      console.error('Error sending emails:', emailError);
    }

    return res.status(201).json({ item: created });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to submit founder intake.' });
  }
};

const getFounderIntakes = async (req, res) => {
  try {
    // If user is a founder, only return their own founders (filter by email)
    // If user is an admin, return all founders
    const emailFilter = req.user?.role === 'founder' ? req.user.email : null;
    const items = await listFounderIntakes(emailFilter);
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch founder intakes.' });
  }
};

module.exports = {
  getFounderIntakes,
  submitFounderIntake,
};
