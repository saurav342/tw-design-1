import { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Lock, NotebookPen, Rocket } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { CardStat } from '../components/CardStat.jsx';
import { BenchmarkTable } from '../components/BenchmarkTable.jsx';
import { MatchScoreBadge } from '../components/MatchScoreBadge.jsx';
import { showGenericSuccess } from '../lib/emailClientMock.js';
import { formatCurrency } from '../lib/formatters.js';
import { useAppStore } from '../store/useAppStore.js';

const ACTIVE_FOUNDER_KEY = 'launch.activeFounderId';

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

export default FounderDashboard;
