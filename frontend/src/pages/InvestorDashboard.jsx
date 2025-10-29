import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { StartupCard } from '../components/StartupCard.jsx';
import { Card, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { cn } from '../lib/utils.js';
import { showGenericInfo } from '../lib/emailClientMock.js';
import { useAppStore } from '../store/useAppStore.js';

const initialFilters = {
  stage: 'All',
  sector: 'All',
  geo: 'All',
};

const InvestorDashboard = () => {
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const [filters, setFilters] = useState(initialFilters);

  const approvedFounders = founders.filter((founder) => founder.status === 'approved');

  const filterOptions = useMemo(() => {
    const stages = new Set();
    const sectors = new Set();
    const geos = new Set();
    approvedFounders.forEach((founder) => {
      stages.add(founder.raiseStage);
      sectors.add(founder.sector);
      geos.add(founder.geography);
    });
    return {
      stages: Array.from(stages),
      sectors: Array.from(sectors),
      geos: Array.from(geos),
    };
  }, [approvedFounders]);

  const filteredFounders = approvedFounders.filter((founder) => {
    const matchesStage = filters.stage === 'All' || founder.raiseStage === filters.stage;
    const matchesSector = filters.sector === 'All' || founder.sector === filters.sector;
    const matchesGeo = filters.geo === 'All' || founder.geography === filters.geo;
    return matchesStage && matchesSector && matchesGeo;
  });

  const bestMatchScore = (founder) =>
    founder.matches.reduce((highest, match) => {
      const investor = investors.find((item) => item.id === match.investorId);
      if (!investor) return highest;
      return match.matchScore > highest ? match.matchScore : highest;
    }, 0);

  return (
    <div className="grid gap-8 md:grid-cols-[280px_1fr]">
      <Motion.aside
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      >
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <FilterGroup
          label="Stage"
          options={['All', ...filterOptions.stages]}
          value={filters.stage}
          onChange={(value) => setFilters((prev) => ({ ...prev, stage: value }))}
        />
        <FilterGroup
          label="Sector"
          options={['All', ...filterOptions.sectors]}
          value={filters.sector}
          onChange={(value) => setFilters((prev) => ({ ...prev, sector: value }))}
        />
        <FilterGroup
          label="Geography"
          options={['All', ...filterOptions.geos]}
          value={filters.geo}
          onChange={(value) => setFilters((prev) => ({ ...prev, geo: value }))}
        />
      </Motion.aside>

      <Motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Recommended Startups</CardTitle>
            <p className="text-sm text-slate-300">
              Viewing approved founders who align with your thesis parameters.
            </p>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          {filteredFounders.map((founder) => (
            <StartupCard
              key={founder.id}
              founder={founder}
              matchScore={bestMatchScore(founder)}
              onRequestIntro={() =>
                showGenericInfo(`Intro requested for ${founder.startupName} (mock)`)
              }
            />
          ))}

          {filteredFounders.length === 0 ? (
            <Card className="p-10 text-center text-sm text-slate-300">
              No startups match these filters yet. Adjust focus or check again soon.
            </Card>
          ) : null}
        </div>
      </Motion.section>
    </div>
  );
};

const FilterGroup = ({ label, options, value, onChange }) => (
  <div className="space-y-2 text-sm text-slate-200">
    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              'rounded-full border border-white/10 px-3 py-1 text-xs font-semibold transition',
              isActive
                ? 'bg-gradient-to-r from-indigo-500 to-brand text-white shadow-[0_12px_35px_-30px_rgba(124,92,255,0.9)]'
                : 'bg-white/10 text-slate-200 hover:bg-white/15',
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  </div>
);

export default InvestorDashboard;
