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
  ChevronDown,
  ChevronRight,
  Clock,
  ClipboardList,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Grid3x3,
  Home,
  LineChart,
  MailPlus,
  Menu,
  MoreHorizontal,
  MoreVertical,
  PieChart,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Globe,
  CreditCard,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card.jsx';
import { BenchmarkTable } from '../components/BenchmarkTable.jsx';
import { MatchScoreBadge } from '../components/MatchScoreBadge.jsx';
import { useNotification } from '../context/NotificationContext';
import { formatCurrency, formatCurrencyInr, formatDateDisplay } from '../lib/formatters.js';
import { useAppStore } from '../store/useAppStore.js';
import { useAuth } from '../context/useAuth.js';
import { createDefaultFounderExtras } from '../data/founderExtras.js';
import { adminApi } from '../services/api.js';
import PaymentManagement from './admin/PaymentManagement.jsx';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const { showSuccess } = useNotification();
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [allFounders, setAllFounders] = useState([]);
  const [allInvestors, setAllInvestors] = useState([]);
  const [isLoadingFounders, setIsLoadingFounders] = useState(false);
  const [isLoadingInvestors, setIsLoadingInvestors] = useState(false);
  const [founderSearchQuery, setFounderSearchQuery] = useState('');
  const [investorSearchQuery, setInvestorSearchQuery] = useState('');

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

  // Fetch founders when viewing founders section
  useEffect(() => {
    if (!token || activeView !== 'founders-list') return;

    const fetchFounders = async () => {
      setIsLoadingFounders(true);
      try {
        const response = await adminApi.getFounders(token);
        setAllFounders(response.items || []);
      } catch (error) {
        console.error('Failed to fetch founders:', error);
      } finally {
        setIsLoadingFounders(false);
      }
    };

    fetchFounders();
  }, [token, activeView]);

  // Fetch investors when viewing investors section
  useEffect(() => {
    if (!token || activeView !== 'investors-list') return;

    const fetchInvestors = async () => {
      setIsLoadingInvestors(true);
      try {
        const response = await adminApi.getInvestors(token);
        setAllInvestors(response.items || []);
      } catch (error) {
        console.error('Failed to fetch investors:', error);
      } finally {
        setIsLoadingInvestors(false);
      }
    };

    fetchInvestors();
  }, [token, activeView]);

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
    showSuccess(
      `Intro emails sent to ${selectedInvestors.length} investors for ${selectedFounder.startupName}`,
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
      showSuccess('Dashboard refreshed successfully');
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

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Grid3x3 },
    { id: 'founders', label: 'Founder Journey', icon: Building2, badge: pendingFounders.length },
    { id: 'founders-list', label: 'Founders', icon: User },
    { id: 'investors-list', label: 'Investors', icon: Briefcase },
    { id: 'matchmaking', label: 'Matchmaking', icon: Target },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#3c4b64] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">Launch&Lift</span>
            </div>
          )}
          {!sidebarOpen && (
            <div className="mx-auto h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveView(item.id);
                }}
                className={`${
                  isActive
                    ? 'bg-[#2c3a4f] text-white border-l-4 border-blue-400'
                    : 'text-white/70 hover:bg-[#2c3a4f] hover:text-white'
                } w-full flex items-center gap-3 px-4 py-3 transition-colors relative cursor-pointer`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSidebarOpen(!sidebarOpen);
          }}
          className="h-12 flex items-center justify-center border-t border-white/10 hover:bg-[#2c3a4f] transition-colors cursor-pointer"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {navigationItems.find((item) => item.id === activeView)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Home className="h-4 w-4" />
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-700">Admin</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-700">{activeView}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              disabled={isLoadingAnalytics}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`h-5 w-5 text-gray-600 ${isLoadingAnalytics ? 'animate-spin' : ''}`}
              />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {pendingFounders.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">Admin</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Users */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <ArrowUp className="h-4 w-4" />
                        {analytics.users.growth.last30Days}
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-900">{analytics.users.total}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {analytics.users.founders} Founders • {analytics.users.investors} Investors
                    </p>
                  </div>

                  {/* Founder Intakes */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                      {analytics.founderIntakes.pending > 0 && (
                        <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          {analytics.founderIntakes.pending} Pending
                        </span>
                      )}
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Founder Intakes</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.founderIntakes.total}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {analytics.founderIntakes.conversionRate}% approval rate
                    </p>
                  </div>

                  {/* Service Requests */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <ClipboardList className="h-6 w-6 text-indigo-600" />
                      </div>
                      {analytics.services.highUrgency > 0 && (
                        <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">
                          {analytics.services.highUrgency} Urgent
                        </span>
                      )}
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Service Requests</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.services.totalRequests}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {analytics.services.averagePerFounder} avg per founder
                    </p>
                  </div>

                  {/* Revenue */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Estimated Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(analytics.revenue.estimated.total)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {analytics.services.successFeeRequests} success fee engagements
                    </p>
                  </div>
                </div>
              )}

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                {analytics && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Report
                      </button>
                    </div>
                    <div className="space-y-4">
                      {analytics.revenue.breakdown.map((item, index) => {
                        const percentage = (
                          (item.amount / analytics.revenue.estimated.total) *
                          100
                        ).toFixed(1);
                        const colors = [
                          { bg: 'bg-blue-500', text: 'text-blue-700' },
                          { bg: 'bg-emerald-500', text: 'text-emerald-700' },
                          { bg: 'bg-amber-500', text: 'text-amber-700' },
                          { bg: 'bg-rose-500', text: 'text-rose-700' },
                        ];
                        const color = colors[index % colors.length];
                        return (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                {item.category}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(item.amount)}
                              </span>
                            </div>
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${color.bg} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">{item.count} items</span>
                              <span className={`text-xs font-medium ${color.text}`}>
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {activityLog.slice(0, 6).map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 line-clamp-1">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatDateDisplay(activity.timestamp)}
                            </p>
                          </div>
                          <button className="flex-shrink-0 p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Insights Row */}
              {dashboardSummary && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Sectors */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Sectors</h3>
                    <div className="space-y-4">
                      {dashboardSummary.insights.topSectors.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.sector}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stage Distribution */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Stage Distribution
                    </h3>
                    <div className="space-y-4">
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
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {item.stage}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {item.count}
                                </span>
                              </div>
                              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Founders View */}
          {activeView === 'founders' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search founders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Founder Cards */}
              {filteredFounders.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchQuery
                      ? 'No founders found matching your search.'
                      : 'All founders have been reviewed!'}
                  </p>
                </div>
              ) : (
                filteredFounders.map((founder) => (
                  <Motion.div
                    key={founder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* Header */}
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {founder.startupName}
                              </h3>
                              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                Pending Review
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{founder.headline}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {founder.sector}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {founder.geography}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {founder.raiseStage}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {formatCurrency(founder.raiseAmountUSD)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {founder.fullName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDateDisplay(founder.createdAt)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              updateFounderStatus(founder.id, 'approved');
                              showSuccess(`${founder.startupName} approved`);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            AI Assessment
                          </h4>
                          <p className="text-gray-600 leading-relaxed">{founder.aiSummary}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                            Key Metrics
                          </h4>
                          <BenchmarkTable
                            rows={founder.benchmarks}
                            founderNotes={founder.benchmarkNotes}
                            onChangeNote={() => {}}
                            onSave={() => {}}
                            isDisabled
                          />
                        </div>
                        {founder.pitchDeckUrl && (
                          <a
                            href={founder.pitchDeckUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <Download className="h-4 w-4" />
                            View Pitch Deck
                          </a>
                        )}
                      </div>
                    </div>
                  </Motion.div>
                ))
              )}
            </div>
          )}

          {/* Matchmaking View */}
          {activeView === 'matchmaking' && (
            <div className="space-y-6">
              {approvedFounders.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Approve at least one founder to activate matchmaking.
                  </p>
                </div>
              ) : (
                <>
                  {/* Founder Selector */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-3">Select Founder</p>
                    <div className="flex flex-wrap gap-3">
                      {approvedFounders.map((founder) => {
                        const isActive = founder.id === selectedFounderId;
                        return (
                          <button
                            key={founder.id}
                            onClick={() => setSelectedFounderId(founder.id)}
                            className={`${
                              isActive
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                            } px-4 py-2 border rounded-lg text-sm font-medium transition-colors`}
                          >
                            {founder.startupName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Matches */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Investor Matches</h3>
                          <p className="text-sm text-gray-600">
                            AI-powered matches for {selectedFounder?.startupName}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={selectAllHighScores}
                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
                          >
                            Select ≥ 70%
                          </button>
                          <button
                            onClick={sendBulkIntros}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                          >
                            <MailPlus className="h-4 w-4" />
                            Send ({selectedInvestors.length})
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {matches.map((entry) => {
                        const investor = entry.investor;
                        const isSelected = selectedInvestors.includes(investor.id);
                        return (
                          <div
                            key={investor.id}
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleInvestor(investor.id)}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <MatchScoreBadge score={entry.matchScore} />
                                <h4 className="text-base font-semibold text-gray-900">
                                  {investor.fundName}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{investor.thesis}</p>
                              <div className="flex flex-wrap gap-2">
                                {investor.stageFocus.map((stage) => (
                                  <span
                                    key={stage}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                  >
                                    {stage}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                showSuccess(
                                  `Introduced ${investor.fundName} to ${selectedFounder?.startupName ?? ''}.`,
                                  'Intro email sent'
                                );
                              }}
                              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
                            >
                              Send Intro
                            </button>
                          </div>
                        );
                      })}

                      {matches.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No matches generated yet.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Services View */}
          {activeView === 'services' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {servicesSnapshot.totals.totalRequests}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">High Urgency</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {servicesSnapshot.totals.highUrgency}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Target className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Success Fee</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {servicesSnapshot.totals.successFee}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Marketplace</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {servicesSnapshot.totals.marketplace}
                  </p>
                </div>
              </div>

              {/* Service Entries */}
              {servicesSnapshot.entries.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No service requests yet.</p>
                </div>
              ) : (
                servicesSnapshot.entries.map((entry) => {
                  const { founder, serviceRequests, extras } = entry;
                  const hasSuccessFee = Boolean(extras.successFeeRequest);
                  const hasListing = Boolean(extras.marketplaceListing);

                  return (
                    <div
                      key={founder.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {founder.startupName}
                            </h3>
                            <p className="text-sm text-gray-600">{founder.headline}</p>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              founder.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {founder.status === 'approved' ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Service Requests */}
                        <div className="lg:col-span-2">
                          <h4 className="text-sm font-semibold text-gray-700 mb-4">
                            Service Requests ({serviceRequests.length})
                          </h4>
                          {serviceRequests.length > 0 ? (
                            <div className="space-y-3">
                              {serviceRequests.map((request, index) => (
                                <div
                                  key={index}
                                  className="p-4 border border-gray-200 rounded-lg"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <p className="font-medium text-gray-900">
                                      {request.serviceType}
                                    </p>
                                    <span
                                      className={`px-2 py-1 text-xs font-semibold rounded ${
                                        request.urgency === 'High'
                                          ? 'bg-red-100 text-red-800'
                                          : request.urgency === 'Low'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-blue-100 text-blue-800'
                                      }`}
                                    >
                                      {request.urgency}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2">
                                    {formatDateDisplay(request.createdAt)}
                                  </p>
                                  {request.note && (
                                    <p className="text-sm text-gray-600">{request.note}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No service requests yet.</p>
                          )}
                        </div>

                        {/* Extras */}
                        <div className="space-y-4">
                          {/* Success Fee */}
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Target className="h-4 w-4 text-emerald-600" />
                              <h5 className="text-sm font-semibold text-gray-900">Success Fee</h5>
                            </div>
                            {hasSuccessFee ? (
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Round:</span>
                                  <span className="font-medium">
                                    {extras.successFeeRequest.round}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Target:</span>
                                  <span className="font-medium">
                                    {formatCurrencyInr(extras.successFeeRequest.targetAmount)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">Not requested</p>
                            )}
                          </div>

                          {/* Marketplace */}
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Building2 className="h-4 w-4 text-blue-600" />
                              <h5 className="text-sm font-semibold text-gray-900">Marketplace</h5>
                            </div>
                            {hasListing ? (
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Raise:</span>
                                  <span className="font-medium">
                                    {formatCurrencyInr(extras.marketplaceListing.raiseAmount)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Min. Ticket:</span>
                                  <span className="font-medium">
                                    {formatCurrencyInr(extras.marketplaceListing.minTicket)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">Not listed</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Users View */}
          {activeView === 'users' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">Founders</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {founders.filter((f) => f.email).length}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">Investors</h3>
                  <p className="text-3xl font-bold text-gray-900">{investors.length}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">Engagement</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics ? `${analytics.engagement.engagementRate}%` : '-'}
                  </p>
                </div>
              </div>

              {/* User Activity */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent User Activity</h3>
                </div>
                <div className="p-6 space-y-3">
                  {activityLog
                    .filter((a) => a.type === 'user_registration')
                    .slice(0, 10)
                    .map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {activity.user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.user?.email} • {activity.user?.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {formatDateDisplay(activity.timestamp)}
                          </span>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Founders List View */}
          {activeView === 'founders-list' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search founders by name, startup, email, or sector..."
                      value={founderSearchQuery}
                      onChange={(e) => setFounderSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingFounders && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading founders...</p>
                </div>
              )}

              {/* Founders List */}
              {!isLoadingFounders && (
                <>
                  {allFounders.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No founders found.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {allFounders
                        .filter((founder) => {
                          if (!founderSearchQuery.trim()) return true;
                          const query = founderSearchQuery.toLowerCase();
                          return (
                            founder.fullName?.toLowerCase().includes(query) ||
                            founder.startupName?.toLowerCase().includes(query) ||
                            founder.email?.toLowerCase().includes(query) ||
                            founder.sector?.toLowerCase().includes(query) ||
                            founder.brandName?.toLowerCase().includes(query)
                          );
                        })
                        .map((founder) => (
                          <Motion.div
                            key={founder.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              {/* Header */}
                              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="text-2xl font-bold text-gray-900">
                                        {founder.startupName}
                                      </h3>
                                      <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                          founder.status === 'approved'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : founder.status === 'rejected'
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-amber-100 text-amber-800'
                                        }`}
                                      >
                                        {founder.status?.toUpperCase() || 'PENDING'}
                                      </span>
                                    </div>
                                    {founder.brief && (
                                      <p className="text-gray-700 mb-3">{founder.brief}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                      {founder.sector && (
                                        <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200">
                                          {founder.sector}
                                        </span>
                                      )}
                                      {founder.geography && (
                                        <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200">
                                          {founder.geography}
                                        </span>
                                      )}
                                      {founder.raiseStage && (
                                        <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200">
                                          {founder.raiseStage}
                                        </span>
                                      )}
                                      {founder.raiseAmountUSD !== undefined && founder.raiseAmountUSD !== null && (
                                        <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200">
                                          {formatCurrency(founder.raiseAmountUSD)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-6 space-y-6">
                                {/* Founder Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                      Founder Information
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-medium text-gray-900">
                                          {founder.fullName}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium text-gray-900">
                                          {founder.email}
                                        </span>
                                      </div>
                                      {founder.phoneNumber && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-gray-400" />
                                          <span className="text-gray-600">Phone:</span>
                                          <span className="font-medium text-gray-900">
                                            {founder.phoneNumber}
                                          </span>
                                        </div>
                                      )}
                                      {founder.linkedInUrl && (
                                        <div className="flex items-center gap-2">
                                          <LinkIcon className="h-4 w-4 text-gray-400" />
                                          <a
                                            href={founder.linkedInUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline"
                                          >
                                            LinkedIn Profile
                                          </a>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">Registered:</span>
                                        <span className="font-medium text-gray-900">
                                          {formatDateDisplay(founder.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                      Company Details
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      {founder.brandName && (
                                        <div>
                                          <span className="text-gray-600">Brand Name:</span>
                                          <span className="font-medium text-gray-900 ml-2">
                                            {founder.brandName}
                                          </span>
                                        </div>
                                      )}
                                      {founder.companyLegalName && (
                                        <div>
                                          <span className="text-gray-600">Legal Name:</span>
                                          <span className="font-medium text-gray-900 ml-2">
                                            {founder.companyLegalName}
                                          </span>
                                        </div>
                                      )}
                                      {founder.companyWebsite && (
                                        <div className="flex items-center gap-2">
                                          <Globe className="h-4 w-4 text-gray-400" />
                                          <a
                                            href={founder.companyWebsite}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline"
                                          >
                                            {founder.companyWebsite}
                                          </a>
                                        </div>
                                      )}
                                      {founder.teamSize && (
                                        <div>
                                          <span className="text-gray-600">Team Size:</span>
                                          <span className="font-medium text-gray-900 ml-2">
                                            {founder.teamSize} members
                                          </span>
                                        </div>
                                      )}
                                      {founder.currentStage && (
                                        <div>
                                          <span className="text-gray-600">Current Stage:</span>
                                          <span className="font-medium text-gray-900 ml-2">
                                            {founder.currentStage}
                                          </span>
                                        </div>
                                      )}
                                      {founder.revenueRunRateUSD !== undefined && founder.revenueRunRateUSD !== null && (
                                        <div>
                                          <span className="text-gray-600">Revenue Run Rate:</span>
                                          <span className="font-medium text-gray-900 ml-2">
                                            {formatCurrency(founder.revenueRunRateUSD)}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* AI Summary */}
                                {founder.aiSummary && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                      AI Assessment
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                      {founder.aiSummary}
                                    </p>
                                  </div>
                                )}

                                {/* Metrics */}
                                {founder.benchmarks && Array.isArray(founder.benchmarks) && founder.benchmarks.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                      Key Metrics
                                    </h4>
                                    <BenchmarkTable
                                      rows={founder.benchmarks}
                                      founderNotes={founder.benchmarkNotes || {}}
                                      onChangeNote={() => {}}
                                      onSave={() => {}}
                                      isDisabled
                                    />
                                  </div>
                                )}

                                {/* Service Requests & Extras */}
                                {founder.extras && (
                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                        Service Requests ({Array.isArray(founder.extras.serviceRequests) ? founder.extras.serviceRequests.length : 0})
                                      </h4>
                                      {Array.isArray(founder.extras.serviceRequests) &&
                                      founder.extras.serviceRequests.length > 0 ? (
                                        <div className="space-y-2">
                                          {founder.extras.serviceRequests.map((request, idx) => (
                                            <div
                                              key={idx}
                                              className="p-3 border border-gray-200 rounded-lg"
                                            >
                                              <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-gray-900">
                                                  {request?.serviceType || 'Unknown Service'}
                                                </span>
                                                {request?.urgency && (
                                                  <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded ${
                                                      request.urgency === 'High'
                                                        ? 'bg-red-100 text-red-800'
                                                        : request.urgency === 'Low'
                                                          ? 'bg-emerald-100 text-emerald-800'
                                                          : 'bg-blue-100 text-blue-800'
                                                    }`}
                                                  >
                                                    {request.urgency}
                                                  </span>
                                                )}
                                              </div>
                                              {request?.note && (
                                                <p className="text-sm text-gray-600">{request.note}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-500">No service requests</p>
                                      )}
                                    </div>
                                    <div className="space-y-4">
                                      {founder.extras.successFeeRequest && (
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                          <h5 className="text-sm font-semibold text-gray-900 mb-2">
                                            Success Fee Request
                                          </h5>
                                          <div className="space-y-1 text-sm">
                                            {founder.extras.successFeeRequest.round && (
                                              <div>
                                                <span className="text-gray-600">Round:</span>
                                                <span className="font-medium ml-2">
                                                  {founder.extras.successFeeRequest.round}
                                                </span>
                                              </div>
                                            )}
                                            {founder.extras.successFeeRequest.targetAmount !== undefined && founder.extras.successFeeRequest.targetAmount !== null && (
                                              <div>
                                                <span className="text-gray-600">Target:</span>
                                                <span className="font-medium ml-2">
                                                  {formatCurrencyInr(
                                                    founder.extras.successFeeRequest.targetAmount,
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {founder.extras.marketplaceListing && (
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                          <h5 className="text-sm font-semibold text-gray-900 mb-2">
                                            Marketplace Listing
                                          </h5>
                                          <div className="space-y-1 text-sm">
                                            {founder.extras.marketplaceListing.raiseAmount !== undefined && founder.extras.marketplaceListing.raiseAmount !== null && (
                                              <div>
                                                <span className="text-gray-600">Raise Amount:</span>
                                                <span className="font-medium ml-2">
                                                  {formatCurrencyInr(
                                                    founder.extras.marketplaceListing.raiseAmount,
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                            {founder.extras.marketplaceListing.minTicket !== undefined && founder.extras.marketplaceListing.minTicket !== null && (
                                              <div>
                                                <span className="text-gray-600">Min Ticket:</span>
                                                <span className="font-medium ml-2">
                                                  {formatCurrencyInr(
                                                    founder.extras.marketplaceListing.minTicket,
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* User Account Info */}
                                {founder.userAccount && (
                                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                      User Account
                                    </h4>
                                    <div className="text-sm text-gray-600">
                                      Account created: {formatDateDisplay(founder.userAccount.createdAt)}
                                    </div>
                                  </div>
                                )}

                                {/* Pitch Deck */}
                                {founder.pitchDeckUrl && (
                                  <div>
                                    <a
                                      href={founder.pitchDeckUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                    >
                                      <Download className="h-4 w-4" />
                                      View Pitch Deck
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Motion.div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Investors List View */}
          {activeView === 'investors-list' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search investors by name, email, or organization..."
                      value={investorSearchQuery}
                      onChange={(e) => setInvestorSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingInvestors && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading investors...</p>
                </div>
              )}

              {/* Investors List */}
              {!isLoadingInvestors && (
                <>
                  {allInvestors.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No investors found.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {allInvestors
                        .filter((investor) => {
                          if (!investorSearchQuery.trim()) return true;
                          const query = investorSearchQuery.toLowerCase();
                          return (
                            investor.fullName?.toLowerCase().includes(query) ||
                            investor.email?.toLowerCase().includes(query) ||
                            investor.organization?.toLowerCase().includes(query) ||
                            (investor.investorDetails?.location &&
                              investor.investorDetails.location.toLowerCase().includes(query))
                          );
                        })
                        .map((investor) => (
                          <Motion.div
                            key={investor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              {/* Header */}
                              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="text-2xl font-bold text-gray-900">
                                        {investor.fullName}
                                      </h3>
                                      {investor.organization && (
                                        <span className="px-3 py-1 bg-white text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
                                          {investor.organization}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {investor.portfolioCount > 0 && (
                                        <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200">
                                          {investor.portfolioCount} Portfolio Companies
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-6 space-y-6">
                                {/* Investor Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                      Contact Information
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium text-gray-900">
                                          {investor.email}
                                        </span>
                                      </div>
                                      {investor.investorDetails?.phone && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-gray-400" />
                                          <span className="text-gray-600">Phone:</span>
                                          <span className="font-medium text-gray-900">
                                            {investor.investorDetails.phone}
                                          </span>
                                        </div>
                                      )}
                                      {investor.investorDetails?.location && (
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4 text-gray-400" />
                                          <span className="text-gray-600">Location:</span>
                                          <span className="font-medium text-gray-900">
                                            {investor.investorDetails.location}
                                          </span>
                                        </div>
                                      )}
                                      {investor.investorDetails?.linkedinUrl && (
                                        <div className="flex items-center gap-2">
                                          <LinkIcon className="h-4 w-4 text-gray-400" />
                                          <a
                                            href={investor.investorDetails.linkedinUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline"
                                          >
                                            LinkedIn Profile
                                          </a>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">Registered:</span>
                                        <span className="font-medium text-gray-900">
                                          {formatDateDisplay(investor.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                      Additional Details
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      {investor.notes && (
                                        <div>
                                          <span className="text-gray-600">Notes:</span>
                                          <p className="text-gray-900 mt-1">{investor.notes}</p>
                                        </div>
                                      )}
                                      {investor.investorDetails &&
                                        Object.keys(investor.investorDetails).length > 0 && (
                                          <div>
                                            <span className="text-gray-600">Details:</span>
                                            <pre className="text-xs text-gray-700 mt-1 bg-gray-50 p-2 rounded overflow-auto">
                                              {JSON.stringify(investor.investorDetails, null, 2)}
                                            </pre>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>

                                {/* Portfolio Companies */}
                                {investor.portfolios && investor.portfolios.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                      Portfolio Companies ({investor.portfolios.length})
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {investor.portfolios.map((portfolio) => (
                                        <div
                                          key={portfolio.id}
                                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                                        >
                                          <h5 className="font-semibold text-gray-900 mb-2">
                                            {portfolio.companyName}
                                          </h5>
                                          {portfolio.description && (
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                              {portfolio.description}
                                            </p>
                                          )}
                                          <div className="flex flex-wrap gap-2 mt-2">
                                            {portfolio.sector && (
                                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                {portfolio.sector}
                                              </span>
                                            )}
                                            {portfolio.stage && (
                                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                {portfolio.stage}
                                              </span>
                                            )}
                                          </div>
                                          {portfolio.website && (
                                            <a
                                              href={portfolio.website}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1"
                                            >
                                              <Globe className="h-3 w-3" />
                                              Visit Website
                                            </a>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Motion.div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Payments View */}
          {activeView === 'payments' && <PaymentManagement />}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Advanced Analytics Coming Soon
                </h3>
                <p className="text-gray-600">
                  Detailed charts and insights will be available here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
