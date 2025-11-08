import { create } from 'zustand';
import { createDefaultFounderExtras } from '../data/founderExtras.js';
import { founderExtrasApi, intakeApi } from '../services/api.js';

const randomId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

const computeReadinessFromMetrics = (metrics) => {
  // Default readiness scores - will be replaced by backend data
  const base = [
    { id: 'market', label: 'Market Readiness', score: 78 },
    { id: 'product', label: 'Product Maturity', score: 82 },
    { id: 'traction', label: 'Traction Velocity', score: 74 },
    { id: 'team', label: 'Team Strength', score: 88 },
  ];

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

  if (!overrides.length) {
    return base;
  }

  return base.map((item) => {
    const override = overrides.find((entry) => entry?.id === item.id);
    return override ? { ...item, ...override } : item;
  });
};

const composeBenchmarkRows = (metrics) => {
  // Default benchmark structure - will be replaced by backend data
  const defaultRows = [
    { id: 'growth', metric: 'MoM Growth', industryStandard: '12%', startupValue: '12%' },
    { id: 'mrr', metric: 'Monthly Recurring Revenue', industryStandard: '$45K', startupValue: '$45K' },
    { id: 'cac', metric: 'Customer Acquisition Cost', industryStandard: '$880', startupValue: '$880' },
    { id: 'ltv', metric: 'Customer Lifetime Value', industryStandard: '$6.3K', startupValue: '$6.3K' },
    { id: 'payback', metric: 'Payback Period', industryStandard: '14 months', startupValue: '14 months' },
  ];

  if (!metrics) return defaultRows;
  
  return defaultRows.map((row) => {
    const value = metrics[row.id];
    return value ? { ...row, startupValue: value } : row;
  });
};

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


const normalizeExtrasPayload = (payload) => ({
  marketplaceListing: payload?.marketplaceListing ? { ...payload.marketplaceListing } : null,
  successFeeRequest: payload?.successFeeRequest ? { ...payload.successFeeRequest } : null,
  serviceRequests: Array.isArray(payload?.serviceRequests)
    ? payload.serviceRequests.map((item) => ({ ...item }))
    : [],
});

