import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Lock, NotebookPen, Rocket, X } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { CardStat } from '../components/CardStat.jsx';
import { BenchmarkTable } from '../components/BenchmarkTable.jsx';
import { MatchScoreBadge } from '../components/MatchScoreBadge.jsx';
import { showGenericSuccess } from '../lib/emailClientMock.js';
import { formatCurrency } from '../lib/formatters.js';
import { useAppStore } from '../store/useAppStore.js';

const ACTIVE_FOUNDER_KEY = 'launch.activeFounderId';
const INITIAL_MARKETPLACE_LISTING = {
  id: 'mock-1',
  raiseAmount: 2500000,
  minTicket: 50000,
  useOfFunds: 'Team, GTM, Product polish',
  status: 'active',
  lastUpdated: '2025-11-01',
  industry: 'SaaS / GTM enablement',
};
const SUCCESS_FEE_ROUNDS = ['Pre-seed', 'Seed', 'Bridge', 'Series A'];
const FOUNDER_SERVICE_OPTIONS = [
  'Pitch deck preparation',
  'Mentorship / advisory',
  'Financial projections',
  'Legal & compliance',
  'Tech enhancement support',
  'Growth marketing',
];

const FounderDashboard = () => {
  const { user } = useAuth();
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const saveNotes = useAppStore((state) => state.saveBenchmarkNotes);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const persisted = window.sessionStorage.getItem(ACTIVE_FOUNDER_KEY);
    setActiveId(persisted);
  }, []);

  const activeFounder = useMemo(() => {
    if (activeId) {
      const found = founders.find((founder) => founder.id === activeId);
      if (found) return found;
    }
    return founders[0];
  }, [founders, activeId]);

  const [notes, setNotes] = useState(activeFounder?.benchmarkNotes ?? {});

  useEffect(() => {
    if (activeFounder) {
      setNotes(activeFounder.benchmarkNotes ?? {});
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(ACTIVE_FOUNDER_KEY, activeFounder.id);
      }
    }
  }, [activeFounder]);

  if (!activeFounder) {
    return (
      <Card className="p-10 text-center text-slate-200">
        <p>No founder data yet. Submit the intake flow to unlock insights.</p>
      </Card>
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
    <div className="space-y-10">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            <Rocket className="h-4 w-4 text-indigo-300" />
            Ready to Lift
          </div>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            {activeFounder.startupName}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-200">
            {activeFounder.aiSummary}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-indigo-200">
            Founder: {user?.fullName ?? activeFounder.fullName}
          </p>
        </div>
        <div className="h-full rounded-2xl border border-indigo-400/30 bg-indigo-500/10 px-6 py-4 text-right text-sm text-indigo-100">
          <p>Raise Target</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {formatCurrency(activeFounder.raiseAmountUSD)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-indigo-200">
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

      <AdditionalFundingSection />

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Benchmark Notes</h2>
          <div className="flex items-center gap-2 text-sm text-slate-300">
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
          <div className="flex items-center gap-3 rounded-2xl border border-amber-300/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
            <Lock className="h-4 w-4" /> Benchmark notes can be edited but matches remain locked until approval.
          </div>
        ) : null}
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl text-white">Investor Match Preview</CardTitle>
              <p className="text-sm text-slate-300">
                Top aligned funds for your raise. Admin will send intros once approved.
              </p>
            </div>
            {isPending ? (
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                <Lock className="h-4 w-4" /> Matches locked pending review
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {matchPreview.map(({ match, investor }) => (
              <div key={match.investorId} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {investor.fundName}
                  </h3>
                  <MatchScoreBadge score={match.matchScore} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{investor.thesis}</p>
                <div className="mt-4 flex flex-wrap gap-1 text-xs text-slate-400">
                  {investor.stageFocus.map((stage) => (
                    <span key={stage} className="rounded-full border border-white/10 px-2 py-0.5">
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {matchPreview.length === 0 ? (
              <p className="text-sm text-slate-300">
                Matches will appear here once investors share aligned theses.
              </p>
            ) : null}
          </CardContent>
          {isPending ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/60 text-sm text-slate-200 backdrop-blur">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5" />
                Awaiting Launch & Lift approval to unlock investor outreach.
              </div>
            </div>
          ) : null}
        </Card>
      </Motion.div>
    </div>
  );
};

const formatDateDisplay = (value) => {
  if (!value) return 'Not updated yet';
  const safeDate = typeof value === 'string' || value instanceof Date ? new Date(value) : null;
  if (!safeDate || Number.isNaN(safeDate.getTime())) return 'Not updated yet';
  return safeDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrencyInr = (value) => {
  if (value === null || value === undefined) return '—';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric);
};

const toNumberOrNull = (value) => {
  const parsed = Number(String(value ?? '').replace(/,/g, '').trim());
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

const AdditionalFundingSection = () => {
  const createMarketplaceFormState = (listing) => ({
    raiseAmount: listing?.raiseAmount ? String(listing.raiseAmount) : '',
    minTicket: listing?.minTicket ? String(listing.minTicket) : '',
    useOfFunds: listing?.useOfFunds ?? '',
    industry: listing?.industry ?? '',
  });

  const [marketplaceListing, setMarketplaceListing] = useState(INITIAL_MARKETPLACE_LISTING);
  const [founderRequests, setFounderRequests] = useState({
    marketplace: INITIAL_MARKETPLACE_LISTING,
    successFee: null,
    services: [],
  });
  const [isMarketplaceModalOpen, setIsMarketplaceModalOpen] = useState(false);
  const [marketplaceForm, setMarketplaceForm] = useState(() =>
    createMarketplaceFormState(INITIAL_MARKETPLACE_LISTING),
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successForm, setSuccessForm] = useState({
    round: 'Seed',
    targetAmount: '',
    committed: '',
    deckUrl: '',
    notes: '',
  });
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [servicesForm, setServicesForm] = useState({
    serviceType: FOUNDER_SERVICE_OPTIONS[0],
    note: '',
    urgency: 'Normal',
  });

  const hasListing = Boolean(marketplaceListing);
  const listingStatus = hasListing
    ? `Active • Last updated: ${formatDateDisplay(marketplaceListing.lastUpdated)}`
    : 'No active listing';

  const latestServiceRequest =
    founderRequests.services[founderRequests.services.length - 1] ?? null;

  const openMarketplaceModal = () => {
    setMarketplaceForm(createMarketplaceFormState(marketplaceListing));
    setIsMarketplaceModalOpen(true);
  };

  const handleMarketplaceChange = (event) => {
    const { name, value } = event.target;
    setMarketplaceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMarketplaceSubmit = (event) => {
    event.preventDefault();
    const nextListing = {
      id: marketplaceListing?.id ?? `mock-${Date.now()}`,
      raiseAmount: toNumberOrNull(marketplaceForm.raiseAmount) ?? 0,
      minTicket: toNumberOrNull(marketplaceForm.minTicket) ?? 0,
      useOfFunds: marketplaceForm.useOfFunds,
      industry: marketplaceForm.industry,
      status: 'active',
      lastUpdated: new Date().toISOString(),
    };

    setMarketplaceListing(nextListing);
    setFounderRequests((prev) => ({ ...prev, marketplace: nextListing }));
    setIsMarketplaceModalOpen(false);
  };

  const openSuccessModal = () => {
    setSuccessForm({
      round: founderRequests.successFee?.round ?? 'Seed',
      targetAmount:
        founderRequests.successFee?.targetAmount != null
          ? String(founderRequests.successFee.targetAmount)
          : '',
      committed:
        founderRequests.successFee?.committed != null
          ? String(founderRequests.successFee.committed)
          : '',
      deckUrl: founderRequests.successFee?.deckUrl ?? '',
      notes: founderRequests.successFee?.notes ?? '',
    });
    setIsSuccessModalOpen(true);
  };

  const handleSuccessChange = (event) => {
    const { name, value } = event.target;
    setSuccessForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuccessSubmit = (event) => {
    event.preventDefault();
    const request = {
      round: successForm.round,
      targetAmount: toNumberOrNull(successForm.targetAmount),
      committed: toNumberOrNull(successForm.committed),
      deckUrl: successForm.deckUrl?.trim() || null,
      notes: successForm.notes?.trim() || null,
      createdAt: new Date().toISOString(),
    };

    setFounderRequests((prev) => ({ ...prev, successFee: request }));
    setIsSuccessModalOpen(false);
  };

  const openServicesModal = (serviceType) => {
    setServicesForm({
      serviceType: serviceType ?? FOUNDER_SERVICE_OPTIONS[0],
      note: '',
      urgency: 'Normal',
    });
    setIsServicesModalOpen(true);
  };

  const handleServicesChange = (event) => {
    const { name, value } = event.target;
    setServicesForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServicesSubmit = (event) => {
    event.preventDefault();
    const request = {
      serviceType: servicesForm.serviceType,
      note: servicesForm.note?.trim() || null,
      urgency: servicesForm.urgency,
      createdAt: new Date().toISOString(),
    };

    setFounderRequests((prev) => ({
      ...prev,
      services: [...prev.services, request],
    }));
    setIsServicesModalOpen(false);
  };

  return (
    <>
      <Motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-3xl border border-white/10 bg-black/30 p-8 shadow-xl backdrop-blur"
      >
        <div className="space-y-3">
          <Badge className="w-fit border-white/15 bg-white/10 text-[0.65rem] tracking-[0.35em] text-slate-100">
            New
          </Badge>
          <div>
            <h2 className="text-2xl font-semibold text-white">Grow your raise with Launch & Lift</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-300">
              List in our marketplace, let us run a success-fee raise, or request extra services —
              all from your dashboard.
            </p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="h-full border-white/15 bg-black/40">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl text-white">List on our Marketplace</CardTitle>
              <p className="text-sm text-slate-300">
                Create one live listing with your raise amount, use-of-funds, and minimum ticket so
                Launch &amp; Lift investors can review it.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className={`text-sm font-semibold ${hasListing ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {hasListing ? 'Active listing' : 'No active listing'}
                </p>
                <p className="mt-1 text-xs text-slate-400">{listingStatus}</p>
              </div>
              {hasListing ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Raise amount</span>
                    <span className="font-semibold text-white">
                      {formatCurrencyInr(marketplaceListing.raiseAmount)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-slate-400">Min. ticket</span>
                    <span className="font-semibold text-white">
                      {formatCurrencyInr(marketplaceListing.minTicket)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-slate-400">Use of funds</p>
                    <p className="mt-1 text-slate-200">{marketplaceListing.useOfFunds}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-slate-400">Industry / category</span>
                    <span className="font-semibold text-white">
                      {marketplaceListing.industry || 'Not set'}
                    </span>
                  </div>
                </div>
              ) : null}

              <Button className="w-full" onClick={openMarketplaceModal}>
                {hasListing ? 'View / edit listing' : 'Create listing'}
              </Button>

              <p className="text-xs text-slate-400">
                Currently we allow 1 active listing per founder.
              </p>
            </CardContent>
          </Card>

          <Card className="h-full border-white/15 bg-black/40">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl text-white">Success-fee raise support</CardTitle>
              <p className="text-sm text-slate-300">
                Hands-on support to close your round. We help with investor outreach, materials, and
                follow-ups. We charge a small onboarding fee plus success fee on the raise.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                {['Onboarding: ₹2–3L', 'Success fee on final raise', 'Investor introductions'].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.7rem] text-slate-200"
                    >
                      {chip}
                    </span>
                  ),
                )}
              </div>

              {founderRequests.successFee ? (
                <div className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-xs text-slate-200">
                  <p className="font-semibold text-indigo-200">
                    Request sent — our team will reach out.
                  </p>
                  <p className="mt-1 text-slate-300">
                    Round: {founderRequests.successFee.round} • Target:{' '}
                    {founderRequests.successFee.targetAmount
                      ? formatCurrencyInr(founderRequests.successFee.targetAmount)
                      : 'Not shared'}
                  </p>
                </div>
              ) : null}

              <Button className="w-full" onClick={openSuccessModal}>
                Request success-fee plan
              </Button>

              <p className="text-xs text-slate-400">
                This request will be visible to admin on the backend.
              </p>
            </CardContent>
          </Card>

          <Card className="h-full border-white/15 bg-black/40">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl text-white">Other services for founders</CardTitle>
              <p className="text-sm text-slate-300">
                Need help polishing your materials? Ask and we’ll loop in the right expert.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <ul className="grid gap-2 text-sm text-slate-200">
                {FOUNDER_SERVICE_OPTIONS.map((service) => (
                  <li
                    key={service}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs sm:text-sm"
                  >
                    <span>{service}</span>
                    <button
                      type="button"
                      className="text-[0.7rem] text-indigo-200 underline underline-offset-4 hover:text-white"
                      onClick={() => openServicesModal(service)}
                    >
                      Request
                    </button>
                  </li>
                ))}
              </ul>

              {latestServiceRequest ? (
                <div className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-xs text-slate-200">
                  <p className="font-semibold text-indigo-200">
                    Request created. Our team will contact you.
                  </p>
                  <p className="mt-1 text-slate-300">
                    Latest: {latestServiceRequest.serviceType} • Urgency:{' '}
                    {latestServiceRequest.urgency}
                  </p>
                </div>
              ) : null}

              <Button className="w-full" onClick={() => openServicesModal()}>
                Request a service
              </Button>

              <p className="text-xs text-slate-400">
                All founder service requests should be visible on the admin side.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          These requests are stored locally so Launch &amp; Lift admin can wire them into the
          backend when ready.
        </p>
      </Motion.section>

      <AnimatePresence>
        {isMarketplaceModalOpen ? (
          <Motion.div
            key="marketplace-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur"
          >
            <Motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-black/85 p-7 text-slate-100 shadow-2xl"
            >
              <button
                type="button"
                className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/10 p-1 text-slate-200 transition hover:bg-white/20"
                onClick={() => setIsMarketplaceModalOpen(false)}
                aria-label="Close marketplace form"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-xl font-semibold text-white">Marketplace listing</h3>
              <p className="mt-1 text-sm text-slate-300">
                Update the details investors see on Launch &amp; Lift.
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleMarketplaceSubmit}>
                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="raiseAmount">
                    Raise amount (₹)
                  </Label>
                  <Input
                    id="raiseAmount"
                    name="raiseAmount"
                    type="number"
                    min="0"
                    required
                    value={marketplaceForm.raiseAmount}
                    onChange={handleMarketplaceChange}
                    className="h-11 border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="minTicket">
                    Min. ticket size (₹)
                  </Label>
                  <Input
                    id="minTicket"
                    name="minTicket"
                    type="number"
                    min="0"
                    required
                    value={marketplaceForm.minTicket}
                    onChange={handleMarketplaceChange}
                    className="h-11 border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="industry">
                    Industry / category
                  </Label>
                  <Input
                    id="industry"
                    name="industry"
                    required
                    value={marketplaceForm.industry}
                    onChange={handleMarketplaceChange}
                    className="h-11 border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="useOfFunds">
                    Use of funds
                  </Label>
                  <Textarea
                    id="useOfFunds"
                    name="useOfFunds"
                    required
                    value={marketplaceForm.useOfFunds}
                    onChange={handleMarketplaceChange}
                    className="min-h-[120px] border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-slate-200 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMarketplaceModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="sm:min-w-[160px]">
                    Save listing
                  </Button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccessModalOpen ? (
          <Motion.div
            key="success-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur"
          >
            <Motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-black/85 p-7 text-slate-100 shadow-2xl"
            >
              <button
                type="button"
                className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/10 p-1 text-slate-200 transition hover:bg-white/20"
                onClick={() => setIsSuccessModalOpen(false)}
                aria-label="Close success-fee request form"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-xl font-semibold text-white">Request success-fee support</h3>
              <p className="mt-1 text-sm text-slate-300">
                Tell us about your round so the Launch &amp; Lift capital team can respond.
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleSuccessSubmit}>
                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="round">
                    Current round
                  </Label>
                  <select
                    id="round"
                    name="round"
                    value={successForm.round}
                    onChange={handleSuccessChange}
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-slate-100 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {SUCCESS_FEE_ROUNDS.map((round) => (
                      <option key={round} value={round}>
                        {round}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="targetAmount">
                    Target amount (₹)
                  </Label>
                  <Input
                    id="targetAmount"
                    name="targetAmount"
                    type="number"
                    min="0"
                    required
                    value={successForm.targetAmount}
                    onChange={handleSuccessChange}
                    className="h-11 border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="committed">
                    Current committed amount (₹) <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="committed"
                    name="committed"
                    type="number"
                    min="0"
                    value={successForm.committed}
                    onChange={handleSuccessChange}
                    className="h-11 border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="deckUrl">
                    Company deck link <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="deckUrl"
                    name="deckUrl"
                    type="url"
                    value={successForm.deckUrl}
                    onChange={handleSuccessChange}
                    placeholder="https://..."
                    className="h-11 border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="notes">
                    Notes to Launch &amp; Lift
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={successForm.notes}
                    onChange={handleSuccessChange}
                    className="min-h-[120px] border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-slate-200 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsSuccessModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="sm:min-w-[200px]">
                    Submit request
                  </Button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isServicesModalOpen ? (
          <Motion.div
            key="services-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur"
          >
            <Motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-black/85 p-7 text-slate-100 shadow-2xl"
            >
              <button
                type="button"
                className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/10 p-1 text-slate-200 transition hover:bg-white/20"
                onClick={() => setIsServicesModalOpen(false)}
                aria-label="Close service request form"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-xl font-semibold text-white">Request founder services</h3>
              <p className="mt-1 text-sm text-slate-300">
                Choose the support you need and we’ll loop in the right expert.
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleServicesSubmit}>
                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="serviceType">
                    Service
                  </Label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={servicesForm.serviceType}
                    onChange={handleServicesChange}
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-slate-100 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {FOUNDER_SERVICE_OPTIONS.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="note">
                    Brief requirement
                  </Label>
                  <Textarea
                    id="note"
                    name="note"
                    required
                    value={servicesForm.note}
                    onChange={handleServicesChange}
                    className="min-h-[120px] border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-slate-200" htmlFor="urgency">
                    Urgency
                  </Label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={servicesForm.urgency}
                    onChange={handleServicesChange}
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-slate-100 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {['Low', 'Normal', 'High'].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-slate-200 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsServicesModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="sm:min-w-[180px]">
                    Create request
                  </Button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default FounderDashboard;
