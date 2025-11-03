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

export const FOUNDER_SERVICE_DETAILS = [
  {
    id: 'pitch-deck',
    title: 'Pitch deck preparation',
    tagline: 'Narrative, visuals, and data story in one deck that earns second meetings.',
    description:
      'Work with former operators and designers to tighten your storyline, metrics framing, and visual polish. Includes feedback loops with investors in mind.',
    outcomes: ['Story architecture & slide sequencing', 'Competitive positioning & traction proof', 'Design refresh ready for investor delivery'],
  },
  {
    id: 'mentorship',
    title: 'Mentorship / advisory',
    tagline: 'Strategic advisory from founders and investors who have scaled at your stage.',
    description:
      'Pair with a Launch & Lift advisor for fortnightly coaching, dry runs, or diligence prep tailored to gaps surfaced in your readiness benchmarks.',
    outcomes: ['Fundraise messaging rehearsal', 'Board & cap table guidance', 'Warm intros to sector operators'],
  },
  {
    id: 'financials',
    title: 'Financial projections',
    tagline: 'Investor-grade operating model with scenario planning and KPI dashboards.',
    description:
      'Model revenue levers, hiring plans, and cash runway with analysts experienced in venture diligence. Align on assumptions before your data room opens.',
    outcomes: ['3–5 year operating model with sensitivities', 'Unit economics and cohort analysis', 'Board-ready reporting templates'],
  },
  {
    id: 'legal',
    title: 'Legal & compliance',
    tagline: 'Term sheet, data room, and compliance guardrails handled by specialists.',
    description:
      'Tap into vetted legal partners for term sheet review, ESOP refresh, or regulatory filings so you stay deal-ready while scaling.',
    outcomes: ['Fundraise document review', 'ESOP & shareholder agreement updates', 'Regulatory checklist for your geography'],
  },
  {
    id: 'tech',
    title: 'Tech enhancement support',
    tagline: 'Ship product polish and proof-points investors want to see.',
    description:
      'Our product leads help you scope quick-win improvements, instrument analytics, and produce demos that showcase momentum.',
    outcomes: ['Product gap audit & roadmap sprint', 'Instrumentation of key funnels', 'Investor demo script & capture'],
  },
  {
    id: 'growth',
    title: 'Growth marketing',
    tagline: 'Programs that convert investor demand into customer traction.',
    description:
      'Co-build GTM experiments with operators who have grown SaaS and marketplace companies, focusing on channels, messaging, and growth loops.',
    outcomes: ['Channel prioritisation & experiment plan', 'Messaging & positioning refresh', 'Measurement framework and GTM cadences'],
  },
];

export const createDefaultFounderExtras = () => ({
  marketplaceListing: { ...INITIAL_MARKETPLACE_LISTING },
  successFeeRequest: null,
  serviceRequests: [],
});
