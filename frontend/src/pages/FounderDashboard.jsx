import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowUpRight, Lock, NotebookPen, Rocket } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { CardStat } from '../components/CardStat.jsx';
import { BenchmarkTable } from '../components/BenchmarkTable.jsx';
import { MatchScoreBadge } from '../components/MatchScoreBadge.jsx';
import { showGenericSuccess } from '../lib/emailClientMock.js';
import { formatCurrency, formatCurrencyInr, formatDateDisplay } from '../lib/formatters.js';
import { useFounderExtras } from '../hooks/useFounderExtras.js';
import { FOUNDER_SERVICE_DETAILS } from '../data/founderExtras.js';
import { useAppStore } from '../store/useAppStore.js';
import { persistActiveFounderId, readActiveFounderId } from '../lib/founderSession.js';

const FounderDashboard = () => {
  const { user } = useAuth();
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const saveNotes = useAppStore((state) => state.saveBenchmarkNotes);
  const [activeId, setActiveId] = useState(null);

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

  const [notes, setNotes] = useState(activeFounder?.benchmarkNotes ?? {});

  useEffect(() => {
    if (activeFounder) {
      setNotes(activeFounder.benchmarkNotes ?? {});
      persistActiveFounderId(activeFounder.id);
    } else {
      persistActiveFounderId(null);
    }
  }, [activeFounder]);

  const BackgroundDecor = () => (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white/85 to-lilac/40" />
      <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-blossom/35 blur-[180px]" />
      <div className="absolute -bottom-48 -right-24 h-[520px] w-[520px] rounded-full bg-sunbeam/35 blur-[220px]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white via-white/40 to-transparent" />
    </div>
  );

  if (!activeFounder) {
    return (
      <section className="relative overflow-hidden pb-20">
        <BackgroundDecor />
        <div className="relative mx-auto max-w-5xl px-4 pt-12 text-night sm:px-6 lg:px-8">
          <Card className="border-white/70 bg-white/90 p-12 text-center text-night shadow-[0_30px_90px_-40px_rgba(147,112,219,0.25)]">
            <p>No founder data yet. Submit the intake flow to unlock insights.</p>
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

  return (
    <section className="relative overflow-hidden pb-20">
      <BackgroundDecor />
      <div className="relative mx-auto max-w-7xl space-y-12 px-4 pt-12 text-night sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-8 text-night shadow-[0_32px_120px_-48px_rgba(147,112,219,0.28)] backdrop-blur-sm md:flex-row md:items-center md:justify-between"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,79,154,0.25),transparent_55%)] opacity-80" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.2em] text-night/60 shadow-sm shadow-white/70">
              <Rocket className="h-4 w-4 text-royal" />
              Ready to Lift
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-night drop-shadow-[0_6px_20px_rgba(209,196,255,0.6)]">
              {activeFounder.startupName}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-night/70">
              {activeFounder.aiSummary}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-royal/80">
              Founder: {user?.fullName ?? activeFounder.fullName}
            </p>
          </div>
          <div className="relative z-10 h-full rounded-2xl border border-royal/20 bg-gradient-to-br from-royal/10 via-white/70 to-sunbeam/20 px-6 py-4 text-right text-sm text-night shadow-inner shadow-white/60">
            <p className="uppercase tracking-[0.18em] text-royal/70">Raise Target</p>
            <p className="mt-2 text-3xl font-semibold text-night">
              {formatCurrency(activeFounder.raiseAmountUSD)}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-royal/70">
              {activeFounder.raiseStage}
            </p>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid gap-6 md:grid-cols-4"
        >
          {activeFounder.readiness.map((stat, index) => (
            <CardStat
              key={stat.id}
              label={stat.label}
              value={stat.score}
              accent={index % 3 === 0 ? 'indigo' : index % 3 === 1 ? 'emerald' : 'fuchsia'}
            />
          ))}
        </Motion.div>

        <AdditionalFundingSection extras={extras} />

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-night">Benchmark Notes</h2>
            <div className="flex items-center gap-2 text-sm text-night/60">
              <NotebookPen className="h-4 w-4" />
              Investor-facing view with your context
            </div>
          </div>
          <BenchmarkTable
            rows={activeFounder.benchmarks}
            founderNotes={notes}
            onChangeNote={(rowId, note) => setNotes((prev) => ({ ...prev, [rowId]: note }))}
            onSave={handleSave}
            isDisabled={isPending}
          />
          {isPending ? (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-300/40 bg-amber-400/15 px-5 py-4 text-sm text-amber-100">
              <Lock className="h-4 w-4" /> Benchmark notes can be edited but matches remain locked until approval.
            </div>
          ) : null}
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="relative overflow-hidden border-white/70 bg-white/95 text-night shadow-[0_36px_120px_-70px_rgba(91,33,209,0.25)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,220,146,0.18),transparent_60%)] opacity-80" />
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="relative z-10">
                <CardTitle className="text-2xl text-night">Investor Match Preview</CardTitle>
                <p className="text-sm text-night/65">
                  Top aligned funds for your raise. Admin will send intros once approved.
                </p>
              </div>
              {isPending ? (
                <div className="relative z-10 flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-xs uppercase tracking-[0.2em] text-night/60 shadow-sm shadow-white/70">
                  <Lock className="h-4 w-4 text-royal" /> Matches locked pending review
                </div>
              ) : null}
            </CardHeader>
            <CardContent className="relative z-10 grid gap-4 md:grid-cols-3">
              {matchPreview.map(({ match, investor }) => (
                <div key={match.investorId} className="rounded-2xl border border-white/70 bg-white/85 p-5 text-night shadow-inner shadow-white/60">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-night">
                      {investor.fundName}
                    </h3>
                    <MatchScoreBadge score={match.matchScore} />
                  </div>
                  <p className="mt-2 text-sm text-night/70">{investor.thesis}</p>
                  <div className="mt-4 flex flex-wrap gap-1 text-xs text-night/60">
                    {investor.stageFocus.map((stage) => (
                      <span key={stage} className="rounded-full border border-white/70 bg-white/75 px-2 py-0.5">
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {matchPreview.length === 0 ? (
                <p className="text-sm text-night/65">
                  Matches will appear here once investors share aligned theses.
                </p>
              ) : null}
            </CardContent>
            {isPending ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/75 text-sm text-night/70 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-royal" />
                  Awaiting Launch & Lift approval to unlock investor outreach.
                </div>
              </div>
            ) : null}
          </Card>
        </Motion.div>
      </div>
    </section>
  );
};

const AdditionalFundingSection = ({ extras }) => {
  const listing = extras?.marketplaceListing ?? null;
  const hasListing = Boolean(listing);
  const listingStatus = hasListing
    ? `Active • Last updated: ${formatDateDisplay(listing.lastUpdated)}`
    : 'No active listing yet';
  const successRequest = extras?.successFeeRequest ?? null;
  const serviceRequests = Array.isArray(extras?.serviceRequests) ? extras.serviceRequests : [];
  const latestServiceRequest = serviceRequests[serviceRequests.length - 1] ?? null;

  return (
    <Motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="rounded-3xl border border-white/60 bg-white/90 p-8 text-night shadow-[0_32px_90px_-48px_rgba(91,33,209,0.18)] backdrop-blur-sm"
    >
      <div className="space-y-3">
        <Badge className="w-fit border-white/70 bg-white/85 text-[0.65rem] tracking-[0.35em] text-night/60 shadow-sm shadow-white/70">
          New
        </Badge>
        <div>
          <h2 className="text-2xl font-semibold text-night">Grow your raise with Launch & Lift</h2>
          <p className="mt-1 max-w-2xl text-sm text-night/70">
            Each service now has a dedicated workspace with richer context. Explore the detail pages
            to manage listings, request capital support, or collaborate with our specialists.
          </p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="h-full border-white/70 bg-white/90 text-night shadow-[0_24px_70px_-50px_rgba(91,33,209,0.3)]">
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl text-night">Marketplace presence</CardTitle>
            <p className="text-sm text-night/70">
              Keep your raise details polished before we surface you to Launch &amp; Lift investors.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className={`text-sm font-semibold ${hasListing ? 'text-royal' : 'text-night/50'}`}>
                {hasListing ? 'Active listing' : 'Awaiting your listing'}
              </p>
              <p className="mt-1 text-xs text-night/55">{listingStatus}</p>
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
              <Link className="flex items-center justify-center gap-2" to="/dashboard/founder/marketplace">
                {hasListing ? 'View marketplace listing' : 'Create marketplace listing'}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-night/55">
              You can maintain one live listing at a time. Drafts are saved on the dedicated page.
            </p>
          </CardContent>
        </Card>

        <Card className="h-full border-white/70 bg-white/90 text-night shadow-[0_24px_70px_-50px_rgba(91,33,209,0.3)]">
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl text-night">Success-fee raise support</CardTitle>
            <p className="text-sm text-night/70">
              Walk through a guided brief so our capital team can champion your round.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2 text-xs text-night/70">
              {['Onboarding: ₹2–3L', 'Success fee on final raise', 'Investor introductions'].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[0.7rem] text-night/70 shadow-sm shadow-white/70"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>

            {successRequest ? (
              <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-xs text-night/70 shadow-inner shadow-white/60">
                <p className="font-semibold text-royal">Request submitted — our team is reviewing.</p>
                <p className="mt-1 text-night/60">
                  Round: {successRequest.round} • Target:{' '}
                  {successRequest.targetAmount ? formatCurrencyInr(successRequest.targetAmount) : 'Not shared'}
                </p>
                <p className="mt-1 text-night/55">
                  Updated {formatDateDisplay(successRequest.createdAt)} • Revisit to edit or add notes.
                </p>
              </div>
            ) : (
              <p className="text-sm text-night/60">
                Share stage, traction, and committed capital so the success team can spin up outreach.
              </p>
            )}

            <Button asChild className="w-full">
              <Link className="flex items-center justify-center gap-2" to="/dashboard/founder/success-fee">
                {successRequest ? 'Update success-fee request' : 'Request success-fee plan'}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-night/55">
              Requests surface instantly on the admin console for Launch &amp; Lift operators.
            </p>
          </CardContent>
        </Card>

        <Card className="h-full border-white/70 bg-white/90 text-night shadow-[0_24px_70px_-50px_rgba(91,33,209,0.3)]">
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl text-night">Founder services studio</CardTitle>
            <p className="text-sm text-night/70">
              Collaborate with vetted specialists on the assets that close your round faster.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="grid gap-3 text-sm text-night/70">
              {FOUNDER_SERVICE_DETAILS.map((service) => (
                <li
                  key={service.id}
                  className="flex flex-col gap-1 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-night shadow-inner shadow-white/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-night">{service.title}</span>
                    <span className="text-[0.7rem] uppercase tracking-[0.25em] text-royal">
                      Available
                    </span>
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
                  {serviceRequests.length > 1
                    ? `${serviceRequests.length} requests in queue`
                    : 'Ready for review'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-night/60">
                Spin up a scoped brief for pitch decks, metrics deep dives, or GTM enablement.
              </p>
            )}

            <Button asChild className="w-full">
              <Link className="flex items-center justify-center gap-2" to="/dashboard/founder/services">
                {latestServiceRequest ? 'Manage service requests' : 'Request a founder service'}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-night/55">
              All service collaboration threads now live on the services page for easy follow-up.
            </p>
          </CardContent>
        </Card>
      </div>
    </Motion.section>
  );
};

export default FounderDashboard;
