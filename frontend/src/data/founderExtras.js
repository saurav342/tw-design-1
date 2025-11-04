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

export const FOUNDER_SERVICE_STORIES = {
  'pitch-deck': {
    hero: {
      eyebrow: 'Pitch deck preparation',
      headline: 'Design a deck that moves investors from curiosity to conviction',
      subcopy:
        'Build a narrative spine, data-led proof points, and audiovisual polish packaged for busy ICs and partners. We pair storytelling method with motion-rich visuals that feel unmistakably founder-led.',
    },
    stats: [
      { label: 'Second meetings booked', value: '92%' },
      { label: 'Average deck turnaround', value: '12 days' },
      { label: 'Slides iterated with investors', value: '18+' },
    ],
    highlights: [
      {
        title: 'Story architecture lab',
        description:
          'Map the act-by-act proposal, layer competitive tension, and choreograph data reveals so the flow lands with clarity.',
      },
      {
        title: 'Design system remix',
        description:
          'Translate your brand kit into motion-ready templates, iconography, and gradient accents built for retina screens and print.',
      },
      {
        title: 'Investor rehearsal loops',
        description:
          'Dry runs with ex-founders focused on timing, objection handling, and delivery energy tied to your meeting calendar.',
      },
    ],
    process: [
      { step: '01', title: 'Narrative discovery', copy: 'Audit metrics, audience, and ambition to anchor the storyline.' },
      { step: '02', title: 'Slide choreography', copy: 'Draft hero visuals, proof slides, and appendix depth in Figma + Pitch.' },
      { step: '03', title: 'Delivery polish', copy: 'Layer animations, scripts, and q&a notes aligned with partner sessions.' },
    ],
    cta: {
      label: 'Start your deck sprint',
      to: '/signup',
      support: 'Looking for investor templates? Download our readiness kit.',
      supportTo: '/resources',
    },
  },
  mentorship: {
    hero: {
      eyebrow: 'Mentorship / advisory',
      headline: 'Bring boardroom-grade operators into your weekly rhythm',
      subcopy:
        'Plug into a bench of founders, fund partners, and functional experts who ship tangible inputs: cap table strategy, hiring playbooks, revenue loops, and more.',
    },
    stats: [
      { label: 'Operator bench', value: '48 advisors' },
      { label: 'Average engagement', value: '16 weeks' },
      { label: 'Founder satisfaction', value: '4.9 / 5' },
    ],
    highlights: [
      {
        title: 'Sector-matched pods',
        description:
          'Curate mentors across GTM, product, finance, and leadership who know your market pace and investor expectations.',
      },
      {
        title: 'Decision room support',
        description:
          'Mock ICs and board readiness sessions that pressure-test assumptions before you step into a live negotiation.',
      },
      {
        title: 'Warm networks unlocked',
        description:
          'High-signal intros to angels, talent, and ecosystem allies mapped to your sprint KPIs.',
      },
    ],
    process: [
      { step: '01', title: 'Diagnostic sync', copy: 'Benchmark team, capital needs, and operator gaps with our advisory lead.' },
      { step: '02', title: 'Pod activation', copy: 'Spin up a two-to-three mentor pod with cadences and impact scoreboard.' },
      { step: '03', title: 'Momentum loops', copy: 'Ship decisions, track outcomes, and recalibrate the pod every fortnight.' },
    ],
    cta: {
      label: 'Meet your advisory pod',
      to: '/signup',
      support: 'Want the mentor index first? Explore our investor resources.',
      supportTo: '/resources',
    },
  },
  financials: {
    hero: {
      eyebrow: 'Financial projections',
      headline: 'Engineer a model that survives diligence and tells your growth story',
      subcopy:
        'Design top-down and bottom-up views, unit economics, and sensitivity dashboards that give investors the confidence to wire faster.',
    },
    stats: [
      { label: 'Models delivered', value: '175+' },
      { label: 'Scenario branches', value: '6 per model' },
      { label: 'Cash runway clarity', value: '36 month view' },
    ],
    highlights: [
      {
        title: 'Cohort analytics',
        description:
          'Decode retention, sales velocity, and CAC by channel to ground your narrative in traction proof.',
      },
      {
        title: 'Scenario playground',
        description:
          'Stress-test headcount, revenue levers, and capital deployment with modular assumptions investors can tweak live.',
      },
      {
        title: 'Reporting automation',
        description:
          'Set up board-ready dashboards and monthly investor updates using Notion, GSheets, or Equals.',
      },
    ],
    process: [
      { step: '01', title: 'Metric deep-dive', copy: 'Collect current dashboards, revenue data, and market benchmarks.' },
      { step: '02', title: 'Model build', copy: 'Draft integrated P&L, cash flow, and balance sheet with driver logic.' },
      { step: '03', title: 'Investor review', copy: 'Walk-through with your deal team + share due diligence ready exports.' },
    ],
    cta: {
      label: 'Book a modelling jam',
      to: '/signup',
      support: 'Need a lighter template? Grab the finance starter kit.',
      supportTo: '/resources',
    },
  },
  legal: {
    hero: {
      eyebrow: 'Legal & compliance',
      headline: 'Close your round with paperwork and protections handled proactively',
      subcopy:
        'Streamline diligence, refresh ESOPs, and secure cross-border compliance. We orchestrate specialist partners while keeping you focused on momentum.',
    },
    stats: [
      { label: 'Term sheets reviewed', value: '210+' },
      { label: 'Compliance playbooks', value: '10 geographies' },
      { label: 'Average turnaround', value: '72 hours' },
    ],
    highlights: [
      {
        title: 'Deal room audit',
        description:
          'Checklist-driven pass through your cap table, contracts, and statutory filings to flag blockers early.',
      },
      {
        title: 'Cross-border clarity',
        description:
          'Guidance on FEMA, ODI, and SAFE structures so global capital enters without friction.',
      },
      {
        title: 'Founder-friendly guardrails',
        description:
          'Templates and negotiation scripts to protect governance, ESOP pools, and liquidation preferences.',
      },
    ],
    process: [
      { step: '01', title: 'Compliance triage', copy: 'Map current docs, gaps, and regulatory obligations by geography.' },
      { step: '02', title: 'Specialist sprint', copy: 'Engage vetted legal partners with our team riding shotgun.' },
      { step: '03', title: 'Close with confidence', copy: 'Finalize docs, board resolutions, and investor communications.' },
    ],
    cta: {
      label: 'Secure your legal pod',
      to: '/signup',
      support: 'Prefer to self-serve? Access our legal checklist repo.',
      supportTo: '/resources',
    },
  },
  tech: {
    hero: {
      eyebrow: 'Tech enhancement support',
      headline: 'Ship crisp product proof-points before your investor demo day',
      subcopy:
        'Prioritize design debt, instrumentation, and demo storytelling so investors see momentum in every click.',
    },
    stats: [
      { label: 'Feature sprints completed', value: '120' },
      { label: 'Demo conversion lift', value: '+34%' },
      { label: 'Average sprint length', value: '3 weeks' },
    ],
    highlights: [
      {
        title: 'Experience audit',
        description:
          'Tear down onboarding, core loops, and performance to identify friction that dims your story.',
      },
      {
        title: 'Signal instrumentation',
        description:
          'Instrument analytics, session heat maps, and funnels that translate adoption into investor-friendly charts.',
      },
      {
        title: 'Demo theatre',
        description:
          'Craft narrative demos with motion design, voiceover scripts, and recorded assets ready for investor follow-ups.',
      },
    ],
    process: [
      { step: '01', title: 'Product triage', copy: 'Review UX, tech roadmap, and investor expectations for proof points.' },
      { step: '02', title: 'Lightning build', copy: 'Co-build features, polish UI, and wire up analytics with your team.' },
      { step: '03', title: 'Showtime ready', copy: 'Ship demo assets, walkthrough scripts, and metrics dashboards.' },
    ],
    cta: {
      label: 'Plan your polish sprint',
      to: '/signup',
      support: 'Need a tech partner? Explore the founder marketplace.',
      supportTo: '/dashboard/founder/marketplace',
    },
  },
  growth: {
    hero: {
      eyebrow: 'Growth marketing',
      headline: 'Design GTM experiments that translate investor demand into real traction',
      subcopy:
        'Launch precision GTM plays with operators who have scaled SaaS, climate, and consumer brands across India and beyond.',
    },
    stats: [
      { label: 'Experiments launched', value: '260+' },
      { label: 'Lift in qualified pipeline', value: '+41%' },
      { label: 'Channels orchestrated', value: '6 avg.' },
    ],
    highlights: [
      {
        title: 'Signal-led prioritisation',
        description:
          'Readiness scoring scores channels by velocity, resourcing, and investor relevance, so you spend where it counts.',
      },
      {
        title: 'Creative ops pod',
        description:
          'Collaborate with copy, design, and performance operators to ship campaigns that feel on-brand and high-tempo.',
      },
      {
        title: 'Revenue instrumentation',
        description:
          'Connected attribution stack with dashboards that sync to investor updates and board reviews.',
      },
    ],
    process: [
      { step: '01', title: 'GTM blueprint', copy: 'Clarify ICP, narrative, and traction targets for the next quarter.' },
      { step: '02', title: 'Experiment runway', copy: 'Design weekly experiment cycles across paid, product, and community.' },
      { step: '03', title: 'Traction broadcast', copy: 'Report weekly with rep-ready dashboards and investor-ready snapshots.' },
    ],
    cta: {
      label: 'Spin up your GTM pod',
      to: '/signup',
      support: 'Curious about success stories? Explore our portfolio highlights.',
      supportTo: '/portfolio',
    },
  },
};
