const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const createAdminUser = () => ({
  id: randomUUID(),
  fullName: 'LaunchAndLift Admin',
  email: 'admin@launchandlift.com',
  role: 'admin',
  organization: 'LaunchAndLift',
  notes: null,
  investorDetails: null,
  founderDetails: null,
  adminDetails: { department: 'Operations' },
  passwordHash: bcrypt.hashSync('LaunchAndLiftAdmin!23', 10),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const defaultStats = [
  { label: 'Family offices', value: '190+', caption: 'Deep relationships across 18 countries' },
  { label: 'Average IRR', value: '27%', caption: 'Gross annualized net of fees since 2018' },
  { label: 'Assets under management', value: '$1.4B', caption: 'Across venture, opportunity, and credit vehicles' },
  { label: 'Deals evaluated annually', value: '950+', caption: 'Eight diligence lanes powered by proprietary data' },
];

const defaultTeam = [
  {
    id: randomUUID(),
    name: 'Avery Cole',
    title: 'Managing Partner',
    bio: 'Leading capital strategy and governance for LaunchAndLift vehicles.',
    linkedin: 'https://www.linkedin.com/',
  },
  {
    id: randomUUID(),
    name: 'Riya Deshmukh',
    title: 'Head of Founder Platform',
    bio: 'Architects LaunchAndLift’s operator guild and founder experience.',
    linkedin: 'https://www.linkedin.com/',
  },
  {
    id: randomUUID(),
    name: 'Malik Johnson',
    title: 'Chief Investment Officer',
    bio: 'Oversees diligence, portfolio construction, and risk.',
    linkedin: 'https://www.linkedin.com/',
  },
];

const defaultTestimonials = [
  {
    id: randomUUID(),
    quote:
      'LaunchAndLift is more than capital; the operator guild rebuilt our revenue engine and doubled ARR within nine months.',
    name: 'Maya Chen',
    role: 'Co-founder & CEO, Arcadia Freight',
  },
  {
    id: randomUUID(),
    quote:
      'Mission Control drives conviction quickly. LaunchAndLift’s diligence packs are the benchmark for private market investing.',
    name: 'Aidan Fox',
    role: 'Principal, Foxbridge Family Office',
  },
];

const defaultFaqs = [
  {
    id: randomUUID(),
    audience: 'investor',
    question: 'How does LaunchAndLift source opportunities?',
    answer:
      'Our operator guild and research lab maintain proactive theses across climate, infrastructure, health, and applied AI to source mission-aligned founders.',
  },
  {
    id: randomUUID(),
    audience: 'founder',
    question: 'What support do founders receive post-investment?',
    answer:
      'Founders receive operator embeds across go-to-market, finance, people, and product disciplines, plus Mission Control analytics.',
  },
];

const defaultPortfolio = [
  {
    id: randomUUID(),
    name: 'Arcadia Freight',
    sector: 'Climate Logistics',
    founders: ['Maya Chen', 'Luis Ocampo'],
    milestone: 'Raised $85M Series B to scale zero-emission freight corridors.',
    summary: 'Decarbonizing middle-mile logistics with AI-guided routing and electric fleets.',
    link: 'https://example.com/arcadia',
    status: 'Active',
  },
  {
    id: randomUUID(),
    name: 'Synapse Harbor',
    sector: 'Applied AI',
    founders: ['Neha Kapoor'],
    milestone: 'Signed strategic alliance with three Fortune 100 cloud providers.',
    summary: 'AI co-pilot for maritime commerce digitizing customs clearance and port operations.',
    link: 'https://example.com/synapse',
    status: 'Active',
  },
];

const defaultNews = [
  {
    id: randomUUID(),
    outlet: 'Growth Weekly',
    headline: 'LaunchAndLift unveils $400M opportunity fund for late-stage secondaries',
  },
  {
    id: randomUUID(),
    outlet: 'Private Markets Today',
    headline: 'LaunchAndLift Mission Control adds benchmarking for family offices',
  },
];

const store = {
  users: [createAdminUser()],
  portfolio: defaultPortfolio,
  testimonials: defaultTestimonials,
  faqs: defaultFaqs,
  team: defaultTeam,
  stats: { metrics: defaultStats, lastUpdated: new Date().toISOString() },
  news: defaultNews,
  founderIntakes: [],
  passwordResets: [],
};

module.exports = store;
