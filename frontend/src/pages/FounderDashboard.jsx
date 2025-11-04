import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Lock,
  Menu,
  NotebookPen,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { BenchmarkTable } from '../components/BenchmarkTable.jsx';
import { MatchScoreBadge } from '../components/MatchScoreBadge.jsx';
import { showGenericSuccess } from '../lib/emailClientMock.js';
import { formatCurrency, formatCurrencyInr, formatDateDisplay } from '../lib/formatters.js';
import { useFounderExtras } from '../hooks/useFounderExtras.js';
import { FOUNDER_SERVICE_DETAILS } from '../data/founderExtras.js';
import { useAppStore } from '../store/useAppStore.js';
import { persistActiveFounderId, readActiveFounderId } from '../lib/founderSession.js';

const MotionDiv = Motion.div;

const FounderDashboard = () => {
  const { user } = useAuth();
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const saveNotes = useAppStore((state) => state.saveBenchmarkNotes);

  const [activeId, setActiveId] = useState(null);
  const [notes, setNotes] = useState({});
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
      setNotes(activeFounder.benchmarkNotes ?? {});
      persistActiveFounderId(activeFounder.id);
    } else {
      persistActiveFounderId(null);
    }
  }, [activeFounder]);

  if (!activeFounder) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-lilac via-white to-night-soft/60 text-night">
        <BackgroundDecor />
        <div className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-24 text-center sm:px-6">
          <Card className="border-white/70 bg-white/90 p-12 text-night shadow-[0_30px_90px_-40px_rgba(147,112,219,0.25)]">
            <p className="text-sm text-night/70">
              No founder data yet. Submit the intake flow to unlock insights.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  const isPending = activeFounder.status === 'pending';

  const matchPreview = activeFounder.matches
    .map((match) => ({
      match,
      investor: investors.find((investor) => investor.id === match.investorId),
    }))
    .filter((entry) => entry.investor)
    .slice(0, 3);

  const handleSave = () => {
    saveNotes(activeFounder.id, notes);
    showGenericSuccess('Remarks saved (mocked)');
  };

  const listing = extras?.marketplaceListing ?? null;
  const successRequest = extras?.successFeeRequest ?? null;
  const serviceRequests = Array.isArray(extras?.serviceRequests) ? extras.serviceRequests : [];
  const latestServiceRequest = serviceRequests[serviceRequests.length - 1] ?? null;

  const metrics = buildDashboardMetrics({ founder: activeFounder });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-lilac via-white to-night-soft/60 pb-16 text-night">
      <BackgroundDecor />
      <DashboardHeader
        founderName={user?.fullName ?? activeFounder.fullName}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <MobileQuickActions open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="relative mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageTitle founder={activeFounder} isPending={isPending} />
        <DashboardTiles metrics={metrics} />
        <div className="mt-12 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-8">
            <FounderPrimaryCard founder={activeFounder} userFullName={user?.fullName} />
            <InvestorIntroductionsSection isPending={isPending} matchPreview={matchPreview} />
            <BenchmarkNotesSection
              isPending={isPending}
              rows={activeFounder.benchmarks}
              notes={notes}
              onChangeNote={(rowId, note) => setNotes((prev) => ({ ...prev, [rowId]: note }))}
              onSave={handleSave}
            />
          </div>
          <aside className="space-y-8">
            <MarketplacePresenceSection listing={listing} />
            <SuccessFeeSupportSection successRequest={successRequest} />
            <FounderServicesSection
              latestServiceRequest={latestServiceRequest}
              totalRequests={serviceRequests.length}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

const DashboardHeader = ({ founderName, open, onToggle }) => {
  const firstName = typeof founderName === 'string' ? founderName.split(' ')[0] : 'Founder';
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-night/70 hover:text-night lg:hidden"
            onClick={onToggle}
            aria-expanded={open}
            aria-label="Toggle quick actions"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-sm font-semibold text-night shadow-sm shadow-white/60">
            <Building2 className="h-5 w-5 text-royal" />
            Launch &amp; Lift
          </div>
        </div>
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs uppercase tracking-[0.32em] text-night/40">Welcome back</span>
          <span className="text-sm font-semibold text-night">{founderName ?? 'Founder'}</span>
        </div>
        <div className="sm:hidden text-xs uppercase tracking-[0.32em] text-night/50">
          Hey, {firstName}
        </div>
      </div>
    </header>
  );
};

