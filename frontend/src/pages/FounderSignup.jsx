import { useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { showGenericInfo, showGenericSuccess } from '../lib/emailClientMock.js';
import { generateAISummary } from '../lib/fakeAI.js';
import { useAppStore } from '../store/useAppStore.js';
import { useAuth } from '../context/useAuth.js';

const STEPS = [
  {
    id: 'profile',
    title: 'Founder & company',
    summary: 'Core context to calibrate our mentor pods.',
  },
  {
    id: 'insights',
    title: 'Metrics & preview',
    summary: 'Performance signals and AI-generated readiness.',
  },
];

const initialForm = {
  fullName: '',
  email: '',
  startupName: '',
  headline: '',
  sector: '',
  subSectors: [],
  geography: '',
  raiseStage: 'Seed',
  raiseAmountUSD: 0,
  tractionSummary: '',
  teamSize: 3,
  revenueRunRateUSD: 0,
  metrics: {
    growth: '',
    mrr: '',
    cac: '',
    ltv: '',
    payback: '',
  },
};

const FounderSignup = () => {
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  const addFounder = useAppStore((state) => state.addFounder);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentStep = STEPS[step];

  const aiPreview = useMemo(
    () =>
      generateAISummary({
        fullName: form.fullName,
        startupName: form.startupName,
        sector: form.sector,
        geography: form.geography,
        raiseStage: form.raiseStage,
        tractionSummary: form.tractionSummary,
        revenueRunRateUSD: form.revenueRunRateUSD,
      }),
    [form],
  );

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleMetricsChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    const { subSectors, metrics, ...rest } = form;
    const formatted = {
      ...rest,
      subSectors,
      metrics: {
        growth: metrics.growth || '12%',
        mrr: metrics.mrr || '$35K',
        cac: metrics.cac || '$720',
        ltv: metrics.ltv || '$6.4K',
        payback: metrics.payback || '11 months',
      },
    };

    setIsSubmitting(true);
    try {
      const added = await addFounder(formatted);

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('launch.activeFounderId', added.id);
      }

      establishSession({
        user: {
          id: added.id,
          role: 'founder',
          email: added.email,
          fullName: added.fullName,
        },
      });

      showGenericSuccess('Founder profile submitted successfully. We will follow up shortly.');
      navigate('/dashboard/founder', { replace: true });
    } catch (error) {
      console.error('Founder submission failed', error);
      showGenericInfo('We could not submit your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previousStep = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-lilac via-honey to-blossom px-4 py-20 text-night">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2.75rem] border border-white/70 bg-white/85 shadow-[0_45px_140px_-30px_rgba(91,33,209,0.45)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -left-12 top-16 h-64 w-64 rounded-full bg-white/70 blur-[130px]" />
        <div className="pointer-events-none absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-honey/80 blur-[160px]" />
        <div className="relative grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-white/70 bg-gradient-to-b from-white/90 via-white/75 to-white/65 px-8 py-10 md:border-b-0 md:border-r md:px-12">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-night/60">Founder intake</p>
              <h1 className="font-display text-3xl font-semibold text-night md:text-4xl">Launch &amp; Lift signup</h1>
              <p className="text-sm text-night/70">
                Outline the essentials and we&apos;ll assemble your investor readiness workspace in minutes.
              </p>
            </div>

            <ol className="mt-10 grid gap-3">
              {STEPS.map((item, index) => {
                const isActive = index === step;
                const isCompleted = index < step;
                return (
                  <li
                    key={item.id}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      isActive
                        ? 'border-white/70 bg-white/80 text-night shadow-lg shadow-[0_25px_70px_rgba(247,201,72,0.25)]'
                        : 'border-white/40 bg-white/50 text-night/60'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-blossom" />
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-night/15 text-xs text-night/50">
                        {index + 1}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold text-night">{item.title}</p>
                      <p className="text-xs text-night/50">{item.summary}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <form className="bg-white/70 p-10" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-night/50">
              <span>Step {step + 1} of {STEPS.length}</span>
              <span>{currentStep.title}</span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-night/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sunbeam via-blossom to-royal transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-6 min-h-[420px]">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {currentStep.id === 'profile' && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="Full Name">
                        <Input
                          value={form.fullName}
                          onChange={(event) => updateField('fullName', event.target.value)}
                          placeholder="Amelia Hart"
                          required
                        />
                      </Field>
                      <Field label="Email">
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(event) => updateField('email', event.target.value)}
                          placeholder="amelia@orbitstack.io"
                          required
                        />
                      </Field>
                      <Field label="Startup Name">
                        <Input
                          value={form.startupName}
                          onChange={(event) => updateField('startupName', event.target.value)}
                          placeholder="OrbitStack"
                          required
                        />
                      </Field>
                      <Field label="Your Role & Headline">
                        <Input
                          value={form.headline}
                          onChange={(event) => updateField('headline', event.target.value)}
                          placeholder="AI observability stack for enterprise ML teams"
                        />
                      </Field>
                      <Field label="Primary Sector">
                        <Input
                          value={form.sector}
                          onChange={(event) => updateField('sector', event.target.value)}
                          placeholder="AI Infrastructure"
                          required
                        />
                      </Field>
                      <Field label="Focus Tags (comma separated)">
                        <Input
                          value={form.subSectors.join(', ')}
                          onChange={(event) =>
                            updateField(
                              'subSectors',
                              event.target.value
                                .split(',')
                                .map((entry) => entry.trim())
                                .filter(Boolean),
                            )
                          }
                          placeholder="Developer Tools, Model Ops"
                        />
                      </Field>
                      <Field label="Geography">
                        <Input
                          value={form.geography}
                          onChange={(event) => updateField('geography', event.target.value)}
                          placeholder="San Francisco, USA"
                          required
                        />
                      </Field>
                      <Field label="Fundraising Stage">
                        <Input
                          value={form.raiseStage}
                          onChange={(event) => updateField('raiseStage', event.target.value)}
                          placeholder="Seed"
                        />
                      </Field>
                      <Field label="Raise Target (USD)">
                        <Input
                          type="number"
                          value={form.raiseAmountUSD || ''}
                          onChange={(event) =>
                            updateField('raiseAmountUSD', Number(event.target.value) || 0)
                          }
                          placeholder="2500000"
                        />
                      </Field>
                      <Field label="Team Size">
                        <Input
                          type="number"
                          value={form.teamSize}
                          onChange={(event) =>
                            updateField('teamSize', Number(event.target.value) || 0)
                          }
                          placeholder="10"
                        />
                      </Field>
                      <div className="md:col-span-2">
                        <Field label="Traction Snapshot">
                          <Textarea
                            value={form.tractionSummary}
                            onChange={(event) => updateField('tractionSummary', event.target.value)}
                            placeholder="Highlight revenue traction, customer segments, and pipeline momentum."
                          />
                        </Field>
                      </div>
                      <Field label="Revenue Run Rate (USD)">
                        <Input
                          type="number"
                          value={form.revenueRunRateUSD || ''}
                          onChange={(event) =>
                            updateField('revenueRunRateUSD', Number(event.target.value) || 0)
                          }
                          placeholder="720000"
                        />
                      </Field>
                    </div>
                  )}

                  {currentStep.id === 'insights' && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="MoM Growth">
                        <Input
                          value={form.metrics.growth}
                          onChange={(event) => handleMetricsChange('growth', event.target.value)}
                          placeholder="18%"
                        />
                      </Field>
                      <Field label="Monthly Recurring Revenue">
                        <Input
                          value={form.metrics.mrr}
                          onChange={(event) => handleMetricsChange('mrr', event.target.value)}
                          placeholder="$62K"
                        />
                      </Field>
                      <Field label="Customer Acquisition Cost">
                        <Input
                          value={form.metrics.cac}
                          onChange={(event) => handleMetricsChange('cac', event.target.value)}
                          placeholder="$640"
                        />
                      </Field>
                      <Field label="Lifetime Value">
                        <Input
                          value={form.metrics.ltv}
                          onChange={(event) => handleMetricsChange('ltv', event.target.value)}
                          placeholder="$8.1K"
                        />
                      </Field>
                      <Field label="Payback Period">
                        <Input
                          value={form.metrics.payback}
                          onChange={(event) => handleMetricsChange('payback', event.target.value)}
                          placeholder="9 months"
                        />
                      </Field>
                      <div className="md:col-span-2 grid gap-6">
                        <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-inner shadow-white/40">
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blossom">
                            AI generated summary
                          </p>
                          <p className="mt-3 text-sm text-night/75">{aiPreview.overview}</p>
                        </div>
                        <div className="space-y-3 rounded-2xl border border-white/60 bg-white/75 p-6 shadow-inner shadow-white/40">
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blossom">
                            Highlights
                          </p>
                          <ul className="space-y-2 text-sm text-night/75">
                            {aiPreview.highlights.map((highlight) => (
                              <li key={highlight} className="flex items-start gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-blossom" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-white/60 bg-white/75 p-6 text-sm text-night/75 shadow-inner shadow-white/40">
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blossom">
                            Recommended focus
                          </p>
                          <p className="mt-2">{aiPreview.recommendedFocus}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={previousStep}
                disabled={step === 0}
                className="gap-2 text-night/70 hover:text-night"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="gap-2" disabled={isSubmitting}>
                {step === STEPS.length - 1 ? (
                  <>
                    {isSubmitting ? 'Submitting…' : 'Submit'}
                    {!isSubmitting ? <CheckCircle2 className="h-4 w-4" /> : null}
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <Label className="text-xs font-semibold uppercase tracking-[0.25em] text-night/50">{label}</Label>
    {children}
  </div>
);

export default FounderSignup;
