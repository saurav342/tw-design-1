import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowUpRight, Building2, Menu } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { formatCurrency, formatCurrencyInr, formatDateDisplay } from '../lib/formatters.js';
import { useFounderExtras } from '../hooks/useFounderExtras.js';
import { FOUNDER_SERVICE_DETAILS } from '../data/founderExtras.js';
import { useAppStore } from '../store/useAppStore.js';
import { persistActiveFounderId, readActiveFounderId } from '../lib/founderSession.js';

const MotionDiv = Motion.div;

const FounderDashboard = () => {
  const { user } = useAuth();
  const founders = useAppStore((state) => state.founders);

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

  const metrics = buildDashboardMetrics({ founder: activeFounder });
  const listing = extras?.marketplaceListing ?? null;
  const successRequest = extras?.successFeeRequest ?? null;
  const serviceRequests = Array.isArray(extras?.serviceRequests) ? extras.serviceRequests : [];
  const latestServiceRequest = serviceRequests.at(-1) ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <PageTitle founderName={founderName} />
          <DashboardTiles metrics={metrics} />

          <MarketplacePresence listing={listing} />
          <SuccessFeeSupport successRequest={successRequest} />
          <FounderServices
            latestServiceRequest={latestServiceRequest}
            totalRequests={serviceRequests.length}
          />
        </div>
      </main>
    </div>
  );
};

const PageTitle = ({ founderName }) => (
  <div>
    <h1 className="text-3xl font-semibold text-slate-900">Founder Dashboard</h1>
    <p className="mt-2 text-sm text-gray-600">
      Manage your fundraising journey and access expert support from the Launch &amp; Lift team,
      tailored to {founderName}.
    </p>
  </div>
);

const DashboardTiles = ({ metrics }) => (
  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {metrics.map((metric) => (
      <MotionDiv
        key={metric.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{metric.label}</p>
        <p className="mt-3 text-2xl font-semibold text-slate-900">{metric.value}</p>
        {metric.caption ? (
          <p className="mt-2 text-xs text-slate-500">{metric.caption}</p>
        ) : null}
      </MotionDiv>
    ))}
  </div>
);

const MarketplacePresence = ({ listing }) => {
  const hasListing = Boolean(listing);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
    >
      <Card className="border border-slate-200 bg-white text-slate-800 shadow-sm">
        <CardHeader className="space-y-3">
          <CardTitle className="text-xl text-slate-900">Marketplace presence</CardTitle>
          <p className="text-sm text-slate-600">
            Keep your raise profile polished before Launch &amp; Lift surfaces you to curated
            investors.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className={`text-sm font-semibold ${hasListing ? 'text-royal' : 'text-slate-500'}`}>
              {hasListing ? 'Active listing' : 'No listing yet'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {hasListing
                ? `Last updated ${formatDateDisplay(listing.lastUpdated)}`
                : 'Publish your raise details to appear in the founder marketplace.'}
            </p>
          </div>

          {hasListing ? (
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-slate-600">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Raise amount</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrencyInr(listing.raiseAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Min. ticket</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrencyInr(listing.minTicket)}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Use of funds</p>
                <p className="mt-1 text-sm text-slate-700">{listing.useOfFunds}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Industry / category</span>
                <span className="font-semibold text-slate-800">{listing.industry || 'Not set'}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Share headline metrics, use of funds, and industry tags to go live in the marketplace.
            </p>
          )}

          <Button asChild className="w-full">
            <Link
              className="flex items-center justify-center gap-2"
              to="/dashboard/founder/marketplace"
            >
              {hasListing ? 'View marketplace listing' : 'Create marketplace listing'}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </MotionDiv>
  );
};

const SuccessFeeSupport = ({ successRequest }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.12 }}
  >
    <Card className="border border-slate-200 bg-white text-slate-800 shadow-sm">
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl text-slate-900">Success-fee raise support</CardTitle>
        <p className="text-sm text-slate-600">
          Submit a brief so the Launch &amp; Lift capital team can champion your round.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {['Onboarding ₹2–3L', 'Success fee on final raise', 'Warm investor intros'].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 uppercase tracking-[0.2em]"
            >
              {chip}
            </span>
          ))}
        </div>

        {successRequest ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-slate-600">
            <p className="font-semibold text-royal">Request submitted — our team is reviewing.</p>
            <p className="mt-2 text-xs text-slate-500">
              Round: {successRequest.round} • Target:{' '}
              {successRequest.targetAmount
                ? formatCurrencyInr(successRequest.targetAmount)
                : 'Not shared'}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Updated {formatDateDisplay(successRequest.createdAt)} • Edit details anytime.
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Walk through the guided brief to capture traction, committed capital, and round targets.
          </p>
        )}

        <Button asChild className="w-full">
          <Link className="flex items-center justify-center gap-2" to="/dashboard/founder/success-fee">
            {successRequest ? 'Update success-fee request' : 'Request success-fee plan'}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </MotionDiv>
);

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

const buildDashboardMetrics = ({ founder }) => {
  const readinessScores = Array.isArray(founder.readiness)
    ? founder.readiness.map((stat) => stat.score)
    : [];
  const averageReadiness = readinessScores.length
    ? Math.round(readinessScores.reduce((acc, value) => acc + value, 0) / readinessScores.length)
    : null;
  const raiseTarget =
    typeof founder.raiseAmountUSD === 'number' ? formatCurrency(founder.raiseAmountUSD) : '—';
  const runRate =
    typeof founder.revenueRunRateUSD === 'number'
      ? formatCurrency(founder.revenueRunRateUSD, { maximumFractionDigits: 0 })
      : '—';
  const matchesCount = Array.isArray(founder.matches) ? founder.matches.length : 0;

  return [
    {
      id: 'readiness',
      label: 'Readiness score',
      value: averageReadiness !== null ? `${averageReadiness}/100` : '—',
      caption: 'Composite of traction, market, and product signals',
    },
    {
      id: 'raise-target',
      label: 'Raise target',
      value: raiseTarget,
      caption: founder.raiseStage ? `${founder.raiseStage} round` : 'Stage to confirm',
    },
    {
      id: 'run-rate',
      label: 'Revenue run rate',
      value: runRate,
      caption: 'Trailing 12 months',
    },
    {
      id: 'warm-intros',
      label: 'Warm introductions',
      value: `${matchesCount} ready`,
      caption: matchesCount > 0 ? 'Investors aligned with your round' : 'Awaiting intro approvals',
    },
  ];
};

export default FounderDashboard;
