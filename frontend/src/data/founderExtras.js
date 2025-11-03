export const INITIAL_MARKETPLACE_LISTING = {
  id: 'mock-1',
  raiseAmount: 2_500_000,
  minTicket: 50_000,
  useOfFunds: 'Team, GTM, Product polish',
  status: 'active',
  lastUpdated: '2025-11-01',
  industry: 'SaaS / GTM enablement',
  startupName: 'OrbitStack',
};

export const SUCCESS_FEE_ROUNDS = ['Pre-seed', 'Seed', 'Bridge', 'Series A'];

export const FOUNDER_SERVICE_OPTIONS = [
  'Pitch deck preparation',
  'Mentorship / advisory',
  'Financial projections',
  'Legal & compliance',
  'Tech enhancement support',
  'Growth marketing',
];

export const FOUNDER_SERVICE_URGENCY = ['Low', 'Normal', 'High'];

export const createDefaultFounderExtras = () => ({
  marketplaceListing: { ...INITIAL_MARKETPLACE_LISTING },
  successFeeRequest: null,
  serviceRequests: [],
});
