import { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { AlertTriangle, Building2, ClipboardList, MailPlus, Sparkles, Target, Users } from 'lucide-react';
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

const AdminDashboard = () => {
  const { token } = useAuth();
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const updateFounderStatus = useAppStore((state) => state.updateFounderStatus);
  const syncFoundersFromBackend = useAppStore((state) => state.syncFoundersFromBackend);
  const founderExtras = useAppStore((state) => state.founderExtras);
  const syncFounderExtrasFromBackend = useAppStore((state) => state.syncFounderExtrasFromBackend);

  const pendingFounders = founders.filter((founder) => founder.status === 'pending');
  const approvedFounders = founders.filter((founder) => founder.status === 'approved');

  const [selectedFounderId, setSelectedFounderId] = useState(() => approvedFounders[0]?.id ?? '');
  const [selectedInvestors, setSelectedInvestors] = useState([]);
  const [hasSynced, setHasSynced] = useState(false);
  const [hasSyncedExtras, setHasSyncedExtras] = useState(false);

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

  return (
    <Tabs defaultValue="pending" className="space-y-8">
      <TabsList>
        <TabsTrigger value="pending">Pending Review ({pendingFounders.length})</TabsTrigger>
        <TabsTrigger value="matchmaking">Matchmaking Console</TabsTrigger>
        <TabsTrigger value="services">Services Studio</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-6">
        {pendingFounders.length === 0 ? (
          <Card className="p-10 text-center text-sm text-slate-300">
            All founders have been reviewed. You're caught up.
          </Card>
        ) : null}

        {pendingFounders.map((founder) => (
          <Motion.div
            key={founder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="space-y-6">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl text-white">{founder.startupName}</CardTitle>
                    <p className="text-sm text-slate-300">{founder.headline}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="rounded-full border border-white/10 px-2 py-0.5">
                        {founder.sector}
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5">
                        {founder.geography}
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5">
                        Targeting {formatCurrency(founder.raiseAmountUSD)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      updateFounderStatus(founder.id, 'approved');
                      showGenericSuccess(`${founder.startupName} approved (mock)`);
                    }}
                  >
                    Approve Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                    AI Summary
                  </h3>
                  <p className="mt-2 text-sm text-slate-200">{founder.aiSummary}</p>
                </section>
                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                    Benchmarks &amp; Notes
                  </h3>
                  <BenchmarkTable
                    rows={founder.benchmarks}
                    founderNotes={founder.benchmarkNotes}
                    onChangeNote={() => {}}
                    onSave={() => {}}
                    isDisabled
                  />
                </section>
              </CardContent>
            </Card>
          </Motion.div>
        ))}
      </TabsContent>

      <TabsContent value="matchmaking" className="space-y-6">
        {approvedFounders.length === 0 ? (
          <Card className="p-10 text-center text-sm text-slate-300">
            Approve at least one founder to activate matchmaking.
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Founder in focus</p>
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
                          ? 'bg-gradient-to-r from-indigo-500 to-brand text-white'
                          : 'bg-white/10 text-slate-200') +
                        ' rounded-full border border-white/10 px-4 py-2 text-xs font-semibold'
                      }
                    >
                      {founder.startupName}
                    </button>
                  );
                })}
              </div>
            </div>

            <Card>
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl text-white">Investor Matches</CardTitle>
                  <p className="text-sm text-slate-300">
                    Ranked introductions for {selectedFounder?.startupName ?? 'the selected founder'}.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={selectAllHighScores}>
                    Select all ≥ 70%
                  </Button>
                  <Button onClick={sendBulkIntros}>Send All Selected</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {matches.map((entry) => {
                  const investor = entry.investor;
                  const isSelected = selectedInvestors.includes(investor.id);
                  return (
                    <div
                      key={investor.id}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 md:flex-row md:items-center md:justify-between"
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
                          Add to batch intro
                        </label>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            sendIntroEmailMock({
                              investorName: investor.fundName,
                              startupName: selectedFounder?.startupName ?? '',
                            })
                          }
                        >
                          <MailPlus className="mr-2 h-4 w-4" /> Send Intro
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
              <CardFooter className="flex items-center justify-end gap-3 text-xs text-slate-300">
                <Users className="h-4 w-4 text-indigo-300" />
                {selectedInvestors.length} investors selected for bulk intros.
              </CardFooter>
            </Card>
          </>
        )}
      </TabsContent>

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
              },
              {
                id: 'marketplace',
                label: 'Marketplace ready',
                value: servicesSnapshot.totals.marketplace,
                caption: 'Listings with investor-facing data',
                icon: Building2,
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-slate-200 shadow-[0_30px_80px_-60px_rgba(99,102,241,0.75)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-transparent" />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-slate-400">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-1 text-xs text-slate-400">{stat.caption}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-5 w-5 text-indigo-200" />
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
    </Tabs>
  );
};

export default AdminDashboard;
