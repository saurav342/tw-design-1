import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, Briefcase, CalendarClock, FileText } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { Input } from '../components/ui/input.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { useActiveFounder } from '../hooks/useActiveFounder.js';
import { useFounderExtras } from '../hooks/useFounderExtras.js';
import { SUCCESS_FEE_ROUNDS } from '../data/founderExtras.js';
import { formatCurrencyInr, formatDateDisplay } from '../lib/formatters.js';
import { toNumberOrNull } from '../lib/utils.js';
import { showGenericSuccess } from '../lib/emailClientMock.js';

const createFormState = (request, founder) => ({
  round: request?.round ?? founder?.raiseStage ?? 'Seed',
  targetAmount: request?.targetAmount ? String(request.targetAmount) : '',
  committed: request?.committed ? String(request.committed) : '',
  deckUrl: request?.deckUrl ?? '',
  notes:
    request?.notes ??
    `We are raising ${formatCurrencyInr(founder?.raiseAmountUSD ?? 0)} to accelerate ${founder?.tractionSummary ?? 'growth milestones'}.`,
});

const FounderSuccessFee = () => {
  const navigate = useNavigate();
  const { activeFounder, founderId } = useActiveFounder();
  const { extras, recordSuccessFeeRequest } = useFounderExtras(founderId);

  const [form, setForm] = useState(() => createFormState(extras.successFeeRequest, activeFounder));
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm(createFormState(extras.successFeeRequest, activeFounder));
    setIsDirty(false);
  }, [extras, activeFounder]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const summary = useMemo(() => {
    const target = toNumberOrNull(form.targetAmount);
    const committed = toNumberOrNull(form.committed);
    return {
      targetAmount: target != null ? formatCurrencyInr(target) : '—',
      committed: committed != null ? formatCurrencyInr(committed) : '—',
    };
  }, [form]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      round: form.round,
      targetAmount: toNumberOrNull(form.targetAmount),
      committed: toNumberOrNull(form.committed),
      deckUrl: form.deckUrl?.trim() || null,
      notes: form.notes?.trim() || null,
      createdAt: new Date().toISOString(),
    };

    recordSuccessFeeRequest(payload);
    showGenericSuccess('Success-fee request submitted (mock)');
    setIsDirty(false);
  };

  const hasRequest = Boolean(extras.successFeeRequest);
  const statusTone = hasRequest ? 'bg-emerald-500/15 text-emerald-600' : 'bg-night/5 text-night/60';

  return (
    <section className="relative overflow-hidden pb-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white/85 to-blossom/20" />
      <div className="absolute right-[-140px] top-[-120px] h-[420px] w-[420px] rounded-full bg-royal/15 blur-[220px]" />
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <Button
              variant="ghost"
              className="mb-6 inline-flex items-center gap-2 text-sm text-night/70 hover:bg-night/5"
              onClick={() => navigate('/dashboard/founder')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Button>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-1 text-xs uppercase tracking-[0.2em] text-night/60 shadow-sm shadow-white/70">
              <Briefcase className="h-4 w-4 text-royal" />
              Success team
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-night">
              Partner with Launch &amp; Lift to close your round
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-night/65">
              Share the essentials so our capital specialists can step in with investor outreach,
              material prep, and diligence support.
            </p>
          </div>
          <Badge className={`h-9 rounded-full px-4 text-xs ${statusTone}`}>
            {hasRequest ? 'In review' : 'Drafting'}
          </Badge>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]"
        >
          <Card className="border-white/70 bg-white/95 text-night shadow-[0_32px_110px_-60px_rgba(91,33,209,0.35)]">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl text-night">Support briefing</CardTitle>
              <p className="text-sm text-night/65">
                Give us a confident read on your round. Add optional context to help us fast-track
                diligence packages and investor intros.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-3">
                  <Label className="text-night/70" htmlFor="round">
                    Current round
                  </Label>
                  <select
                    id="round"
                    name="round"
                    value={form.round}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-night/10 bg-white/90 px-4 text-sm text-night focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/40"
                  >
                    {SUCCESS_FEE_ROUNDS.map((round) => (
                      <option key={round} value={round}>
                        {round}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-3">
                    <Label className="text-night/70" htmlFor="targetAmount">
                      Target raise (₹)
                    </Label>
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      min="0"
                      required
                      value={form.targetAmount}
                      onChange={handleChange}
                      placeholder="25000000"
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-night/70" htmlFor="committed">
                      Committed so far (₹)
                    </Label>
                    <Input
                      id="committed"
                      name="committed"
                      type="number"
                      min="0"
                      value={form.committed}
                      onChange={handleChange}
                      placeholder="5000000"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label className="text-night/70" htmlFor="deckUrl">
                    Deck or data room link <span className="text-night/45">(optional)</span>
                  </Label>
                  <Input
                    id="deckUrl"
                    name="deckUrl"
                    type="url"
                    value={form.deckUrl}
                    onChange={handleChange}
                    placeholder="https://"
                    className="h-11"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-night/70" htmlFor="notes">
                    Notes to the success team
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    required
                    value={form.notes}
                    onChange={handleChange}
                    className="min-h-[160px]"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="hover:bg-night/5"
                    onClick={() => navigate('/dashboard/founder')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!isDirty} className="sm:min-w-[200px]">
                    Submit for review
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card className="border-white/70 bg-white/95 text-night shadow-[0_32px_110px_-60px_rgba(91,33,209,0.35)]">
              <CardHeader>
                <CardTitle className="text-lg text-night">Round snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-night/70">
                <div>
                  <p className="text-night/50">Stage</p>
                  <p className="mt-1 text-base font-semibold text-night">{form.round}</p>
                </div>
                <div>
                  <p className="text-night/50">Target raise</p>
                  <p className="mt-1 text-base font-semibold text-night">
                    {summary.targetAmount}
                  </p>
                </div>
                <div>
                  <p className="text-night/50">Committed</p>
                  <p className="mt-1 text-base font-semibold text-night">{summary.committed}</p>
                </div>
                <div>
                  <p className="text-night/50">Deck / data room</p>
                  <p className="mt-1 text-night/70">
                    {form.deckUrl ? (
                      <a
                        className="text-royal underline underline-offset-4"
                        href={form.deckUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View shared link
                      </a>
                    ) : (
                      'No link shared yet'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/90 text-night shadow-[0_26px_90px_-60px_rgba(91,33,209,0.28)]">
              <CardHeader className="space-y-2">
                <CardTitle className="text-base text-night">Request timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-night/55">
                <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-white/70">
                  <CalendarClock className="h-4 w-4 text-royal" />
                  <div>
                    <p className="font-semibold text-night">Last submitted</p>
                    <p>{formatDateDisplay(extras.successFeeRequest?.createdAt)}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-white/70">
                  <p className="font-semibold text-night">What we do next</p>
                  <p className="mt-1">
                    We craft outreach materials, map qualified investors, and schedule warm
                    introductions on your behalf.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-white/70">
                  <p className="font-semibold text-night">Need quick help?</p>
                  <p className="mt-1">
                    Email support@launchandlift.co with urgent updates and the team will respond
                    within a business day.
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </Motion.div>
      </div>
    </section>
  );
};

export default FounderSuccessFee;
