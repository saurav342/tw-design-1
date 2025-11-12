import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Building2,
  ChevronDown,
  Menu,
  Rocket,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit3,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { formatCurrencyInr, formatDateDisplay } from '../lib/formatters.js';
import { useFounderExtras } from '../hooks/useFounderExtras.js';
import { useActiveFounder } from '../hooks/useActiveFounder.js';
import { FOUNDER_SERVICE_DETAILS } from '../data/founderExtras.js';
import { useAppStore } from '../store/useAppStore.js';
import { persistActiveFounderId, readActiveFounderId } from '../lib/founderSession.js';
import { toNumberOrNull } from '../lib/utils.js';
import { useNotification } from '../context/NotificationContext';
import DashboardHeader from '../components/DashboardHeader.jsx';

const MotionDiv = Motion.div;

const DashboardLayout = () => {
  const { user, token } = useAuth();
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const syncFoundersFromBackend = useAppStore((state) => state.syncFoundersFromBackend);
  const syncFounderExtrasFromBackend = useAppStore((state) => state.syncFounderExtrasFromBackend);

  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load founder data from backend on mount
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          syncFoundersFromBackend(token),
          syncFounderExtrasFromBackend(token),
        ]);
      } catch (error) {
        console.error('Failed to load founder data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token, syncFoundersFromBackend, syncFounderExtrasFromBackend]);

  // Set activeId from sessionStorage after founders are loaded
  useEffect(() => {
    if (!isLoading && founders.length > 0) {
      const persistedId = readActiveFounderId();
      if (persistedId) {
        // Verify the persisted ID exists in the loaded founders
        const found = founders.find((founder) => founder.id === persistedId);
        if (found) {
          setActiveId(persistedId);
        } else {
          // If persisted ID doesn't exist, use first founder
          setActiveId(founders[0]?.id ?? null);
        }
      } else {
        // No persisted ID, use first founder
        setActiveId(founders[0]?.id ?? null);
      }
    }
  }, [isLoading, founders]);

  const activeFounder = useMemo(() => {
    if (activeId) {
      const found = founders.find((founder) => founder.id === activeId);
      if (found) return found;
    }
    return founders[0];
  }, [founders, activeId]);

  const activeFounderId = activeFounder?.id ?? null;
  const { extras } = useFounderExtras(activeFounderId);

  useEffect(() => {
    if (activeFounder) {
      persistActiveFounderId(activeFounder.id);
    } else {
      persistActiveFounderId(null);
    }
  }, [activeFounder]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!activeFounder) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-24 text-center text-slate-700">
        <Card className="max-w-lg border-slate-200 bg-white/95 p-10 text-slate-800 shadow-[0_24px_70px_-48px_rgba(91,33,209,0.25)]">
          <p className="text-sm">
            No founder profile yet. Complete the intake flow to unlock your dashboard.
          </p>
        </Card>
      </div>
    );
  }

  const founderName = user?.fullName ?? activeFounder.fullName ?? 'Founder';

  const listing = extras?.marketplaceListing ?? null;
  const successRequest = extras?.successFeeRequest ?? null;
  const serviceRequests = Array.isArray(extras?.serviceRequests) ? extras.serviceRequests : [];
  const latestServiceRequest = serviceRequests.at(-1) ?? null;
  const matches = Array.isArray(activeFounder.matches) ? activeFounder.matches : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader role="founder" />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Title */}
          <PageTitle />

          {/* Dashboard Tiles - Redesigned */}
          <DashboardTiles
            listing={listing}
            successRequest={successRequest}
            matches={matches}
            serviceRequests={serviceRequests}
          />

          {/* Dashboard Sections - Collapsible */}
          <DashboardSections
            listing={listing}
            successRequest={successRequest}
            matches={matches}
            investors={investors}
            latestServiceRequest={latestServiceRequest}
            totalRequests={serviceRequests.length}
            activeFounder={activeFounder}
          />
        </div>
      </main>
    </div>
  );
};

const PageTitle = () => (
  <div className="mb-2">
    <h1 className="text-4xl font-bold tracking-tight text-slate-900">Founder Dashboard</h1>
    <p className="mt-3 text-base text-slate-600 max-w-2xl">
      Manage your fundraising journey and access expert support to keep momentum across every part
      of your raise.
    </p>
  </div>
);