const MobileQuickActions = ({ open, onClose }) => {
  if (!open) return null;
  const links = [
    { to: '/dashboard/founder', label: 'Overview' },
    { to: '/dashboard/founder/marketplace', label: 'Marketplace listing' },
    { to: '/dashboard/founder/success-fee', label: 'Success-fee support' },
    { to: '/dashboard/founder/services', label: 'Founder services' },
  ];
  return (
    <div className="lg:hidden fixed inset-0 z-40 bg-night/40 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-24 rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[0_32px_80px_-48px_rgba(91,33,209,0.28)]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-night">Quick links</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-night/70 hover:text-night">
            Close
          </Button>
        </div>
        <div className="mt-4 grid gap-3">
          {links.map((link) => (
            <Button
              key={link.to}
              asChild
              variant="secondary"
              className="justify-between text-night"
              onClick={onClose}
            >
              <Link to={link.to}>
                {link.label}
                <ArrowRight className="ml-2 h-4 w-4 text-royal" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PageTitle = ({ founder, isPending }) => {
  const createdAt = founder.createdAt ? formatDateDisplay(founder.createdAt) : null;

  return (
    <div className="space-y-4">
      <Badge className="w-fit border-white/70 bg-white/80 text-[0.65rem] tracking-[0.35em] text-night/60 shadow-sm shadow-white/70">
        Founder Dashboard
      </Badge>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold text-night sm:text-4xl">
            Launch plan for {founder.startupName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-night/65">
            Track investor readiness, polish your listings, and collaborate with Launch &amp; Lift
            specialists.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span
            className={`rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
              isPending ? 'text-blossom' : 'text-sprout/80'
            }`}
          >
            {isPending ? 'Pending Review' : 'Approved'}
          </span>
          {createdAt ? (
            <span className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs text-night/60">
              Joined {createdAt}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const tileAccentBackground = {
  royal: 'bg-gradient-to-br from-royal/12 via-white/90 to-white/98 shadow-[0_22px_70px_-48px_rgba(91,33,209,0.45)]',
  blossom:
    'bg-gradient-to-br from-blossom/12 via-white/90 to-white/98 shadow-[0_22px_70px_-48px_rgba(255,79,154,0.42)]',
  sunbeam:
    'bg-gradient-to-br from-sunbeam/14 via-white/90 to-white/98 shadow-[0_22px_70px_-48px_rgba(247,201,72,0.36)]',
  sprout:
    'bg-gradient-to-br from-sprout/12 via-white/90 to-white/98 shadow-[0_22px_70px_-48px_rgba(46,220,146,0.36)]',
};

const tileAccentIcon = {
  royal: 'text-royal/20',
  blossom: 'text-blossom/20',
  sunbeam: 'text-sunbeam/30',
  sprout: 'text-sprout/25',
};

const DashboardTiles = ({ metrics }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
  >
    {metrics.map((metric) => (
      <div
        key={metric.id}
        className={`relative overflow-hidden rounded-2xl border border-white/60 p-5 transition-all hover:-translate-y-1 hover:shadow-[0_28px_80px_-48px_rgba(91,33,209,0.35)] ${tileAccentBackground[metric.accent] ?? tileAccentBackground.royal}`}
      >
        <Sparkles
          className={`absolute -right-2 -top-2 h-16 w-16 ${tileAccentIcon[metric.accent] ?? tileAccentIcon.royal}`}
        />
        <div className="relative z-10 flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.32em] text-night/45">
            {metric.label}
          </span>
          <span className="text-2xl font-semibold text-night">{metric.value}</span>
          {metric.caption ? (
            <span className="text-xs text-night/60">{metric.caption}</span>
          ) : null}
        </div>
      </div>
    ))}
  </MotionDiv>
);

const FounderPrimaryCard = ({ founder, userFullName }) => {
  const founderName = userFullName ?? founder.fullName;
  const chips = [founder.sector, founder.geography, founder.raiseStage].filter(Boolean);
  const raiseTarget =
    typeof founder.raiseAmountUSD === 'number' ? formatCurrency(founder.raiseAmountUSD) : '—';

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-8 text-night shadow-[0_32px_120px_-48px_rgba(147,112,219,0.28)] backdrop-blur-sm lg:flex-row lg:items-start lg:justify-between"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,79,154,0.25),transparent_55%)] opacity-80" />
      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.2em] text-night/60 shadow-sm shadow-white/70">
            <Rocket className="h-4 w-4 text-royal" />
            Ready to Lift
          </span>
          <span className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-night/40">
            Founder view
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-night drop-shadow-[0_6px_20px_rgba(209,196,255,0.6)] sm:text-4xl">
            {founder.startupName}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-night/70">{founder.aiSummary}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-night/60">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/60 bg-white/70 px-3 py-1 shadow-sm shadow-white/70"
            >
              {chip}
            </span>
          ))}
        </div>
        <p className="pt-2 text-xs uppercase tracking-[0.24em] text-night/45">
          Founder • {founderName}
        </p>
      </div>
      <div className="relative z-10 flex w-full flex-col justify-between rounded-2xl border border-white/60 bg-gradient-to-br from-royal/10 via-white/80 to-sunbeam/20 px-6 py-5 text-right shadow-inner shadow-white/60 sm:max-w-xs">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-night/50">Raise target</p>
          <p className="mt-3 text-3xl font-semibold text-night">{raiseTarget}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.32em] text-night/45">
            {founder.raiseStage ?? 'Stage TBD'}
          </p>
        </div>
        <div className="mt-6 space-y-3 text-sm text-night/70">
          <p>
            Team size:{' '}
            <span className="font-semibold text-night">{founder.teamSize ?? '—'}</span>
          </p>
          <p>
            Revenue run rate:{' '}
            <span className="font-semibold text-night">
              {typeof founder.revenueRunRateUSD === 'number'
                ? formatCurrency(founder.revenueRunRateUSD)
                : '—'}
            </span>
          </p>
        </div>
      </div>
    </MotionDiv>
  );
};

const InvestorIntroductionsSection = ({ matchPreview, isPending }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.08 }}
    className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-8 text-night shadow-[0_36px_120px_-70px_rgba(91,33,209,0.25)]"
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,220,146,0.18),transparent_60%)] opacity-80" />
    <div className="relative z-10 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-night">Investor introductions</h3>
          <p className="text-sm text-night/65">
            Your warmest investors surfaced by Launch &amp; Lift’s matching engine.
          </p>
        </div>
        {isPending ? (
          <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-xs uppercase tracking-[0.2em] text-night/60 shadow-sm shadow-white/70">
            <Lock className="h-4 w-4 text-royal" />
            Awaiting approval
          </div>
        ) : (
          <Button
            asChild
            variant="secondary"
            className="w-full justify-center text-night md:w-auto"
          >
            <Link to="/dashboard/founder/marketplace">
              View marketplace insights
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {matchPreview.map(({ match, investor }) => (
          <div
            key={match.investorId}
            className="rounded-2xl border border-white/70 bg-white/85 p-5 text-night shadow-inner shadow-white/60"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-night">{investor.fundName}</h4>
              <MatchScoreBadge score={match.matchScore} />
            </div>
            <p className="mt-3 text-sm text-night/70">{investor.thesis}</p>
            <div className="mt-4 flex flex-wrap gap-1 text-xs text-night/60">
              {investor.stageFocus.map((stage) => (
                <span
                  key={stage}
                  className="rounded-full border border-white/70 bg-white/75 px-2 py-0.5"
                >
                  {stage}
                </span>
              ))}
            </div>
          </div>
        ))}
        {matchPreview.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-night/15 bg-white/70 p-6 text-sm text-night/60">
            Matches will appear here once our team confirms investor alignment for your raise.
          </div>
        ) : null}
      </div>
    </div>
    {isPending ? (
      <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/75 text-sm text-night/70 backdrop-blur">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-royal" />
          Intros unlock after Launch &amp; Lift approval.
        </div>
      </div>
    ) : null}
  </MotionDiv>
);

