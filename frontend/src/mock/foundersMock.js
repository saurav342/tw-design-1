import { buildReadinessScores, generateAISummary } from '../lib/fakeAI';
import { defaultBenchmarkRows } from './benchmarksMock';

const approvedSummary = generateAISummary({
  fullName: 'Amelia Hart',
  startupName: 'OrbitStack',
  sector: 'AI Infrastructure',
  geography: 'North America',
  raiseStage: 'Seed',
  tractionSummary: 'Scaled to $720K ARR with 18% MoM growth',
  revenueRunRateUSD: 720_000,
});

const pendingSummary = generateAISummary({
  fullName: 'Noah Patel',
  startupName: 'FluxGrid',
  sector: 'Climate Tech',
  geography: 'North America',
  raiseStage: 'Pre-Seed',
  tractionSummary: 'Pilots with 4 regional utilities and $120K paid POCs',
  revenueRunRateUSD: 120_000,
});

export const foundersMock = [
  {
    id: 'founder-1',
    fullName: 'Amelia Hart',
    email: 'amelia@orbitstack.io',
    startupName: 'OrbitStack',
    headline: 'AI observability stack for enterprise ML teams',
    sector: 'AI Infrastructure',
    subSectors: ['Developer Tools', 'Model Ops'],
    geography: 'San Francisco, USA',
    raiseStage: 'Seed',
    raiseAmountUSD: 2_500_000,
    tractionSummary: 'Scaled to $720K ARR with Fortune 500 pilots in pipeline.',
    teamSize: 12,
    revenueRunRateUSD: 720_000,
    status: 'approved',
    readiness: buildReadinessScores([
      { id: 'traction', score: 82 },
      { id: 'market', score: 86 },
    ]),
    benchmarkNotes: {
      growth:
        'Growth spiked after shipping self-serve onboarding; projecting 22% MoM with new launch.',
    },
    benchmarks: defaultBenchmarkRows.map((row) => {
      if (row.id === 'mrr') {
        return { ...row, startupValue: '$60K' };
      }
      if (row.id === 'growth') {
        return { ...row, startupValue: '18%' };
      }
      return { ...row };
    }),
    aiSummary: [
      approvedSummary.overview,
      approvedSummary.highlights[0] ?? '',
      approvedSummary.recommendedFocus,
    ].join(' '),
    matches: [
      { investorId: 'investor-1', matchScore: 91 },
      { investorId: 'investor-2', matchScore: 77 },
      { investorId: 'investor-3', matchScore: 83 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'founder-2',
    fullName: 'Noah Patel',
    email: 'noah@fluxgrid.co',
    startupName: 'FluxGrid',
    headline: 'Grid analytics platform for decarbonized distribution networks',
    sector: 'Climate Tech',
    subSectors: ['Energy Analytics', 'Utilities'],
    geography: 'Austin, USA',
    raiseStage: 'Pre-Seed',
    raiseAmountUSD: 1_200_000,
    tractionSummary: 'Utility pilots with $120K ARR equivalent and 6-month payback.',
    teamSize: 6,
    revenueRunRateUSD: 120_000,
    status: 'pending',
    readiness: buildReadinessScores([
      { id: 'traction', score: 64 },
      { id: 'product', score: 76 },
    ]),
    benchmarkNotes: {},
    benchmarks: defaultBenchmarkRows.map((row) => {
      if (row.id === 'growth') {
        return { ...row, startupValue: '9%' };
      }
      if (row.id === 'mrr') {
        return { ...row, startupValue: '$10K' };
      }
      if (row.id === 'cac') {
        return { ...row, startupValue: '$520' };
      }
      return { ...row };
    }),
    aiSummary: [
      pendingSummary.overview,
      pendingSummary.highlights[0] ?? '',
      pendingSummary.recommendedFocus,
    ].join(' '),
    matches: [
      { investorId: 'investor-2', matchScore: 81 },
      { investorId: 'investor-3', matchScore: 68 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
];
