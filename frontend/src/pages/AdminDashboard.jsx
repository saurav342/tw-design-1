import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { MailPlus, Users } from 'lucide-react';
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
import { formatCurrency } from '../lib/formatters.js';
import { useAppStore } from '../store/useAppStore.js';

const AdminDashboard = () => {
  const founders = useAppStore((state) => state.founders);
  const investors = useAppStore((state) => state.investors);
  const updateFounderStatus = useAppStore((state) => state.updateFounderStatus);

  const pendingFounders = founders.filter((founder) => founder.status === 'pending');
  const approvedFounders = founders.filter((founder) => founder.status === 'approved');

  const [selectedFounderId, setSelectedFounderId] = useState(() => approvedFounders[0]?.id ?? '');
  const [selectedInvestors, setSelectedInvestors] = useState([]);

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
    </Tabs>
  );
};

export default AdminDashboard;
