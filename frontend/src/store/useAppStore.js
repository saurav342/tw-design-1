import { create } from 'zustand';
import { buildReadinessScores, generateAISummary } from '../lib/fakeAI';
import { defaultBenchmarkRows } from '../mock/benchmarksMock';
import { foundersMock } from '../mock/foundersMock';
import { investorsMock } from '../mock/investorsMock';
import { intakeApi } from '../services/api.js';

const randomId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

const computeReadinessFromMetrics = (metrics) => {
  const overrides = [];

  if (metrics?.growth) {
    const growthValue = parseFloat(metrics.growth.replace(/[^0-9.]/g, ''));
    if (!Number.isNaN(growthValue)) {
      overrides.push({
        id: 'traction',
        score: Math.min(95, Math.max(40, growthValue * 4)),
      });
    }
  }

  return buildReadinessScores(overrides);
};

const composeBenchmarkRows = (metrics) =>
  defaultBenchmarkRows.map((row) => {
    if (!metrics) return row;
    const value = metrics[row.id];
    return value ? { ...row, startupValue: value } : row;
  });

const computeMatchScore = (founder, investor) => {
  let score = 55;

  if (investor.stageFocus.some((stage) => stage === founder.raiseStage)) {
    score += 18;
  }

  if (
    investor.sectorFocus.some((sector) =>
      [founder.sector, ...(founder.subSectors ?? [])].some((tag) =>
        tag.toLowerCase().includes(sector.toLowerCase()),
      ),
    )
  ) {
    score += 17;
  }

  if (
    investor.geoFocus.some((geo) =>
      (founder.geography ?? '').toLowerCase().includes(geo.toLowerCase()),
    )
  ) {
    score += 10;
  }

  return Math.min(100, Math.max(45, score));
};

const generateMatches = (founder, investors) =>
  investors.map((investor) => ({
    investorId: investor.id,
    matchScore: computeMatchScore(founder, investor),
  }));

export const useAppStore = create((set, get) => ({
  founders: foundersMock,
  investors: investorsMock,
  addFounder: async (input) => {
    const id = `founder-${randomId()}`;
    const aiPayload = generateAISummary({
      ...input,
      revenueRunRateUSD: input.revenueRunRateUSD,
    });

    const readiness = computeReadinessFromMetrics(input.metrics);
    const benchmarks = composeBenchmarkRows(input.metrics);
    const newFounder = {
      id,
      fullName: input.fullName,
      email: input.email,
      startupName: input.startupName,
      headline: input.headline,
      sector: input.sector,
      subSectors: input.subSectors ?? [],
      geography: input.geography,
      raiseStage: input.raiseStage,
      raiseAmountUSD: input.raiseAmountUSD,
      tractionSummary: input.tractionSummary,
      teamSize: input.teamSize,
      revenueRunRateUSD: input.revenueRunRateUSD,
      status: 'pending',
      readiness,
      benchmarkNotes: {},
      benchmarks,
      aiSummary: [
        aiPayload.overview,
        aiPayload.highlights[0] ?? '',
        aiPayload.recommendedFocus,
      ].join(' '),
      matches: [],
      createdAt: new Date().toISOString(),
    };

    const investors = get().investors;
    newFounder.matches = generateMatches(newFounder, investors);

    await intakeApi.submitFounder(newFounder);

    set((state) => ({
      founders: [
        newFounder,
        ...state.founders.filter((founder) => founder.id !== newFounder.id),
      ],
    }));

    return newFounder;
  },
  addInvestor: (input) => {
    const id = `investor-${randomId()}`;
    const newInvestor = { id, ...input };

    set((state) => ({
      investors: [newInvestor, ...state.investors],
      founders: state.founders.map((founder) => {
        const exists = founder.matches.some((match) => match.investorId === id);
        if (exists) return founder;
        const updatedMatches = [
          ...founder.matches,
          { investorId: id, matchScore: computeMatchScore(founder, newInvestor) },
        ].sort((a, b) => b.matchScore - a.matchScore);
        return { ...founder, matches: updatedMatches };
      }),
    }));

    return newInvestor;
  },
  syncFoundersFromBackend: async (token) => {
    try {
      const response = await intakeApi.listFounders(token);
      const items = Array.isArray(response?.items) ? response.items : [];

      if (!items.length) {
        return items;
      }

      set((state) => {
        const merged = new Map(state.founders.map((founder) => [founder.id, founder]));
        items.forEach((founder) => {
          const existing = merged.get(founder.id) ?? {};
          merged.set(founder.id, { ...existing, ...founder });
        });
        const nextFounders = Array.from(merged.values()).sort((a, b) => {
          const aTime = new Date(a.createdAt ?? 0).getTime();
          const bTime = new Date(b.createdAt ?? 0).getTime();
          return bTime - aTime;
        });

        return { founders: nextFounders };
      });

      return items;
    } catch (error) {
      console.error('Failed to sync founder intakes', error);
      throw error;
    }
  },
  updateFounderStatus: (founderId, status) => {
    set((state) => ({
      founders: state.founders.map((founder) =>
        founder.id === founderId ? { ...founder, status } : founder,
      ),
    }));
  },
  saveBenchmarkNotes: (founderId, notes) => {
    set((state) => ({
      founders: state.founders.map((founder) =>
        founder.id === founderId
          ? { ...founder, benchmarkNotes: { ...founder.benchmarkNotes, ...notes } }
          : founder,
      ),
    }));
  },
  upsertBenchmarkNote: (founderId, rowId, note) => {
    set((state) => ({
      founders: state.founders.map((founder) =>
        founder.id === founderId
          ? {
              ...founder,
              benchmarkNotes: { ...founder.benchmarkNotes, [rowId]: note },
            }
          : founder,
      ),
    }));
  },
  getFounderById: (founderId) => get().founders.find((founder) => founder.id === founderId),
  getInvestorById: (investorId) => get().investors.find((investor) => investor.id === investorId),
  recordMatchPreference: (founderId, investorId, score) => {
    set((state) => ({
      founders: state.founders.map((founder) => {
        if (founder.id !== founderId) return founder;
        const matches = founder.matches.map((match) =>
          match.investorId === investorId ? { ...match, matchScore: score } : match,
        );
        return { ...founder, matches };
      }),
    }));
  },
}));
