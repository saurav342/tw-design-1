import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowUpRight, Building2, Menu, Rocket } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
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
      <DashboardHeader
        founderName={founderName}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <MobileDashboardNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle founder={activeFounder} founderName={founderName} />
        <FounderSummaryCard founder={activeFounder} />
        <DashboardTiles metrics={metrics} />

        <div className="mt-10 space-y-8">
          <MarketplacePresence listing={listing} />
          <SuccessFeeSupport successRequest={successRequest} />
          <FounderServices latestServiceRequest={latestServiceRequest} totalRequests={serviceRequests.length} />
        </div>
      </main>
    </div>
  );
};

const DashboardHeader = ({ founderName, open, onToggle }) => {
  const firstName = founderName.split(' ')[0] ?? 'Founder';
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:text-slate-900 lg:hidden"
            onClick={onToggle}
            aria-expanded={open}
            aria-label="Toggle dashboard navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm">
            <Building2 className="h-5 w-5 text-royal" />
            Launch &amp; Lift
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Founder dashboard</p>
          <p className="text-sm font-semibold text-slate-800">{founderName}</p>
        </div>
        <div className="sm:hidden text-xs uppercase tracking-[0.26em] text-slate-500">
          Hey, {firstName}
        </div>
      </div>
    </header>
  );
};

const MobileDashboardNav = ({ open, onClose }) => {
  if (!open) return null;

  const links = [
    { to: '/dashboard/founder', label: 'Overview' },
    { to: '/dashboard/founder/marketplace', label: 'Marketplace' },
    { to: '/dashboard/founder/success-fee', label: 'Success-fee support' },
    { to: '/dashboard/founder/services', label: 'Founder services' },
  ];

  return (
    <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">Quick links</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-800"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
        <div className="mt-4 grid gap-3">
          {links.map((link) => (
            <Button
              key={link.to}
              asChild
              variant="secondary"
              className="justify-between border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              onClick={onClose}
            >
              <Link to={link.to}>
                {link.label}
                <ArrowUpRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PageTitle = ({ founder, founderName }) => {
  const createdAt = founder.createdAt ? formatDateDisplay(founder.createdAt) : null;
  const isPending = founder.status === 'pending';

  return (
    <div className="space-y-3">
      <Badge className="w-fit border border-royal/20 bg-royal/10 px-4 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-royal">
        Founder dashboard
      </Badge>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Launch plan for {founder.startupName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Manage your fundraising workflow, keep listings polished, and collaborate with Launch
            &amp; Lift operators.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] ${
              isPending
                ? 'border-amber-200 bg-amber-100 text-amber-700'
                : 'border-sprout/40 bg-sprout/10 text-sprout/70'
            }`}
          >
            {isPending ? 'Pending review' : 'Approved'}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
            Founder: {founderName}
          </span>
          {createdAt ? (
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
              Joined {createdAt}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

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

const FounderSummaryCard = ({ founder }) => {
  const chips = [founder.sector, founder.geography, founder.raiseStage].filter(Boolean);
  const raiseTarget =
    typeof founder.raiseAmountUSD === 'number' ? formatCurrency(founder.raiseAmountUSD) : '—';
  const runRate =
    typeof founder.revenueRunRateUSD === 'number'
      ? formatCurrency(founder.revenueRunRateUSD)
      : '—';

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-royal/20 bg-royal/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-royal">
            <Rocket className="h-4 w-4 text-royal" />
            Ready to lift
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">{founder.startupName}</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">{founder.aiSummary}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-slate-200 bg-gray-50 px-3 py-1 uppercase tracking-[0.2em]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:text-right">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Raise target</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{raiseTarget}</p>
            <p className="mt-1 text-xs text-slate-500">
              {founder.raiseStage ? `${founder.raiseStage} round` : 'Stage to confirm'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Revenue run rate</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{runRate}</p>
            <p className="mt-1 text-xs text-slate-500">
              Team size {founder.teamSize ?? '—'} • ARR outlook
            </p>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

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