const DashboardTiles = ({ listing, successRequest, matches, serviceRequests }) => {
  const tiles = [
    {
      id: 'marketplace',
      title: 'Marketplace presence',
      description: listing
        ? 'Listing live and investor-ready.'
        : 'Publish your raise details to go live.',
      href: '#marketplace-presence',
      sectionId: 'marketplace-presence',
      status: listing ? 'Active' : 'Draft',
      statusColor: listing ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
      bg: 'from-blue-50 to-sky-50',
      borderColor: 'border-blue-200',
      icon: BarChart3,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      id: 'success-fee',
      title: 'Success-fee raise support',
      description: successRequest
        ? 'Brief submitted to the capital team.'
        : 'Share your traction for hands-on support.',
      href: '#success-fee-support',
      sectionId: 'success-fee-support',
      status: successRequest ? 'In review' : 'Get started',
      statusColor: successRequest ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700',
      bg: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      icon: Rocket,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
    {
      id: 'investor-intros',
      title: 'Investor introductions',
      description:
        matches.length > 0
          ? `Warm intros queued for ${matches.length} investors.`
          : 'Line up curated intros matched to your round.',
      href: '#investor-introductions',
      sectionId: 'investor-introductions',
      status: matches.length > 0 ? 'Ready' : 'Pending',
      statusColor: matches.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700',
      bg: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      icon: Users,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
    {
      id: 'services',
      title: 'Founder services studio',
      description:
        serviceRequests.length > 0
          ? `${serviceRequests.length} request${serviceRequests.length > 1 ? 's' : ''} in motion.`
          : 'Spin up support for pitch, diligence, and GTM.',
      href: '#founder-services',
      sectionId: 'founder-services',
      status: 'Available',
      statusColor: 'bg-indigo-100 text-indigo-700',
      bg: 'from-indigo-50 to-violet-50',
      borderColor: 'border-indigo-200',
      icon: Briefcase,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile, index) => {
        const Icon = tile.icon;
        return (
          <MotionDiv
            key={tile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group relative overflow-hidden rounded-2xl border-2 ${tile.borderColor} bg-gradient-to-br ${tile.bg} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl ${tile.iconBg} p-3 transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${tile.iconColor}`} />
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${tile.statusColor}`}>
                {tile.status}
              </span>
            </div>
            <h2 className="mt-5 text-lg font-bold text-slate-900">{tile.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{tile.description}</p>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mt-5 w-full justify-start text-slate-700 hover:bg-white/80 hover:text-slate-900"
            >
              <Link className="flex items-center gap-2" to={tile.href}>
                View details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </MotionDiv>
        );
      })}
    </div>
  );
};

const DashboardSections = ({
  listing,
  successRequest,
  matches,
  investors,
  latestServiceRequest,
  totalRequests,
  activeFounder,
}) => {
  const [expandedSection, setExpandedSection] = useState('marketplace-presence');

  const sections = [
    {
      id: 'marketplace-presence',
      title: 'Marketplace Presence',
      icon: BarChart3,
      component: <MarketplacePresence listing={listing} activeFounder={activeFounder} />,
    },
    {
      id: 'success-fee-support',
      title: 'Success-Fee Raise Support',
      icon: Rocket,
      component: <SuccessFeeSupport successRequest={successRequest} />,
    },
    {
      id: 'investor-introductions',
      title: 'Investor Introductions',
      icon: Users,
      component: <InvestorIntroductions matches={matches} investors={investors} />,
    },
    {
      id: 'founder-services',
      title: 'Founder Services Studio',
      icon: Briefcase,
      component: (
        <FounderServices
          latestServiceRequest={latestServiceRequest}
          totalRequests={totalRequests}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isExpanded = expandedSection === section.id;

        return (
          <MotionDiv
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <button
              onClick={() => setExpandedSection(isExpanded ? '' : section.id)}
              className="w-full px-6 py-5 text-left transition-colors hover:bg-slate-50/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-slate-100 p-2.5">
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            <AnimatePresence>
              {isExpanded && (
                <MotionDiv
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-100 px-6 py-6">{section.component}</div>
                </MotionDiv>
              )}
            </AnimatePresence>
          </MotionDiv>
        );
      })}
    </div>
  );
};

