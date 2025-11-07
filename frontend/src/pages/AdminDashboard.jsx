import { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  ClipboardList,
  DollarSign,
  Download,
  Eye,
  Filter,
  LineChart,
  MailPlus,
  MoreVertical,
  PieChart,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { BenchmarkTable } from '../components/BenchmarkTable.jsx';
import { MatchScoreBadge } from '../components/MatchScoreBadge.jsx';
import { sendIntroEmailMock, showGenericSuccess } from '../lib/emailClientMock.js';
import { formatCurrency, formatCurrencyInr, formatDateDisplay } from '../lib/formatters.js';
import { useAppStore } from '../store/useAppStore.js';
import { useAuth } from '../context/useAuth.js';
import { createDefaultFounderExtras } from '../data/founderExtras.js';
import { adminApi } from '../services/api.js';

const AdminDashboard = () => {
  const { token } = useAuth();
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const updateFounderStatus = useAppStore((state) => state.updateFounderStatus);
  const syncFoundersFromBackend = useAppStore((state) => state.syncFoundersFromBackend);
  const founderExtras = useAppStore((state) => state.founderExtras);
  const syncFounderExtrasFromBackend = useAppStore((state) => state.syncFounderExtrasFromBackend);

  const [analytics, setAnalytics] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFounderId, setSelectedFounderId] = useState('');
  const [selectedInvestors, setSelectedInvestors] = useState([]);
  const [hasSynced, setHasSynced] = useState(false);
  const [hasSyncedExtras, setHasSyncedExtras] = useState(false);

  const pendingFounders = founders.filter((founder) => founder.status === 'pending');
  const approvedFounders = founders.filter((founder) => founder.status === 'approved');

  // Fetch analytics on mount
  useEffect(() => {
    if (!token) return;

    const fetchAnalytics = async () => {
      setIsLoadingAnalytics(true);
      try {
        const [analyticsRes, activityRes, summaryRes] = await Promise.all([
          adminApi.getAnalytics(token),
          adminApi.getActivityLog(token, 25),
          adminApi.getDashboardSummary(token),
        ]);
        setAnalytics(analyticsRes.analytics);
        setActivityLog(activityRes.activities || []);
        setDashboardSummary(summaryRes.summary);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  useEffect(() => {
    if (!token || hasSynced) return;

    syncFoundersFromBackend(token)
      .catch((error) => {
        console.error('Unable to sync founder intakes', error);
      })
      .finally(() => setHasSynced(true));
  }, [token, hasSynced, syncFoundersFromBackend]);

  useEffect(() => {
    if (!token || hasSyncedExtras) return;

    syncFounderExtrasFromBackend(token)
      .catch((error) => {
        console.error('Unable to sync founder extras', error);
      })
      .finally(() => setHasSyncedExtras(true));
  }, [token, hasSyncedExtras, syncFounderExtrasFromBackend]);

  useEffect(() => {
    if (approvedFounders.length > 0 && !selectedFounderId) {
      setSelectedFounderId(approvedFounders[0].id);
    }
  }, [approvedFounders, selectedFounderId]);

  const selectedFounder = useMemo(
    () => approvedFounders.find((founder) => founder.id === selectedFounderId),
    [approvedFounders, selectedFounderId],
  );

  const matches = useMemo(() => {
    if (!selectedFounder) return [];
    return selectedFounder.matches
      .map((match) => ({
        ...match,
        investor: investors.find((investor) => investor.id === match.investorId),
      }))
      .filter((item) => item.investor)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [investors, selectedFounder]);

  const servicesSnapshot = useMemo(() => {
    const totals = {
      totalRequests: 0,
      highUrgency: 0,
      successFee: 0,
      marketplace: 0,
      engagedFounders: 0,
    };

    const entries = founders.map((founder) => {
      const rawExtras = founderExtras[founder.id] ?? createDefaultFounderExtras();
      const serviceRequests = Array.isArray(rawExtras.serviceRequests)
        ? rawExtras.serviceRequests
            .map((item) => ({ ...item }))
            .sort(
              (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
            )
        : [];
      const highUrgency = serviceRequests.filter((request) => request.urgency === 'High').length;
      const entry = {
        founder,
        serviceRequests,
        highUrgency,
        extras: {
          marketplaceListing: rawExtras.marketplaceListing
            ? { ...rawExtras.marketplaceListing }
            : null,
          successFeeRequest: rawExtras.successFeeRequest ? { ...rawExtras.successFeeRequest } : null,
        },
      };

      totals.totalRequests += serviceRequests.length;
      totals.highUrgency += highUrgency;
      if (entry.extras.successFeeRequest) totals.successFee += 1;
      if (entry.extras.marketplaceListing) totals.marketplace += 1;
      if (serviceRequests.length > 0) totals.engagedFounders += 1;

      return entry;
    });

    entries.sort((a, b) => {
      if (b.serviceRequests.length !== a.serviceRequests.length) {
        return b.serviceRequests.length - a.serviceRequests.length;
      }
      return b.highUrgency - a.highUrgency;
    });

    return { entries, totals };
  }, [founders, founderExtras]);

  const toggleInvestor = (investorId) => {
    setSelectedInvestors((prev) =>
      prev.includes(investorId) ? prev.filter((id) => id !== investorId) : [...prev, investorId],
    );
  };

  const selectAllHighScores = () => {
    const highScores = matches
      .filter((match) => match.matchScore >= 70)
      .map((match) => match.investor.id);
    setSelectedInvestors(highScores);
  };

  const sendBulkIntros = () => {
    if (!selectedFounder || selectedInvestors.length === 0) return;
    showGenericSuccess(
      `Intro emails sent to ${selectedInvestors.length} investors for ${selectedFounder.startupName} (mock)`,
    );
  };

  const refreshData = async () => {
    if (!token) return;
    setIsLoadingAnalytics(true);
    try {
      const [analyticsRes, activityRes, summaryRes] = await Promise.all([
        adminApi.getAnalytics(token),
        adminApi.getActivityLog(token, 25),
        adminApi.getDashboardSummary(token),
        syncFoundersFromBackend(token),
        syncFounderExtrasFromBackend(token),
      ]);
      setAnalytics(analyticsRes.analytics);
      setActivityLog(activityRes.activities || []);
      setDashboardSummary(summaryRes.summary);
      showGenericSuccess('Dashboard refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return User;
      case 'founder_intake':
        return Building2;
      case 'service_request':
        return ClipboardList;
      case 'success_fee_request':
        return Target;
      case 'marketplace_listing':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_registration':
        return 'text-blue-400 bg-blue-500/10';
      case 'founder_intake':
        return 'text-purple-400 bg-purple-500/10';
      case 'service_request':
        return 'text-indigo-400 bg-indigo-500/10';
      case 'success_fee_request':
        return 'text-emerald-400 bg-emerald-500/10';
      case 'marketplace_listing':
        return 'text-amber-400 bg-amber-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  const filteredFounders = useMemo(() => {
    if (!searchQuery.trim()) return pendingFounders;
    const query = searchQuery.toLowerCase();
    return pendingFounders.filter(
      (founder) =>
        founder.startupName?.toLowerCase().includes(query) ||
        founder.fullName?.toLowerCase().includes(query) ||
        founder.sector?.toLowerCase().includes(query) ||
        founder.email?.toLowerCase().includes(query),
    );
  }, [pendingFounders, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Admin Command Center</h1>
          <p className="mt-2 text-slate-400">
            Comprehensive platform oversight and analytics for Launch and Lift
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={refreshData}
            disabled={isLoadingAnalytics}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-blue-500/10 via-black/40 to-black/60">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-500/20 blur-3xl" />
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Users
                  </p>
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-4xl font-bold text-white">{analytics.users.total}</p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ArrowUp className="h-3 w-3" />
                    {analytics.users.growth.last30Days}
                  </span>
                  <span className="text-slate-400">last 30 days</span>
                </div>
                <div className="mt-2 flex gap-3 text-xs text-slate-300">
                  <span>{analytics.users.founders} Founders</span>
                  <span>•</span>
                  <span>{analytics.users.investors} Investors</span>
                </div>
              </CardContent>
            </Card>

            {/* Founder Intakes */}
            <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-purple-500/10 via-black/40 to-black/60">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-500/20 blur-3xl" />
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Founder Intakes
                  </p>
                  <Building2 className="h-5 w-5 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-4xl font-bold text-white">{analytics.founderIntakes.total}</p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Clock className="h-3 w-3" />
                    {analytics.founderIntakes.pending}
                  </span>
                  <span className="text-slate-400">pending review</span>
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  {analytics.founderIntakes.conversionRate}% approval rate
                </div>
              </CardContent>
            </Card>

            {/* Service Requests */}
            <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-indigo-500/10 via-black/40 to-black/60">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/20 blur-3xl" />
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Service Requests
                  </p>
                  <ClipboardList className="h-5 w-5 text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-4xl font-bold text-white">
                  {analytics.services.totalRequests}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-rose-400">
                    <AlertTriangle className="h-3 w-3" />
                    {analytics.services.highUrgency}
                  </span>
                  <span className="text-slate-400">high urgency</span>
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  {analytics.services.averagePerFounder} avg per founder
                </div>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-emerald-500/10 via-black/40 to-black/60">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/20 blur-3xl" />
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Estimated Revenue
                  </p>
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-4xl font-bold text-white">
                  {formatCurrency(analytics.revenue.estimated.total)}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    Pipeline
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  {analytics.services.successFeeRequests} success fee engagements
                </div>
              </CardContent>
            </Card>
          </div>
        </Motion.div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="border-b border-white/10 bg-transparent">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="founders" className="gap-2">
            <Building2 className="h-4 w-4" />
            Founder Journey
            {pendingFounders.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                {pendingFounders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="matchmaking" className="gap-2">
            <Target className="h-4 w-4" />
            Matchmaking
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Revenue Breakdown */}
            {analytics && (
              <Card className="border-white/10 bg-black/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <PieChart className="h-5 w-5 text-indigo-400" />
                      Revenue Breakdown
                    </CardTitle>
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Eye className="h-3 w-3" />
                      Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.revenue.breakdown.map((item, index) => {
                    const percentage = (
                      (item.amount / analytics.revenue.estimated.total) *
                      100
                    ).toFixed(1);
                    const colors = [
                      'bg-indigo-500',
                      'bg-emerald-500',
                      'bg-amber-500',
                      'bg-rose-500',
                    ];
                    return (
                      <div key={index}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-300">{item.category}</span>
                          <span className="font-semibold text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                        <div className="relative h-3 overflow-hidden rounded-full bg-white/5">
                          <div
                            className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {item.count} items • {percentage}%
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-white/10 bg-black/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5 text-amber-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start gap-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30"
                  onClick={() => {
                    const tabs = document.querySelector('[role="tablist"]');
                    const founderTab = Array.from(tabs.querySelectorAll('button')).find(
                      (btn) => btn.textContent.includes('Founder Journey'),
                    );
                    founderTab?.click();
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Review Pending Founders
                  {pendingFounders.length > 0 && (
                    <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                      {pendingFounders.length}
                    </span>
                  )}
                </Button>
                <Button
                  className="w-full justify-start gap-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30"
                  onClick={() => {
                    const tabs = document.querySelector('[role="tablist"]');
                    const matchTab = Array.from(tabs.querySelectorAll('button')).find((btn) =>
                      btn.textContent.includes('Matchmaking'),
                    );
                    matchTab?.click();
                  }}
                >
                  <Target className="h-4 w-4" />
                  Manage Investor Matches
                </Button>
                <Button
                  className="w-full justify-start gap-3 bg-gradient-to-r from-rose-500/20 to-orange-500/20 hover:from-rose-500/30 hover:to-orange-500/30"
                  onClick={() => {
                    const tabs = document.querySelector('[role="tablist"]');
                    const serviceTab = Array.from(tabs.querySelectorAll('button')).find((btn) =>
                      btn.textContent.includes('Services'),
                    );
                    serviceTab?.click();
                  }}
                >
                  <AlertTriangle className="h-4 w-4" />
                  High Urgency Services
                  {analytics && analytics.services.highUrgency > 0 && (
                    <span className="ml-auto rounded-full bg-rose-500/20 px-2 py-0.5 text-xs text-rose-300">
                      {analytics.services.highUrgency}
                    </span>
                  )}
                </Button>
                <Button
                  className="w-full justify-start gap-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30"
                  onClick={() => {
                    const tabs = document.querySelector('[role="tablist"]');
                    const userTab = Array.from(tabs.querySelectorAll('button')).find((btn) =>
                      btn.textContent.includes('User Management'),
                    );
                    userTab?.click();
                  }}
                >
                  <Users className="h-4 w-4" />
                  User Management
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed & Insights */}
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            {/* Activity Feed */}
            <Card className="border-white/10 bg-black/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                  <Button variant="secondary" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLog.slice(0, 8).map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const colorClass = getActivityColor(activity.type);
                    return (
                      <Motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:bg-white/[0.05]"
                      >
                        <div className={`rounded-lg p-2 ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-200">{activity.description}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {formatDateDisplay(activity.timestamp)}
                          </p>
                        </div>
                        <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Insights & Stats */}
            {dashboardSummary && (
              <div className="space-y-6">
                <Card className="border-white/10 bg-black/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <LineChart className="h-5 w-5 text-emerald-400" />
                      Top Sectors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardSummary.insights.topSectors.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-semibold text-indigo-300">
                              {index + 1}
                            </div>
                            <span className="text-sm text-slate-200">{item.sector}</span>
                          </div>
                          <span className="text-sm font-semibold text-white">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      Stage Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardSummary.insights.stageDistribution
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map((item, index) => {
                          const total = dashboardSummary.insights.stageDistribution.reduce(
                            (sum, s) => sum + s.count,
                            0,
                          );
                          const percentage = ((item.count / total) * 100).toFixed(0);
                          return (
                            <div key={index}>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-slate-300">{item.stage}</span>
                                <span className="font-semibold text-white">{item.count}</span>
                              </div>
                              <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Founders Tab */}
        <TabsContent value="founders" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Founder Journey</h2>
              <p className="text-sm text-slate-400">Review and approve founder applications</p>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search founders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <Button variant="secondary" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {filteredFounders.length === 0 ? (
            <Card className="border-white/10 bg-black/30 p-10 text-center text-sm text-slate-300">
              {searchQuery ? (
                <>No founders found matching your search.</>
              ) : (
                <>All founders have been reviewed. You're caught up.</>
              )}
            </Card>
          ) : null}

          {filteredFounders.map((founder) => (
            <Motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="space-y-6 border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-black/60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-2xl text-white">
                          {founder.startupName}
                        </CardTitle>
                        <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-200">
                          Pending Review
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-300">{founder.headline}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                        <span className="rounded-full border border-white/10 px-2 py-0.5">
                          {founder.sector}
                        </span>
                        <span className="rounded-full border border-white/10 px-2 py-0.5">
                          {founder.geography}
                        </span>
                        <span className="rounded-full border border-white/10 px-2 py-0.5">
                          {founder.raiseStage}
                        </span>
                        <span className="rounded-full border border-white/10 px-2 py-0.5">
                          Targeting {formatCurrency(founder.raiseAmountUSD)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                        <span>👤 {founder.fullName}</span>
                        <span>✉️ {founder.email}</span>
                        <span>🕐 {formatDateDisplay(founder.createdAt)}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        updateFounderStatus(founder.id, 'approved');
                        showGenericSuccess(`${founder.startupName} approved`);
                      }}
                      className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                      AI Assessment
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      {founder.aiSummary}
                    </p>
                  </section>
                  <section>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                      Key Metrics &amp; Benchmarks
                    </h3>
                    <BenchmarkTable
                      rows={founder.benchmarks}
                      founderNotes={founder.benchmarkNotes}
                      onChangeNote={() => {}}
                      onSave={() => {}}
                      isDisabled
                    />
                  </section>
                  {founder.pitchDeckUrl && (
                    <section>
                      <Button variant="secondary" className="gap-2" asChild>
                        <a href={founder.pitchDeckUrl} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4" />
                          View Pitch Deck
                        </a>
                      </Button>
                    </section>
                  )}
                </CardContent>
              </Card>
            </Motion.div>
          ))}
        </TabsContent>

        {/* Matchmaking Tab */}
        <TabsContent value="matchmaking" className="space-y-6">
          {approvedFounders.length === 0 ? (
            <Card className="border-white/10 bg-black/30 p-10 text-center text-sm text-slate-300">
              Approve at least one founder to activate matchmaking.
            </Card>
          ) : (
            <>
              <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 text-sm text-slate-200 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Founder in focus
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {selectedFounder?.startupName ?? 'Select a founder'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {approvedFounders.map((founder) => {
                    const isActive = founder.id === selectedFounderId;
                    return (
                      <button
                        key={founder.id}
                        type="button"
                        onClick={() => setSelectedFounderId(founder.id)}
                        className={
                          (isActive
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20') +
                          ' rounded-full border border-white/10 px-4 py-2 text-xs font-semibold transition-all'
                        }
                      >
                        {founder.startupName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Card className="border-white/10 bg-black/40">
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white">Investor Matches</CardTitle>
                    <p className="text-sm text-slate-300">
                      AI-powered introductions for {selectedFounder?.startupName ?? 'the selected founder'}.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={selectAllHighScores} className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Select all ≥ 70%
                    </Button>
                    <Button onClick={sendBulkIntros} className="gap-2">
                      <MailPlus className="h-4 w-4" />
                      Send ({selectedInvestors.length})
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {matches.map((entry) => {
                    const investor = entry.investor;
                    const isSelected = selectedInvestors.includes(investor.id);
                    return (
                      <div
                        key={investor.id}
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-black/60 to-black/40 p-5 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <MatchScoreBadge score={entry.matchScore} />
                            <p className="text-lg font-semibold text-white">{investor.fundName}</p>
                          </div>
                          <p className="text-sm text-slate-300">{investor.thesis}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                            {investor.stageFocus.map((stage) => (
                              <span key={stage} className="rounded-full border border-white/10 px-2 py-0.5">
                                {stage}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <label className="flex items-center gap-2 text-xs text-slate-300">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleInvestor(investor.id)}
                              className="h-4 w-4 rounded border-white/20 bg-black/40"
                            />
                            Include in batch
                          </label>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              sendIntroEmailMock({
                                investorName: investor.fundName,
                                startupName: selectedFounder?.startupName ?? '',
                              })
                            }
                            className="gap-2"
                          >
                            <MailPlus className="h-4 w-4" /> Send Intro
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {matches.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-slate-300">
                      Approve a founder and we will generate match scores instantly.
                    </div>
                  ) : null}
                </CardContent>
                <CardFooter className="flex items-center justify-end gap-3 border-t border-white/10 pt-6 text-xs text-slate-300">
                  <Users className="h-4 w-4 text-indigo-300" />
                  {selectedInvestors.length} investors selected for bulk intros.
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  id: 'briefs',
                  label: 'Live briefs',
                  value: servicesSnapshot.totals.totalRequests,
                  caption:
                    servicesSnapshot.totals.engagedFounders > 0
                      ? `${servicesSnapshot.totals.engagedFounders} founders collaborating`
                      : 'Awaiting first brief',
                  icon: ClipboardList,
                  gradient: 'from-blue-500/15 to-cyan-500/15',
                },
                {
                  id: 'urgency',
                  label: 'High urgency',
                  value: servicesSnapshot.totals.highUrgency,
                  caption:
                    servicesSnapshot.totals.highUrgency > 0
                      ? 'Triage these first'
                      : 'All briefs within SLA',
                  icon: AlertTriangle,
                  gradient: 'from-rose-500/15 to-orange-500/15',
                },
                {
                  id: 'success-fee',
                  label: 'Success team',
                  value: servicesSnapshot.totals.successFee,
                  caption:
                    servicesSnapshot.totals.successFee > 0
                      ? 'Briefs under capital review'
                      : 'No success-fee requests yet',
                  icon: Target,
                  gradient: 'from-emerald-500/15 to-teal-500/15',
                },
                {
                  id: 'marketplace',
                  label: 'Marketplace ready',
                  value: servicesSnapshot.totals.marketplace,
                  caption: 'Listings with investor-facing data',
                  icon: Building2,
                  gradient: 'from-purple-500/15 to-pink-500/15',
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${stat.gradient} p-5 text-slate-200 shadow-xl`}
                  >
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-slate-400">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                        <p className="mt-1 text-xs text-slate-400">{stat.caption}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Motion.div>

          {servicesSnapshot.entries.length === 0 ? (
            <Card className="border-white/10 bg-black/30 p-10 text-center text-sm text-slate-300">
              No service briefs yet. Encourage founders to submit support requests from their dashboard.
            </Card>
          ) : (
            servicesSnapshot.entries.map((entry) => {
              const { founder, serviceRequests, extras, highUrgency } = entry;
              const hasSuccessFee = Boolean(extras.successFeeRequest);
              const hasListing = Boolean(extras.marketplaceListing);
              const statusTone =
                founder.status === 'approved'
                  ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                  : 'border-amber-400/40 bg-amber-500/15 text-amber-200';
              const statusLabel = founder.status === 'approved' ? 'Approved' : 'Pending review';
              const lastBriefed = serviceRequests[0]?.createdAt ?? null;

              return (
                <Motion.div
                  key={founder.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="relative overflow-hidden border-white/10 bg-black/35 text-slate-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/60" />
                    <CardHeader className="relative z-10">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <CardTitle className="text-2xl text-white">{founder.startupName}</CardTitle>
                          <p className="mt-1 text-sm text-slate-300">{founder.headline}</p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                            {founder.sector ? (
                              <span className="rounded-full border border-white/10 px-2 py-0.5">
                                {founder.sector}
                              </span>
                            ) : null}
                            {founder.geography ? (
                              <span className="rounded-full border border-white/10 px-2 py-0.5">
                                {founder.geography}
                              </span>
                            ) : null}
                            {founder.raiseAmountUSD ? (
                              <span className="rounded-full border border-white/10 px-2 py-0.5">
                                Targeting {formatCurrency(founder.raiseAmountUSD)}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-xs text-slate-400">
                          <span className={`rounded-full border px-3 py-1 font-semibold ${statusTone}`}>
                            {statusLabel}
                          </span>
                          <span>
                            {lastBriefed
                              ? `Last brief ${formatDateDisplay(lastBriefed)}`
                              : 'No briefs submitted'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-6">
                      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
                        <section className="space-y-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                              Service briefs
                            </p>
                            {serviceRequests.length ? (
                              <span className="text-xs text-slate-400">
                                {serviceRequests.length} brief
                                {serviceRequests.length === 1 ? '' : 's'}
                                {highUrgency
                                  ? ` • ${highUrgency} high-urgency`
                                  : ' • All within committed SLA'}
                              </span>
                            ) : null}
                          </div>

                          {serviceRequests.length ? (
                            <div className="space-y-4">
                              {serviceRequests.map((request, index) => {
                                const urgencyTone =
                                  request.urgency === 'High'
                                    ? 'border-rose-500/40 bg-rose-500/15 text-rose-100'
                                    : request.urgency === 'Low'
                                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100'
                                    : 'border-indigo-500/40 bg-indigo-500/15 text-indigo-100';

                                return (
                                  <div
                                    key={`${founder.id}-${request.createdAt ?? index}`}
                                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_-55px_rgba(99,102,241,0.95)]"
                                  >
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                      <div>
                                        <p className="text-sm font-semibold text-white">
                                          {request.serviceType}
                                        </p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">
                                          {formatDateDisplay(request.createdAt)}
                                        </p>
                                      </div>
                                      <span
                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${urgencyTone}`}
                                      >
                                        {request.urgency}
                                      </span>
                                    </div>
                                    {request.note ? (
                                      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-200">
                                        {request.note}
                                      </p>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-black/40 px-4 py-5 text-sm text-slate-300">
                              <Sparkles className="h-4 w-4 text-indigo-200" />
                              This founder has not submitted any briefs yet.
                            </div>
                          )}
                        </section>

                        <section className="space-y-4">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_-55px_rgba(45,212,191,0.6)]">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                  Success team
                                </p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                  Success-fee request
                                </p>
                              </div>
                              <Target className="h-4 w-4 text-emerald-200" />
                            </div>
                            {hasSuccessFee ? (
                              <div className="mt-4 space-y-3 text-xs text-slate-300">
                                <div className="flex items-center justify-between">
                                  <span>Round</span>
                                  <span className="font-semibold text-white">
                                    {extras.successFeeRequest.round}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Target</span>
                                  <span className="font-semibold text-white">
                                    {formatCurrencyInr(extras.successFeeRequest.targetAmount)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Committed</span>
                                  <span className="font-semibold text-white">
                                    {formatCurrencyInr(extras.successFeeRequest.committed)}
                                  </span>
                                </div>
                                {extras.successFeeRequest.deckUrl ? (
                                  <a
                                    href={extras.successFeeRequest.deckUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-xs text-emerald-200 hover:text-emerald-100"
                                  >
                                    <ArrowUpRight className="h-3 w-3" />
                                    View deck
                                  </a>
                                ) : null}
                                {extras.successFeeRequest.notes ? (
                                  <p className="text-xs leading-5 text-slate-200">
                                    {extras.successFeeRequest.notes}
                                  </p>
                                ) : null}
                                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">
                                  Updated {formatDateDisplay(extras.successFeeRequest.createdAt)}
                                </p>
                              </div>
                            ) : (
                              <p className="mt-4 text-sm text-slate-300">
                                No success-fee collaboration requested yet.
                              </p>
                            )}
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_-55px_rgba(59,130,246,0.7)]">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                  Marketplace
                                </p>
                                <p className="mt-1 text-sm font-semibold text-white">Listing status</p>
                              </div>
                              <Building2 className="h-4 w-4 text-indigo-200" />
                            </div>
                            {hasListing ? (
                              <div className="mt-4 space-y-3 text-xs text-slate-300">
                                <div className="flex items-center justify-between">
                                  <span>Raise amount</span>
                                  <span className="font-semibold text-white">
                                    {formatCurrencyInr(extras.marketplaceListing.raiseAmount)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Min. ticket</span>
                                  <span className="font-semibold text-white">
                                    {formatCurrencyInr(extras.marketplaceListing.minTicket)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">
                                    Use of funds
                                  </p>
                                  <p className="mt-1 text-xs leading-5 text-slate-200">
                                    {extras.marketplaceListing.useOfFunds}
                                  </p>
                                </div>
                                {extras.marketplaceListing.industry ? (
                                  <div className="flex items-center justify-between">
                                    <span>Industry</span>
                                    <span className="font-semibold text-white">
                                      {extras.marketplaceListing.industry}
                                    </span>
                                  </div>
                                ) : null}
                                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">
                                  Updated {formatDateDisplay(extras.marketplaceListing.lastUpdated)}
                                </p>
                              </div>
                            ) : (
                              <p className="mt-4 text-sm text-slate-300">
                                Listing is not ready for investors yet.
                              </p>
                            )}
                          </div>
                        </section>
                      </div>
                    </CardContent>
                  </Card>
                </Motion.div>
              );
            })
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <p className="text-sm text-slate-400">Manage all platform users</p>
            </div>
            <Button className="gap-2">
              <User className="h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">Founders</CardTitle>
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {founders.filter((f) => f.email).length}
                </p>
                <p className="mt-2 text-sm text-slate-300">Active founder accounts</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">Investors</CardTitle>
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{investors.length}</p>
                <p className="mt-2 text-sm text-slate-300">Registered investors</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">Platform Health</CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {analytics
                    ? `${analytics.engagement.engagementRate}%`
                    : 'Loading...'}
                </p>
                <p className="mt-2 text-sm text-slate-300">Engagement rate</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/10 bg-black/40">
            <CardHeader>
              <CardTitle className="text-white">Recent User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLog
                  .filter((a) => a.type === 'user_registration')
                  .slice(0, 10)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {activity.user?.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {activity.user?.email} • {activity.user?.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          {formatDateDisplay(activity.timestamp)}
                        </span>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
