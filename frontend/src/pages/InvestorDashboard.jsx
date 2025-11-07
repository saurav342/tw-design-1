import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Filter, Building2, Heart, Briefcase, TrendingUp, DollarSign } from 'lucide-react';
import { StartupCard } from '../components/StartupCard.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs.jsx';
import { cn } from '../lib/utils.js';
import { showGenericInfo } from '../lib/emailClientMock.js';
import { useAppStore } from '../store/useAppStore.js';
import { formatCurrency } from '../lib/formatters.js';

const initialFilters = {
  stage: 'All',
  sector: 'All',
  geo: 'All',
};

const InvestorDashboard = () => {
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const investorInterests = useAppStore((state) => state.investorInterests);
  const investorPortfolio = useAppStore((state) => state.investorPortfolio);
  const addInvestorInterest = useAppStore((state) => state.addInvestorInterest);
  const [filters, setFilters] = useState(initialFilters);
  const [activeTab, setActiveTab] = useState('all');

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

  const interestedFounders = approvedFounders.filter((founder) =>
    investorInterests.includes(founder.id)
  );

  const portfolioFounders = approvedFounders.filter((founder) =>
    investorPortfolio.some((inv) => inv.founderId === founder.id)
  );

  const bestMatchScore = (founder) =>
    founder.matches.reduce((highest, match) => {
      const investor = investors.find((item) => item.id === match.investorId);
      if (!investor) return highest;
      return match.matchScore > highest ? match.matchScore : highest;
    }, 0);

  const handleRequestIntro = (founder) => {
    addInvestorInterest(founder.id);
    showGenericInfo(`Intro requested for ${founder.startupName}. Added to your interested list.`);
  };

  const totalInvestment = portfolioFounders.reduce((sum, founder) => {
    const investment = investorPortfolio.find((inv) => inv.founderId === founder.id);
    return sum + (investment?.amountInvested || 0);
  }, 0);

  const stats = [
    {
      label: 'All Startups',
      value: approvedFounders.length,
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Interested',
      value: interestedFounders.length,
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
    },
    {
      label: 'Portfolio',
      value: portfolioFounders.length,
      icon: Briefcase,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      label: 'Total Invested',
      value: formatCurrency(totalInvestment),
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-8">
      <div className="mx-auto max-w-[1400px] space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header Stats */}
        <Motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-white/20 bg-white/10 backdrop-blur-xl transition hover:scale-105 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br',
                    stat.color
                  )}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </Motion.div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <Motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
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

        {/* Main Content Area with Tabs */}
        <Motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-white/30 bg-white/10 p-1.5 backdrop-blur-xl">
              <TabsTrigger
                value="all"
                className="gap-2 rounded-xl text-slate-300 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50"
              >
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">All Startups</span>
                <span className="sm:hidden">All</span>
                <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {filteredFounders.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="interested"
                className="gap-2 rounded-xl text-slate-300 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/50"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Interested</span>
                <span className="sm:hidden">Saved</span>
                <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {interestedFounders.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="gap-2 rounded-xl text-slate-300 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/50"
              >
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Portfolio</span>
                <span className="sm:hidden">Mine</span>
                <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {portfolioFounders.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* All Startups Tab */}
            <TabsContent value="all" className="mt-6 space-y-6 border-0 bg-transparent p-0 shadow-none">
              <Card className="border-white/20 bg-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    <Building2 className="h-6 w-6" />
                    Marketplace
                  </CardTitle>
                  <p className="text-sm text-slate-300">
                    Discover approved startups that align with your investment thesis.
                  </p>
                </CardHeader>
              </Card>

              <div className="grid gap-6">
                {filteredFounders.map((founder) => (
                  <StartupCard
                    key={founder.id}
                    founder={founder}
                    matchScore={bestMatchScore(founder)}
                    onRequestIntro={() => handleRequestIntro(founder)}
                    isInterested={investorInterests.includes(founder.id)}
                    isInPortfolio={investorPortfolio.some((inv) => inv.founderId === founder.id)}
                  />
                ))}

                {filteredFounders.length === 0 && (
                  <Card className="border-white/20 bg-white/10 p-10 text-center backdrop-blur-xl">
                    <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                    <p className="text-lg font-medium text-white">No startups found</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Adjust your filters to see more opportunities.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Interested Tab */}
            <TabsContent value="interested" className="mt-6 space-y-6 border-0 bg-transparent p-0 shadow-none">
              <Card className="border-white/20 bg-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    <Heart className="h-6 w-6" />
                    Interested Startups
                  </CardTitle>
                  <p className="text-sm text-slate-300">
                    Startups you've expressed interest in and requested introductions for.
                  </p>
                </CardHeader>
              </Card>

              <div className="grid gap-6">
                {interestedFounders.map((founder) => (
                  <StartupCard
                    key={founder.id}
                    founder={founder}
                    matchScore={bestMatchScore(founder)}
                    onRequestIntro={() => handleRequestIntro(founder)}
                    isInterested={true}
                    isInPortfolio={investorPortfolio.some((inv) => inv.founderId === founder.id)}
                  />
                ))}

                {interestedFounders.length === 0 && (
                  <Card className="border-white/20 bg-white/10 p-10 text-center backdrop-blur-xl">
                    <Heart className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                    <p className="text-lg font-medium text-white">No interested startups yet</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Browse the marketplace and request intros to save startups here.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="mt-6 space-y-6 border-0 bg-transparent p-0 shadow-none">
              <Card className="border-white/20 bg-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    <Briefcase className="h-6 w-6" />
                    Your Portfolio
                  </CardTitle>
                  <p className="text-sm text-slate-300">
                    Startups you've invested in through Launch&Lift.
                  </p>
                </CardHeader>
                {portfolioFounders.length > 0 && (
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl transition hover:scale-105 hover:border-white/30 hover:shadow-xl">
                        <p className="text-sm text-slate-400">Total Invested</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                          {formatCurrency(totalInvestment)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl transition hover:scale-105 hover:border-white/30 hover:shadow-xl">
                        <p className="text-sm text-slate-400">Portfolio Companies</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                          {portfolioFounders.length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl transition hover:scale-105 hover:border-white/30 hover:shadow-xl">
                        <p className="text-sm text-slate-400">Avg. Investment</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                          {formatCurrency(
                            portfolioFounders.length > 0
                              ? totalInvestment / portfolioFounders.length
                              : 0
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              <div className="grid gap-6">
                {portfolioFounders.map((founder) => {
                  const investment = investorPortfolio.find((inv) => inv.founderId === founder.id);
                  return (
                    <StartupCard
                      key={founder.id}
                      founder={founder}
                      matchScore={bestMatchScore(founder)}
                      onRequestIntro={() => handleRequestIntro(founder)}
                      isInterested={investorInterests.includes(founder.id)}
                      isInPortfolio={true}
                      investmentAmount={investment?.amountInvested}
                      investmentDate={investment?.investedAt}
                    />
                  );
                })}

                {portfolioFounders.length === 0 && (
                  <Card className="border-white/20 bg-white/10 p-10 text-center backdrop-blur-xl">
                    <Briefcase className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                    <p className="text-lg font-medium text-white">No investments yet</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Your portfolio investments will appear here once completed.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Motion.section>
      </div>
    </div>
    </div>
  );
};

const FilterGroup = ({ label, options, value, onChange }) => (
  <div className="space-y-2 text-sm text-slate-200">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
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
                ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg shadow-indigo-500/50'
                : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:scale-105',
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
