import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Filter, Building2, Heart, Briefcase, DollarSign, X, Search, SlidersHorizontal } from 'lucide-react';
import { StartupCard } from '../components/StartupCard.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs.jsx';
import { Input } from '../components/ui/input.jsx';
import { cn } from '../lib/utils.js';
import { useNotification } from '../context/NotificationContext';
import { useAppStore } from '../store/useAppStore.js';
import { formatCurrency } from '../lib/formatters.js';
import DashboardHeader from '../components/DashboardHeader.jsx';

const initialFilters = {
  stage: 'All',
  sector: 'All',
  geo: 'All',
};

const InvestorDashboard = () => {
  const { showInfo } = useNotification();
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const investorInterests = useAppStore((state) => state.investorInterests);
  const investorPortfolio = useAppStore((state) => state.investorPortfolio);
  const addInvestorInterest = useAppStore((state) => state.addInvestorInterest);
  const [filters, setFilters] = useState(initialFilters);
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    const matchesSearch = searchQuery === '' || 
      founder.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSector && matchesGeo && matchesSearch;
  });

  const interestedFounders = approvedFounders.filter((founder) =>
    investorInterests.includes(founder.id)
  ).filter((founder) => {
    const matchesStage = filters.stage === 'All' || founder.raiseStage === filters.stage;
    const matchesSector = filters.sector === 'All' || founder.sector === filters.sector;
    const matchesGeo = filters.geo === 'All' || founder.geography === filters.geo;
    const matchesSearch = searchQuery === '' || 
      founder.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSector && matchesGeo && matchesSearch;
  });

  const portfolioFounders = approvedFounders.filter((founder) =>
    investorPortfolio.some((inv) => inv.founderId === founder.id)
  ).filter((founder) => {
    const matchesStage = filters.stage === 'All' || founder.raiseStage === filters.stage;
    const matchesSector = filters.sector === 'All' || founder.sector === filters.sector;
    const matchesGeo = filters.geo === 'All' || founder.geography === filters.geo;
    const matchesSearch = searchQuery === '' || 
      founder.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSector && matchesGeo && matchesSearch;
  });

  const bestMatchScore = (founder) =>
    founder.matches.reduce((highest, match) => {
      const investor = investors.find((item) => item.id === match.investorId);
      if (!investor) return highest;
      return match.matchScore > highest ? match.matchScore : highest;
    }, 0);

  const handleRequestIntro = (founder) => {
    addInvestorInterest(founder.id);
    showInfo(`Intro requested for ${founder.startupName}. Added to your interested list.`);
  };

  const totalInvestment = portfolioFounders.reduce((sum, founder) => {
    const investment = investorPortfolio.find((inv) => inv.founderId === founder.id);
    return sum + (investment?.amountInvested || 0);
  }, 0);

  const avgInvestment = portfolioFounders.length > 0 
    ? totalInvestment / portfolioFounders.length 
    : 0;

  const stats = [
    {
      label: 'All Startups',
      value: approvedFounders.length,
      icon: Building2,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Interested',
      value: interestedFounders.length,
      icon: Heart,
      gradient: 'from-pink-500 via-rose-500 to-fuchsia-500',
      bgGradient: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
      iconBg: 'bg-pink-100',
    },
    {
      label: 'Portfolio',
      value: portfolioFounders.length,
      icon: Briefcase,
      gradient: 'from-purple-500 via-indigo-500 to-violet-500',
      bgGradient: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      iconBg: 'bg-purple-100',
    },
    {
      label: 'Total Invested',
      value: formatCurrency(totalInvestment),
      icon: DollarSign,
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
    },
  ];

  const currentFounders = activeTab === 'all' 
    ? filteredFounders 
    : activeTab === 'interested' 
      ? interestedFounders 
      : portfolioFounders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Dashboard Header */}
      <DashboardHeader role="investor" />
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-100/40 to-rose-100/40 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1600px] space-y-8 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Investor Dashboard
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Discover, track, and manage your investment opportunities
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={cn(
                    'relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:shadow-lg',
                    stat.bgGradient,
                    stat.borderColor
                  )}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className={cn('text-3xl font-bold', stat.textColor)}>{stat.value}</p>
                    </div>
                    <div className={cn('rounded-xl p-3', stat.iconBg)}>
                      <Icon className={cn('h-6 w-6', stat.textColor)} />
                    </div>
                  </div>
                  <div className={cn(
                    'absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl',
                    stat.gradient
                  )} />
                </Motion.div>
              );
            })}
          </div>
        </Motion.div>

        {/* Search and Filters Bar */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search startups, sectors, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 border-gray-200 bg-white shadow-sm focus:border-blue-400 focus:ring-blue-400"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="font-semibold">Filters</span>
            {sidebarOpen && <X className="h-5 w-5" />}
          </button>
        </Motion.div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Filters Sidebar */}
          <Motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "space-y-6 rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm",
              "lg:block lg:sticky lg:top-8 lg:h-fit",
              sidebarOpen ? "block" : "hidden"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
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

            {/* Clear Filters */}
            {(filters.stage !== 'All' || filters.sector !== 'All' || filters.geo !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setFilters(initialFilters);
                  setSearchQuery('');
                }}
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            )}
          </Motion.aside>

          {/* Main Content Area with Tabs */}
          <Motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-xl border-2 border-gray-200 bg-white p-1.5 shadow-sm">
                <TabsTrigger
                  value="all"
                  className="gap-2 rounded-lg text-gray-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">All Startups</span>
                  <span className="sm:hidden">All</span>
                  <span className="ml-1.5 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                    {filteredFounders.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="interested"
                  className="gap-2 rounded-lg text-gray-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Interested</span>
                  <span className="sm:hidden">Saved</span>
                  <span className="ml-1.5 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                    {interestedFounders.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="gap-2 rounded-lg text-gray-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Portfolio</span>
                  <span className="sm:hidden">Mine</span>
                  <span className="ml-1.5 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                    {portfolioFounders.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* All Startups Tab */}
              <TabsContent value="all" className="mt-6 space-y-6 border-0 bg-transparent p-0 shadow-none">
                <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Discover approved startups that align with your investment thesis
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredFounders.length > 0 ? (
                    filteredFounders.map((founder, index) => (
                      <Motion.div
                        key={founder.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <StartupCard
                          founder={founder}
                          matchScore={bestMatchScore(founder)}
                          onRequestIntro={() => handleRequestIntro(founder)}
                          isInterested={investorInterests.includes(founder.id)}
                          isInPortfolio={investorPortfolio.some((inv) => inv.founderId === founder.id)}
                        />
                      </Motion.div>
                    ))
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Building2 className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-900 mb-2">No startups found</p>
                      <p className="text-sm text-gray-600 mb-4">
                        {searchQuery || filters.stage !== 'All' || filters.sector !== 'All' || filters.geo !== 'All'
                          ? "Try adjusting your filters or search query to see more opportunities."
                          : "No startups available at the moment. Check back later!"}
                      </p>
                      {(searchQuery || filters.stage !== 'All' || filters.sector !== 'All' || filters.geo !== 'All') && (
                        <button
                          onClick={() => {
                            setFilters(initialFilters);
                            setSearchQuery('');
                          }}
                          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Interested Tab */}
              <TabsContent value="interested" className="mt-6 space-y-6 border-0 bg-transparent p-0 shadow-none">
                <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-pink-100 p-2">
                      <Heart className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Interested Startups</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Startups you've expressed interest in and requested introductions for
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {interestedFounders.length > 0 ? (
                    interestedFounders.map((founder, index) => (
                      <Motion.div
                        key={founder.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <StartupCard
                          founder={founder}
                          matchScore={bestMatchScore(founder)}
                          onRequestIntro={() => handleRequestIntro(founder)}
                          isInterested={true}
                          isInPortfolio={investorPortfolio.some((inv) => inv.founderId === founder.id)}
                        />
                      </Motion.div>
                    ))
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Heart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-900 mb-2">No interested startups yet</p>
                      <p className="text-sm text-gray-600 mb-4">
                        Browse the marketplace and request introductions to save startups here.
                      </p>
                      <button
                        onClick={() => setActiveTab('all')}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Browse Marketplace
                      </button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="mt-6 space-y-6 border-0 bg-transparent p-0 shadow-none">
                <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Your Portfolio</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Startups you've invested in through <span className="font-semibold text-[#8b5cf6]">Launch & Lift</span>
                      </p>
                    </div>
                  </div>
                  
                  {portfolioFounders.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-3 mt-6">
                      <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 transition hover:shadow-md">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">Total Invested</p>
                        <p className="text-2xl font-bold text-emerald-900">
                          {formatCurrency(totalInvestment)}
                        </p>
                      </div>
                      <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4 transition hover:shadow-md">
                        <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 mb-1">Portfolio Companies</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {portfolioFounders.length}
                        </p>
                      </div>
                      <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 transition hover:shadow-md">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-1">Avg. Investment</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatCurrency(avgInvestment)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {portfolioFounders.length > 0 ? (
                    portfolioFounders.map((founder, index) => {
                      const investment = investorPortfolio.find((inv) => inv.founderId === founder.id);
                      return (
                        <Motion.div
                          key={founder.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <StartupCard
                            founder={founder}
                            matchScore={bestMatchScore(founder)}
                            onRequestIntro={() => handleRequestIntro(founder)}
                            isInterested={investorInterests.includes(founder.id)}
                            isInPortfolio={true}
                            investmentAmount={investment?.amountInvested}
                            investmentDate={investment?.investedAt}
                          />
                        </Motion.div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-900 mb-2">No investments yet</p>
                      <p className="text-sm text-gray-600 mb-4">
                        Your portfolio investments will appear here once completed.
                      </p>
                      <button
                        onClick={() => setActiveTab('all')}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Explore Startups
                      </button>
                    </div>
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
  <div className="space-y-3">
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30 scale-105'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 hover:scale-105',
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
