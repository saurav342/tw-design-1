import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowUpRight, BarChart3, Briefcase, Building2, Menu, Rocket, Users } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { formatCurrency, formatCurrencyInr, formatDateDisplay } from '../lib/formatters.js';
import { useFounderExtras } from '../hooks/useFounderExtras.js';
import { FOUNDER_SERVICE_DETAILS } from '../data/founderExtras.js';
import { useAppStore } from '../store/useAppStore.js';
import { persistActiveFounderId, readActiveFounderId } from '../lib/founderSession.js';

const MotionDiv = Motion.div;

const DashboardLayout = () => {
  const { user } = useAuth();
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);

  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveId(readActiveFounderId());
  }, []);

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
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
              aria-pressed={sidebarOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Building2 className="h-6 w-6 text-indigo-600" />
            <span className="text-xl text-slate-900">Launch &amp; Lift</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-700">
            <span className="hidden sm:block text-gray-600">Welcome back,</span>
            <span className="font-medium">{founderName}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Page Title */}
          <PageTitle />

          {/* Dashboard Tiles */}
          <DashboardTiles
            listing={listing}
            successRequest={successRequest}
            matches={matches}
            serviceRequests={serviceRequests}
          />

          {/* Dashboard Sections */}
          <MarketplacePresence listing={listing} />
          <SuccessFeeSupport successRequest={successRequest} />
          <InvestorIntroductions matches={matches} investors={investors} />
          <FounderServices
            latestServiceRequest={latestServiceRequest}
            totalRequests={serviceRequests.length}
          />
        </div>
      </main>
    </div>
  );
};

const PageTitle = () => (
  <div>
    <h1 className="text-3xl font-semibold text-slate-900">Founder Dashboard</h1>
    <p className="mt-2 text-sm text-slate-600">
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
      href: '/dashboard/founder/marketplace',
      status: listing ? 'Active' : 'Draft',
      bg: 'from-sky-500 to-blue-600',
      icon: BarChart3,
    },
    {
      id: 'success-fee',
      title: 'Success-fee raise support',
      description: successRequest
        ? 'Brief submitted to the capital team.'
        : 'Share your traction for hands-on support.',
      href: '/dashboard/founder/success-fee',
      status: successRequest ? 'In review' : 'Get started',
      bg: 'from-violet-500 to-indigo-600',
      icon: Rocket,
    },
    {
      id: 'investor-intros',
      title: 'Investor introductions',
      description:
        matches.length > 0
          ? `Warm intros queued for ${matches.length} investors.`
          : 'Line up curated intros matched to your round.',
      href: '/dashboard/founder/investors',
      status: matches.length > 0 ? 'Ready' : 'Pending',
      bg: 'from-emerald-500 to-green-600',
      icon: Users,
    },
    {
      id: 'services',
      title: 'Founder services studio',
      description:
        serviceRequests.length > 0
          ? `${serviceRequests.length} request${serviceRequests.length > 1 ? 's' : ''} in motion.`
          : 'Spin up support for pitch, diligence, and GTM.',
      href: '/dashboard/founder/services',
      status: 'Available',
      bg: 'from-indigo-500 to-purple-600',
      icon: Briefcase,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile, index) => {
        const Icon = tile.icon;
        return (
          <MotionDiv
            key={tile.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${tile.bg} p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-white/15 p-2">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                {tile.status}
              </span>
            </div>
            <h2 className="mt-6 text-lg font-semibold">{tile.title}</h2>
            <p className="mt-2 text-sm text-white/80">{tile.description}</p>
            <Button asChild variant="secondary" className="mt-6 w-full bg-white text-slate-900 hover:bg-white/90">
              <Link className="flex items-center justify-center gap-2" to={tile.href}>
                View details
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </MotionDiv>
        );
      })}
    </div>
  );
};

