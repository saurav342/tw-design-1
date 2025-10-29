const defaultHighlights = [
  'Strong founding team with complementary expertise.',
  'Clear go-to-market focus on a fast-growing segment.',
  'Healthy early traction relative to stage peers.',
];

export const generateAISummary = (founder = {}) => {
  const founderName = founder.fullName ?? 'the founding team';
  const startupName = founder.startupName ?? 'the startup';
  const sector = founder.sector ?? 'emerging technology';
  const geography = founder.geography ?? 'global markets';
  const stage = founder.raiseStage ?? 'early stage';
  const revenue = founder.revenueRunRateUSD
    ? `$${(founder.revenueRunRateUSD / 1_000_000).toFixed(1)}M ARR`
    : 'promising traction';

  return {
    overview: `${startupName} is an ${stage} company led by ${founderName}, delivering differentiated value within ${sector} and targeting ${geography}. Early signals show ${revenue}, and the team is prepared for disciplined deployment of fresh capital.`,
    highlights: founder.tractionSummary
      ? [
          `Traction: ${founder.tractionSummary}.`,
          ...defaultHighlights.slice(1),
        ]
      : defaultHighlights,
    recommendedFocus:
      'Prioritize investor conversations that value operator excellence and post-seed metrics. Highlight the capital efficiency pathway and near-term growth milestones.',
  };
};

export const buildReadinessScores = (overrides = []) => {
  const base = [
    { id: 'market', label: 'Market Readiness', score: 78 },
    { id: 'product', label: 'Product Maturity', score: 82 },
    { id: 'traction', label: 'Traction Velocity', score: 74 },
    { id: 'team', label: 'Team Strength', score: 88 },
  ];

  if (!overrides.length) {
    return base;
  }

  return base.map((item) => {
    const override = overrides.find((entry) => entry?.id === item.id);
    return override ? { ...item, ...override } : item;
  });
};