export const useAppStore = create((set, get) => ({
  founders: [],
  investors: [],
  founderExtras: {},
  investorInterests: [],
  investorPortfolio: [],
  addFounder: async (input) => {
    const id = `founder-${randomId()}`;

    const readiness = computeReadinessFromMetrics(input.metrics);
    const benchmarks = composeBenchmarkRows(input.metrics);
    const normalizedCompany = {
      legalName: input.company?.legalName ?? input.companyLegalName ?? '',
      brandName:
        input.company?.brandName ?? input.brandName ?? input.startupName ?? input.companyLegalName ?? '',
      website: input.company?.website ?? input.companyWebsite ?? '',
      foundingDate: input.company?.foundingDate ?? input.companyFoundingDate ?? '',
      sector: input.company?.sector ?? input.sector ?? '',
      currentStage:
        input.company?.currentStage ??
        input.currentStage ??
        input.raiseStage ??
        (Array.isArray(input.stagePreferences) ? input.stagePreferences[0] : ''),
      brief: input.company?.brief ?? input.brief ?? input.tractionSummary ?? '',
      pitchDeckUrl: input.company?.pitchDeckUrl ?? input.pitchDeck ?? input.pitchDeckUrl ?? '',
    };

    const secondFounder =
      input.secondFounder && Object.values(input.secondFounder).some((value) => !!value)
        ? { ...input.secondFounder }
        : null;

    const fallbackHeadline =
      input.headline ||
      (normalizedCompany.brief ? normalizedCompany.brief.slice(0, 140) : '') ||
      `Building ${normalizedCompany.brandName || normalizedCompany.legalName || 'with Launch&Lift'}`;

    const newFounder = {
      id,
      fullName: input.fullName,
      email: input.email,
      phoneNumber: input.phoneNumber ?? '',
      linkedInUrl: input.linkedInUrl ?? '',
      numberOfFounders: input.numberOfFounders ?? input.teamSize ?? 1,
      secondFounder,
      startupName: input.startupName,
      headline: fallbackHeadline,
      sector: input.sector,
      subSectors: input.subSectors ?? [],
      geography: input.geography,
      raiseStage: input.raiseStage,
      raiseAmountUSD: input.raiseAmountUSD,
      tractionSummary: input.tractionSummary,
      teamSize: input.teamSize,
      revenueRunRateUSD: input.revenueRunRateUSD,
      company: normalizedCompany,
      companyLegalName: normalizedCompany.legalName,
      brandName: normalizedCompany.brandName,
      companyWebsite: normalizedCompany.website,
      foundedOn: normalizedCompany.foundingDate,
      pitchDeckUrl: normalizedCompany.pitchDeckUrl,
      submittedFrom: input.submittedFrom ?? 'founder-signup-v2',
      status: 'pending',
      readiness: readiness || [],
      benchmarkNotes: {},
      benchmarks: benchmarks || [],
      aiSummary: input.aiSummary || '',
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
      founderExtras: {
        ...state.founderExtras,
        [id]: normalizeExtrasPayload(state.founderExtras[id] ?? createDefaultFounderExtras()),
      },
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

        const nextExtras = { ...state.founderExtras };
        nextFounders.forEach((founder) => {
          if (!nextExtras[founder.id]) {
            nextExtras[founder.id] = normalizeExtrasPayload(createDefaultFounderExtras());
          }
        });

        return { founders: nextFounders, founderExtras: nextExtras };
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
  fetchFounderExtras: async (founderId, token) => {
    if (!founderId) return null;

    if (!token) {
      set((state) => {
        if (state.founderExtras[founderId]) return {};
        return {
          founderExtras: {
            ...state.founderExtras,
            [founderId]: normalizeExtrasPayload(createDefaultFounderExtras()),
          },
        };
      });
      return get().founderExtras[founderId] ?? normalizeExtrasPayload(createDefaultFounderExtras());
    }

    const response = await founderExtrasApi.getByFounder(founderId, token);
    const extras = normalizeExtrasPayload(response?.extras);
    set((state) => ({
      founderExtras: {
        ...state.founderExtras,
        [founderId]: extras,
      },
    }));
    return extras;
  },
  syncFounderExtrasFromBackend: async (token) => {
    if (!token) return [];
    const response = await founderExtrasApi.listAll(token);
    const items = Array.isArray(response?.items) ? response.items : [];

    set((state) => {
      const next = { ...state.founderExtras };
      items.forEach((entry) => {
        if (!entry || !entry.founderId) return;
        next[entry.founderId] = normalizeExtrasPayload(entry.extras);
      });
      return { founderExtras: next };
    });

    return items;
  },
  upsertFounderMarketplace: async (founderId, listing, token) => {
    if (!founderId) return null;

    if (!token) {
      set((state) => {
        const current = state.founderExtras[founderId] ?? createDefaultFounderExtras();
        const next = normalizeExtrasPayload({
          ...current,
          marketplaceListing: listing ? { ...listing } : null,
        });
        return {
          founderExtras: {
            ...state.founderExtras,
            [founderId]: next,
          },
        };
      });
      return get().founderExtras[founderId] ?? null;
    }

    const response = await founderExtrasApi.saveMarketplace(founderId, listing, token);
    const extras = normalizeExtrasPayload(response?.extras);
    set((state) => ({
      founderExtras: {
        ...state.founderExtras,
        [founderId]: extras,
      },
    }));
    return extras;
  },
  recordFounderSuccessFee: async (founderId, request, token) => {
    if (!founderId) return null;

    if (!token) {
      set((state) => {
        const current = state.founderExtras[founderId] ?? createDefaultFounderExtras();
        const next = normalizeExtrasPayload({
          ...current,
          successFeeRequest: request ? { ...request } : null,
        });
        return {
          founderExtras: {
            ...state.founderExtras,
            [founderId]: next,
          },
        };
      });
      return get().founderExtras[founderId] ?? null;
    }

    const response = await founderExtrasApi.saveSuccessFee(founderId, request, token);
    const extras = normalizeExtrasPayload(response?.extras);
    set((state) => ({
      founderExtras: {
        ...state.founderExtras,
        [founderId]: extras,
      },
    }));
    return extras;
  },
  addFounderServiceRequest: async (founderId, request, token) => {
    if (!founderId || !request) return null;

    if (!token) {
      set((state) => {
        const current = state.founderExtras[founderId] ?? createDefaultFounderExtras();
        const queue = Array.isArray(current.serviceRequests)
          ? current.serviceRequests.map((item) => ({ ...item }))
          : [];
        queue.push({ ...request });
        const next = normalizeExtrasPayload({
          ...current,
          serviceRequests: queue,
        });
        return {
          founderExtras: {
            ...state.founderExtras,
            [founderId]: next,
          },
        };
      });
      return get().founderExtras[founderId] ?? null;
    }

    const response = await founderExtrasApi.createServiceRequest(founderId, request, token);
    const extras = normalizeExtrasPayload(response?.extras);
    set((state) => ({
      founderExtras: {
        ...state.founderExtras,
        [founderId]: extras,
      },
    }));
    return extras;
  },
  clearFounderExtras: (founderId) => {
    if (!founderId) return;
    set((state) => {
      const next = { ...state.founderExtras };
      delete next[founderId];
      return { founderExtras: next };
    });
  },
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
  addInvestorInterest: (founderId) => {
    set((state) => {
      if (state.investorInterests.includes(founderId)) {
        return {};
      }
      return {
        investorInterests: [...state.investorInterests, founderId],
      };
    });
  },
  removeInvestorInterest: (founderId) => {
    set((state) => ({
      investorInterests: state.investorInterests.filter((id) => id !== founderId),
    }));
  },
  addToPortfolio: (founderId, amountInvested) => {
    set((state) => {
      const exists = state.investorPortfolio.some((inv) => inv.founderId === founderId);
      if (exists) return {};
      
      return {
        investorPortfolio: [
          ...state.investorPortfolio,
          {
            founderId,
            amountInvested,
            investedAt: new Date().toISOString(),
          },
        ],
      };
    });
  },
}));