const MarketplacePresence = ({ listing }) => {
  const hasListing = Boolean(listing);
  const lastUpdated =
    hasListing && listing?.lastUpdated ? formatDateDisplay(listing.lastUpdated) : 'Not updated';

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
    >
      <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl text-slate-900">Marketplace presence</CardTitle>
            <p className="text-sm text-slate-600">
              Keep your raise details polished before we surface you to Launch &amp; Lift investors.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full text-slate-700 hover:text-slate-900 lg:w-auto"
          >
            <Link to="/dashboard/founder/marketplace">Edit listing</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-slate-900">
                {hasListing ? 'Active listing' : 'No listing yet'}
              </p>
              <p className="text-xs text-slate-500">
                {hasListing ? `Last updated: ${lastUpdated}` : 'Publish your raise profile to go live.'}
              </p>
            </div>
            <span
              className={`flex h-8 items-center rounded-full px-4 text-xs font-semibold uppercase tracking-[0.2em] ${
                hasListing
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {hasListing ? 'Active' : 'Draft'}
            </span>
          </div>

          {hasListing ? (
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-700 shadow-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Raise amount</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {formatCurrencyInr(listing.raiseAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Min. ticket</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {formatCurrencyInr(listing.minTicket)}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Use of funds</p>
                <p className="mt-2 text-sm text-slate-700">{listing.useOfFunds}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Industry / category
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {listing.industry || 'Not set'}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-5 text-sm text-slate-600">
              Share headline metrics, use of funds, and industry tags to go live in the marketplace.
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              You can maintain one live listing at a time. Drafts are saved on the dedicated page.
            </p>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link
                className="flex items-center justify-center gap-2"
                to="/dashboard/founder/marketplace"
              >
                View marketplace listing
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
};

const SuccessFeeSupport = ({ successRequest }) => {
  const hasRequest = Boolean(successRequest);
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 }}
    >
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-slate-900">Success-fee raise support</CardTitle>
          <p className="text-sm text-slate-600">
            Walk through a guided brief so our capital team can champion your round.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="space-y-4 rounded-3xl border border-indigo-200 bg-indigo-50/60 px-6 py-5 text-sm text-indigo-900">
              <div>
                <p className="flex items-center gap-2 text-base font-semibold">
                  <Rocket className="h-4 w-4" />
                  Onboarding: ₹2–3L
                </p>
                <p className="mt-1 text-sm text-indigo-800/80">
                  Initial onboarding fee to get started with our capital team.
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-base font-semibold">
                  <BarChart3 className="h-4 w-4" />
                  Success fee on final raise
                </p>
                <p className="mt-1 text-sm text-indigo-800/80">
                  Performance-based fee aligned with your fundraising success.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-sm text-slate-700">
              {hasRequest ? (
                <>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Request submitted — our team is reviewing.
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Round: {successRequest.round || 'Not specified'} • Target:{' '}
                      {successRequest.targetAmount
                        ? formatCurrencyInr(successRequest.targetAmount)
                        : 'Not shared'}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Updated {formatDateDisplay(successRequest.createdAt)} • Edit details anytime.
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <Link
                      className="flex items-center justify-center gap-2"
                      to="/dashboard/founder/success-fee"
                    >
                      Update success-fee request
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Investor introductions
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Share stage, traction, and committed capital so the success team can spin up
                      outreach.
                    </p>
                  </div>
                  <Button asChild className="w-full">
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
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
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

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.14 }}
    >
      <Card className="border border-slate-200 bg-white text-slate-800 shadow-sm">
        <CardHeader className="space-y-3">
          <CardTitle className="text-xl text-slate-900">Investor introductions</CardTitle>
          <p className="text-sm text-slate-600">
            Track warm intros and prioritize outreach with the highest match confidence.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasIntroductions ? (
            <ul className="space-y-3">
              {introductions.map((intro) => (
                <li
                  key={intro.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{intro.fundName}</p>
                    <p className="text-xs text-slate-500">Contact: {intro.contactName}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">
                    {intro.matchScore !== null ? `${intro.matchScore}% match` : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              When Launch &amp; Lift lines up the next wave of investors, they will appear here with
              match confidence and contact details.
            </p>
          )}

          <Button asChild className="w-full">
            <Link className="flex items-center justify-center gap-2" to="/dashboard/founder/investors">
              {hasIntroductions ? 'Manage investor introductions' : 'View investor network'}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </MotionDiv>
  );
};

const FounderServices = ({ latestServiceRequest, totalRequests }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.16 }}
  >
    <Card className="border border-slate-200 bg-white text-slate-800 shadow-sm">
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl text-slate-900">Founder services studio</CardTitle>
        <p className="text-sm text-slate-600">
          Collaborate with vetted operators on the assets that close your round faster.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="grid gap-3 text-sm text-slate-600">
          {FOUNDER_SERVICE_DETAILS.slice(0, 4).map((service) => (
            <li
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{service.title}</span>
                <span className="text-[0.7rem] uppercase tracking-[0.25em] text-royal">Available</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{service.tagline}</p>
            </li>
          ))}
        </ul>

        {latestServiceRequest ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-slate-600">
            <p className="font-semibold text-royal">Last request</p>
            <p className="mt-2 text-xs text-slate-500">
              {latestServiceRequest.serviceType} • Urgency {latestServiceRequest.urgency}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Updated {formatDateDisplay(latestServiceRequest.createdAt)} •{' '}
              {totalRequests > 1
                ? `${totalRequests} requests in queue`
                : 'Ready for next collaboration'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Spin up a scoped brief for pitch decks, diligence prep, product polish, or GTM enablement.
          </p>
        )}

        <Button asChild className="w-full">
          <Link className="flex items-center justify-center gap-2" to="/dashboard/founder/services">
            {latestServiceRequest ? 'Manage service requests' : 'Request a founder service'}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </MotionDiv>
);

export { DashboardLayout };
export default DashboardLayout;