const MarketplacePresenceSection = ({ listing }) => {
  const hasListing = Boolean(listing);
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="h-full border-white/70 bg-white/92 text-night shadow-[0_28px_90px_-60px_rgba(91,33,209,0.35)]">
        <CardHeader className="space-y-3">
          <CardTitle className="text-xl text-night">Marketplace presence</CardTitle>
          <p className="text-sm text-night/65">
            Keep your raise profile polished before we surface you to Launch &amp; Lift investors.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className={`text-sm font-semibold ${hasListing ? 'text-royal' : 'text-night/50'}`}>
              {hasListing ? 'Active listing' : 'Awaiting your listing'}
            </p>
            <p className="mt-1 text-xs text-night/55">
              {hasListing
                ? `Last updated ${formatDateDisplay(listing.lastUpdated)}`
                : 'Publish your raise details to appear in the marketplace.'}
            </p>
          </div>
          {hasListing ? (
            <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-xs text-night/70 shadow-inner shadow-white/60">
              <div className="flex items-center justify-between">
                <span className="text-night/50">Raise amount</span>
                <span className="font-semibold text-night">
                  {formatCurrencyInr(listing.raiseAmount)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-night/50">Min. ticket</span>
                <span className="font-semibold text-night">
                  {formatCurrencyInr(listing.minTicket)}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-night/50">Use of funds</p>
                <p className="mt-1 text-night/70">{listing.useOfFunds}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-night/50">Industry / category</span>
                <span className="font-semibold text-night">{listing.industry || 'Not set'}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-night/60">
              Set up your first listing to appear in our curated founder marketplace.
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
          <p className="text-xs text-night/55">
            You can maintain one live listing at a time. Drafts are saved automatically.
          </p>
        </CardContent>
      </Card>
    </MotionDiv>
  );
};

const SuccessFeeSupportSection = ({ successRequest }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.14 }}
  >
    <Card className="h-full border-white/70 bg-white/92 text-night shadow-[0_28px_90px_-60px_rgba(91,33,209,0.35)]">
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl text-night">Success-fee raise support</CardTitle>
        <p className="text-sm text-night/65">
          Share traction and target amounts so our capital team can champion your round.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2 text-xs text-night/70">
          {['Onboarding ₹2–3L', 'Success fee on final raise', 'Warm investor intros'].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[0.7rem] text-night/70 shadow-sm shadow-white/70"
            >
              {chip}
            </span>
          ))}
        </div>
        {successRequest ? (
          <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-xs text-night/70 shadow-inner shadow-white/60">
            <p className="font-semibold text-royal">Request submitted — our team is reviewing.</p>
            <p className="mt-1 text-night/60">
              Round: {successRequest.round} • Target:{' '}
              {successRequest.targetAmount
                ? formatCurrencyInr(successRequest.targetAmount)
                : 'Not shared'}
            </p>
            <p className="mt-1 text-night/55">
              Updated {formatDateDisplay(successRequest.createdAt)} • Revisit anytime to edit.
            </p>
          </div>
        ) : (
          <p className="text-sm text-night/60">
            Walk through a guided brief so the success team can spin up outreach quickly.
          </p>
        )}
        <Button asChild className="w-full">
          <Link
            className="flex items-center justify-center gap-2"
            to="/dashboard/founder/success-fee"
          >
            {successRequest ? 'Update success-fee request' : 'Request success-fee plan'}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
        <p className="text-xs text-night/55">
          Requests surface instantly on the Launch &amp; Lift operator console.
        </p>
      </CardContent>
    </Card>
  </MotionDiv>
);

