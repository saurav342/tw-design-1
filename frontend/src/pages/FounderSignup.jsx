import { useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { sendFounderDashboardMock } from '../lib/emailClientMock.js';
import { generateAISummary } from '../lib/fakeAI.js';
import { useAppStore } from '../store/useAppStore.js';
import { useAuth } from '../context/useAuth.js';

const STEPS = ['Founder', 'Company', 'Metrics', 'AI Preview'];

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

  const handleSubmit = (event) => {
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

    const added = addFounder(formatted);
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

    sendFounderDashboardMock({ recipientName: form.fullName });
    navigate('/dashboard/founder', { replace: true });
  };

  const previousStep = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-[#FFF6D7] via-[#FFE6A8] to-[#FF985F] px-4 py-16 text-midnight">
      <div className="w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 shadow-[0_35px_120px_-25px_rgba(255,152,95,0.6)] backdrop-blur-xl">
        <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-white/60 bg-white/60 p-8 md:border-b-0 md:border-r">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-midnight/60">Founder intake</p>
              <h1 className="font-display text-3xl font-semibold text-midnight md:text-4xl">Launch &amp; Lift signup</h1>
              <p className="text-sm text-midnight/70">
                Tell us about your company. We will prep your AI-assisted investor readiness workspace within minutes.
              </p>
            </div>

            <ol className="mt-8 space-y-3">
              {STEPS.map((label, index) => {
                const isActive = index === step;
                const isCompleted = index < step;
                return (
                  <li
                    key={label}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      isActive
                        ? 'border-white/70 bg-white/80 text-midnight shadow-lg shadow-[#FFAF58]/25'
                        : 'border-white/40 bg-white/50 text-midnight/60'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-solstice" />
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-midnight/15 text-xs text-midnight/50">
                        {index + 1}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold text-midnight">{label}</p>
                      <p className="text-xs text-midnight/50">
                        {index === 0 && 'Founder essentials'}
                        {index === 1 && 'Company snapshot'}
                        {index === 2 && 'Key fundraising metrics'}
                        {index === 3 && 'Review AI generated insights'}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <form className="bg-white/70 p-8" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-midnight/50">
              <span>Step {step + 1} of {STEPS.length}</span>
              <span>{currentStep}</span>
            </div>

            <div className="mt-6 min-h-[420px]">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {currentStep === 'Founder' && (
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
                    </div>
                  )}

                  {currentStep === 'Company' && (
                    <div className="grid gap-6 md:grid-cols-2">
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

                  {currentStep === 'Metrics' && (
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
                    </div>
                  )}

                  {currentStep === 'AI Preview' && (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-inner shadow-white/40">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-solstice">
                          AI generated summary
                        </p>
                        <p className="mt-3 text-sm text-midnight/75">{aiPreview.overview}</p>
                      </div>
                      <div className="space-y-3 rounded-2xl border border-white/60 bg-white/75 p-6 shadow-inner shadow-white/40">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-solstice">
                          Highlights
                        </p>
                        <ul className="space-y-2 text-sm text-midnight/75">
                          {aiPreview.highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-2">
                              <span className="mt-1 h-2 w-2 rounded-full bg-solstice" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-white/60 bg-white/75 p-6 text-sm text-midnight/75 shadow-inner shadow-white/40">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-solstice">
                          Recommended focus
                        </p>
                        <p className="mt-2">{aiPreview.recommendedFocus}</p>
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
                className="gap-2 text-midnight/70 hover:text-midnight"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="gap-2">
                {step === STEPS.length - 1 ? (
                  <>
                    Generate dashboard
                    <CheckCircle2 className="h-4 w-4" />
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
    <Label className="text-xs font-semibold uppercase tracking-[0.25em] text-midnight/50">{label}</Label>
    {children}
  </div>
);

export default FounderSignup;