const MarketplacePresence = ({ listing, activeFounder }) => {
  const founderId = activeFounder?.id ?? null;
  const { extras, setMarketplaceListing } = useFounderExtras(founderId);
  const { showSuccess, showInfo } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    startupName: '',
    raiseAmount: '',
    minTicket: '',
    industry: '',
    useOfFunds: '',
    companyWebsite: '',
    sector: '',
    currentStage: '',
    brief: '',
  });

  const hasListing = Boolean(listing);
  const lastUpdated =
    hasListing && listing?.lastUpdated ? formatDateDisplay(listing.lastUpdated) : 'Not updated';

  // Initialize form data from listing and activeFounder
  useEffect(() => {
    if (activeFounder || listing) {
      setFormData({
        startupName: listing?.startupName || activeFounder?.startupName || activeFounder?.company?.brandName || '',
        raiseAmount: listing?.raiseAmount ? String(listing.raiseAmount) : '',
        minTicket: listing?.minTicket ? String(listing.minTicket) : '',
        industry: listing?.industry || activeFounder?.sector || activeFounder?.company?.sector || '',
        useOfFunds: listing?.useOfFunds || '',
        companyWebsite: activeFounder?.company?.website || activeFounder?.companyWebsite || '',
        sector: activeFounder?.sector || activeFounder?.company?.sector || '',
        currentStage: activeFounder?.raiseStage || activeFounder?.company?.currentStage || '',
        brief: activeFounder?.company?.brief || activeFounder?.tractionSummary || '',
      });
    }
  }, [listing, activeFounder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedListing = {
        id: listing?.id || `marketplace-${Date.now()}`,
        startupName: formData.startupName.trim() || activeFounder?.startupName || null,
        raiseAmount: toNumberOrNull(formData.raiseAmount) ?? 0,
        minTicket: toNumberOrNull(formData.minTicket) ?? 0,
        industry: formData.industry.trim(),
        useOfFunds: formData.useOfFunds.trim(),
        status: listing?.status || 'active',
        lastUpdated: new Date().toISOString(),
      };

      await setMarketplaceListing(updatedListing);
      showSuccess('Startup details updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save startup details', error);
      showInfo('We could not update your details. Please try again in a moment.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    if (activeFounder || listing) {
      setFormData({
        startupName: listing?.startupName || activeFounder?.startupName || activeFounder?.company?.brandName || '',
        raiseAmount: listing?.raiseAmount ? String(listing.raiseAmount) : '',
        minTicket: listing?.minTicket ? String(listing.minTicket) : '',
        industry: listing?.industry || activeFounder?.sector || activeFounder?.company?.sector || '',
        useOfFunds: listing?.useOfFunds || '',
        companyWebsite: activeFounder?.company?.website || activeFounder?.companyWebsite || '',
        sector: activeFounder?.sector || activeFounder?.company?.sector || '',
        currentStage: activeFounder?.raiseStage || activeFounder?.company?.currentStage || '',
        brief: activeFounder?.company?.brief || activeFounder?.tractionSummary || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-slate-600">
            Keep your raise details polished before we surface you to Launch &amp; Lift investors.
          </p>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit details
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {hasListing && (
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-sky-50/50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <p className="text-base font-semibold text-slate-900">Active listing</p>
              </div>
              <p className="text-sm text-slate-600">Last updated: {lastUpdated}</p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              Active
            </span>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startupName" className="text-slate-700">
                Startup name
              </Label>
              <Input
                id="startupName"
                name="startupName"
                value={formData.startupName}
                onChange={handleInputChange}
                placeholder="Your startup name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite" className="text-slate-700">
                Company website
              </Label>
              <Input
                id="companyWebsite"
                name="companyWebsite"
                type="url"
                value={formData.companyWebsite}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector" className="text-slate-700">
                Sector
              </Label>
              <Input
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                placeholder="e.g., SaaS, FinTech"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentStage" className="text-slate-700">
                Current stage
              </Label>
              <Input
                id="currentStage"
                name="currentStage"
                value={formData.currentStage}
                onChange={handleInputChange}
                placeholder="e.g., Seed, Series A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="raiseAmount" className="text-slate-700">
                Raise amount (₹)
              </Label>
              <Input
                id="raiseAmount"
                name="raiseAmount"
                type="number"
                min="0"
                value={formData.raiseAmount}
                onChange={handleInputChange}
                placeholder="25000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minTicket" className="text-slate-700">
                Minimum ticket size (₹)
              </Label>
              <Input
                id="minTicket"
                name="minTicket"
                type="number"
                min="0"
                value={formData.minTicket}
                onChange={handleInputChange}
                placeholder="500000"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="industry" className="text-slate-700">
                Industry / category
              </Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="SaaS / GTM enablement"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="useOfFunds" className="text-slate-700">
                Use of funds
              </Label>
              <Textarea
                id="useOfFunds"
                name="useOfFunds"
                value={formData.useOfFunds}
                onChange={handleInputChange}
                placeholder="Describe how you plan to use the funds..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="brief" className="text-slate-700">
                Company brief / Traction summary
              </Label>
              <Textarea
                id="brief"
                name="brief"
                value={formData.brief}
                onChange={handleInputChange}
                placeholder="Brief description of your company and traction..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Startup Details Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Startup information
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Startup name</p>
                <p className="text-base font-semibold text-slate-900">
                  {activeFounder?.startupName || activeFounder?.company?.brandName || listing?.startupName || 'Not set'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Website</p>
                <p className="text-sm text-slate-700">
                  {activeFounder?.company?.website || activeFounder?.companyWebsite ? (
                    <a
                      href={activeFounder?.company?.website || activeFounder?.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {activeFounder?.company?.website || activeFounder?.companyWebsite}
                    </a>
                  ) : (
                    'Not set'
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Sector</p>
                <p className="text-sm font-semibold text-slate-900">
                  {activeFounder?.sector || activeFounder?.company?.sector || 'Not set'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Stage</p>
                <p className="text-sm font-semibold text-slate-900">
                  {activeFounder?.raiseStage || activeFounder?.company?.currentStage || 'Not set'}
                </p>
              </div>
              {(activeFounder?.company?.brief || activeFounder?.tractionSummary) && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Brief</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {activeFounder?.company?.brief || activeFounder?.tractionSummary}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Marketplace Listing Details */}
          {hasListing ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Marketplace listing
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Raise amount</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrencyInr(listing.raiseAmount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Min. ticket</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrencyInr(listing.minTicket)}
                  </p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Use of funds</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{listing.useOfFunds}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Industry / category
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {listing.industry || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
              <p className="text-sm text-slate-600">
                Share headline metrics, use of funds, and industry tags to go live in the marketplace.
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          You can maintain one live listing at a time. Drafts are saved on the dedicated page.
        </p>
        <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
          <Link
            className="flex items-center justify-center gap-2"
            to="/dashboard/founder/marketplace"
          >
            View marketplace listing
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const SuccessFeeSupport = ({ successRequest }) => {
  const hasRequest = Boolean(successRequest);
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">
        Walk through a guided brief so our capital team can champion your round.
      </p>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Rocket className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">Onboarding: ₹2–3L</p>
              <p className="mt-1 text-sm text-slate-600">
                Initial onboarding fee to get started with our capital team.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">Success fee on final raise</p>
              <p className="mt-1 text-sm text-slate-600">
                Performance-based fee aligned with your fundraising success.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
          {hasRequest ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-900">
                    Request submitted — our team is reviewing.
                  </p>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <p>
                    <span className="font-medium">Round:</span> {successRequest.round || 'Not specified'}
                  </p>
                  <p>
                    <span className="font-medium">Target:</span>{' '}
                    {successRequest.targetAmount
                      ? formatCurrencyInr(successRequest.targetAmount)
                      : 'Not shared'}
                  </p>
                  <p className="text-slate-500">
                    Updated {formatDateDisplay(successRequest.createdAt)}
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="w-full">
                <Link
                  className="flex items-center justify-center gap-2"
                  to="/dashboard/founder/success-fee"
                >
                  Update request
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">
                  Get started with success-fee support
                </p>
                <p className="text-sm text-slate-600">
                  Share stage, traction, and committed capital so the success team can spin up
                  outreach.
                </p>
              </div>
              <div className="space-y-3">
                <Button asChild size="sm" className="w-full">
                  <Link
                    className="flex items-center justify-center gap-2"
                    to="/dashboard/founder/success-fee"
                  >
                    Request success-fee plan
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-slate-500">
                  Requests surface instantly on the admin console for Launch &amp; Lift operators.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const InvestorIntroductions = ({ matches, investors }) => {
  const introductions = matches
    .map((match) => {
      const investor = investors.find((item) => item.id === match.investorId);
      return {
        id: match.investorId,
        fundName: investor?.fundName ?? 'Investor TBD',
        contactName: investor?.contactName ?? 'Launch & Lift team',
        matchScore:
          typeof match.matchScore === 'number' ? Math.round(match.matchScore) : null,
      };
    })
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    .slice(0, 3);
  const hasIntroductions = introductions.length > 0;
  const topMatch = introductions[0] ?? null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">
        Share stage, traction, and committed capital so the success team can spin up outreach.
      </p>

      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-green-50/80 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-base font-semibold text-slate-900">
              Get connected to the right investors
            </p>
            <p className="text-sm text-slate-600">
              Our team reviews your story and metrics to prioritize warm intros aligned with your
              round pace.
            </p>
            {topMatch ? (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-white/80 p-3">
                <p className="text-sm font-semibold text-slate-900">{topMatch.fundName}</p>
                <p className="mt-1 text-xs text-slate-600">
                  Contact: {topMatch.contactName} • Match:{' '}
                  {topMatch.matchScore !== null ? `${topMatch.matchScore}%` : 'Pending'}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {hasIntroductions ? (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Top Matches ({introductions.length})
          </p>
          <ul className="space-y-2">
            {introductions.map((intro) => (
              <li
                key={intro.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{intro.fundName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Contact: {intro.contactName}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {intro.matchScore !== null ? `${intro.matchScore}%` : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
          <p className="text-sm text-slate-600">
            When the next wave of investors is aligned, we will surface curated introductions here
            with match confidence and context.
          </p>
        </div>
      )}

      <Button asChild size="sm" className="w-full">
        <Link className="flex items-center justify-center gap-2" to="/dashboard/founder/success-fee">
          {hasIntroductions ? 'Manage introductions' : 'Request investor introductions'}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

const FounderServices = ({ latestServiceRequest, totalRequests }) => (
  <div className="space-y-5">
    <p className="text-sm text-slate-600">
      Collaborate with vetted specialists on the assets that close your round faster.
    </p>

    {latestServiceRequest ? (
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-violet-50/80 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              Latest request: {latestServiceRequest.serviceType}
            </p>
            <p className="text-xs text-slate-600">
              Urgency {latestServiceRequest.urgency} • Updated{' '}
              {formatDateDisplay(latestServiceRequest.createdAt)} •{' '}
              {totalRequests > 1
                ? `${totalRequests} requests in queue`
                : 'Ready for next collaboration'}
            </p>
          </div>
        </div>
      </div>
    ) : null}

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FOUNDER_SERVICE_DETAILS.slice(0, 6).map((service) => (
        <div
          key={service.id}
          className="group flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-indigo-300 hover:shadow-md"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="text-base font-semibold text-slate-900">{service.title}</p>
              <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                Available
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{service.tagline}</p>
          </div>
          <div className="mt-5 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
              asChild
            >
              <Link to={`/services/${service.slug}`}>Learn more</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link to="/dashboard/founder/services">Request</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50/50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">Need something custom?</p>
        <p className="text-sm text-slate-600">
          Spin up a scoped brief for pitch decks, diligence deep dives, or GTM enablement.
        </p>
      </div>
      <Button asChild size="sm" className="w-full sm:w-auto">
        <Link className="flex items-center justify-center gap-2" to="/dashboard/founder/services">
          Create custom brief
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  </div>
);

export { DashboardLayout };
export default DashboardLayout;