const FounderServicesSection = ({ latestServiceRequest, totalRequests }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.18 }}
  >
    <Card className="h-full border-white/70 bg-white/92 text-night shadow-[0_28px_90px_-60px_rgba(91,33,209,0.35)]">
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl text-night">Founder services studio</CardTitle>
        <p className="text-sm text-night/65">
          Collaborate with vetted specialists on the assets that close your round faster.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <ul className="grid gap-3 text-sm text-night/70">
          {FOUNDER_SERVICE_DETAILS.slice(0, 3).map((service) => (
            <li
              key={service.id}
              className="flex flex-col gap-1 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-night shadow-inner shadow-white/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-night">{service.title}</span>
                <span className="text-[0.7rem] uppercase tracking-[0.25em] text-royal">Ready</span>
              </div>
              <p className="text-xs text-night/60">{service.tagline}</p>
            </li>
          ))}
        </ul>
        {latestServiceRequest ? (
          <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-xs text-night/70 shadow-inner shadow-white/60">
            <p className="font-semibold text-royal">Last request</p>
            <p className="mt-1 text-night/60">
              {latestServiceRequest.serviceType} • Urgency {latestServiceRequest.urgency}
            </p>
            <p className="mt-1 text-night/55">
              Updated {formatDateDisplay(latestServiceRequest.createdAt)} •{' '}
              {totalRequests > 1
                ? `${totalRequests} requests in queue`
                : 'Ready for next collaboration'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-night/60">
            Spin up a scoped brief for pitch decks, diligence prep, or GTM enablement.
          </p>
        )}
        <Button asChild className="w-full">
          <Link className="flex items-center justify-center gap-2" to="/dashboard/founder/services">
            {latestServiceRequest ? 'Manage service requests' : 'Request a founder service'}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
        <p className="text-xs text-night/55">
          All collaboration threads now live on the services page for easy follow-up.
        </p>
      </CardContent>
    </Card>
  </MotionDiv>
);

const BenchmarkNotesSection = ({ isPending, rows, notes, onChangeNote, onSave }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.12 }}
    className="space-y-6"
  >
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-2xl font-semibold text-night">Benchmark notes</h3>
        <p className="text-sm text-night/65">Add context before investors review your metrics.</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-night/60">
        <NotebookPen className="h-4 w-4" />
        Shared with Launch &amp; Lift team
      </div>
    </div>
    <BenchmarkTable
      rows={rows}
      founderNotes={notes}
      onChangeNote={onChangeNote}
      onSave={onSave}
      isDisabled={isPending}
    />
    {isPending ? (
      <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-blossom/10 px-5 py-4 text-sm text-night/75">
        <Lock className="h-4 w-4 text-royal" />
        Benchmark notes can be edited, but matches remain locked until approval.
      </div>
    ) : null}
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
      accent: 'blossom',
    },
    {
      id: 'raise-target',
      label: 'Raise target',
      value: raiseTarget,
      caption: founder.raiseStage ? `${founder.raiseStage} round` : 'Stage to confirm',
      accent: 'royal',
    },
    {
      id: 'run-rate',
      label: 'Revenue run rate',
      value: runRate,
      caption: 'Trailing 12 months',
      accent: 'sunbeam',
    },
    {
      id: 'warm-intros',
      label: 'Warm introductions',
      value: `${matchesCount} ready`,
      caption: matchesCount > 0 ? 'Best fit investors curated' : 'Awaiting intro approvals',
      accent: 'sprout',
    },
  ];
};

const BackgroundDecor = () => (
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white/85 to-lilac/40" />
    <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-blossom/35 blur-[180px]" />
    <div className="absolute -bottom-48 -right-24 h-[520px] w-[520px] rounded-full bg-sunbeam/35 blur-[220px]" />
    <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white via-white/40 to-transparent" />
  </div>
);

export default FounderDashboard;
