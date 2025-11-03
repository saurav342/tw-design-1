import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  ArrowLeft,
  ClipboardList,
  FileText,
  LineChart,
  MessageCircle,
  Rocket,
  Scale,
  Sparkles,
  UserCheck,
  Cpu,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { useActiveFounder } from '../hooks/useActiveFounder.js';
import { useFounderExtras } from '../hooks/useFounderExtras.js';
import {
  FOUNDER_SERVICE_OPTIONS,
  FOUNDER_SERVICE_URGENCY,
  FOUNDER_SERVICE_DETAILS,
} from '../data/founderExtras.js';
import { formatDateDisplay } from '../lib/formatters.js';
import { showGenericSuccess } from '../lib/emailClientMock.js';

const defaultFormState = () => ({
  serviceType: FOUNDER_SERVICE_OPTIONS[0],
  urgency: 'Normal',
  note: '',
});

const FounderServices = () => {
  const navigate = useNavigate();
  const { activeFounder, founderId } = useActiveFounder();
  const { extras, addServiceRequest } = useFounderExtras(founderId);

  const [form, setForm] = useState(defaultFormState);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm(defaultFormState());
    setIsDirty(false);
  }, [founderId]);

  const serviceRequests = useMemo(
    () =>
      Array.isArray(extras.serviceRequests)
        ? [...extras.serviceRequests].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
        : [],
    [extras.serviceRequests],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      serviceType: form.serviceType,
      urgency: form.urgency,
      note: form.note.trim(),
      createdAt: new Date().toISOString(),
    };

    addServiceRequest(payload);
    showGenericSuccess('Service request created (mock)');
    setForm(defaultFormState());
    setIsDirty(false);
  };

  const serviceIconMap = {
    'pitch-deck': FileText,
    mentorship: UserCheck,
    financials: LineChart,
    legal: Scale,
    tech: Cpu,
    growth: Rocket,
  };

  const serviceAccentMap = {
    'pitch-deck': 'from-royal/15 via-white/70 to-blossom/25',
    mentorship: 'from-emerald/20 via-white/70 to-royal/15',
    financials: 'from-sunbeam/25 via-white/70 to-royal/10',
    legal: 'from-night/10 via-white/70 to-royal/20',
    tech: 'from-indigo-400/20 via-white/70 to-royal/15',
    growth: 'from-rose-400/25 via-white/70 to-sunbeam/20',
  };

  return (
    <section className="relative overflow-hidden pb-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white/85 to-sunbeam/30" />
      <div className="absolute left-[-120px] top-[-180px] h-[420px] w-[420px] rounded-full bg-blossom/20 blur-[200px]" />
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
              <Sparkles className="h-4 w-4 text-royal" />
              Founder services
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-night">
              Unlock specialists to level up your fundraising assets
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-night/65">
              Brief our operators on what you need — from pitch polish to financial modelling.
              Requests route to vetted experts for fast-turnaround support.
            </p>
          </div>
          <div className="rounded-full border border-white/70 bg-white/85 px-4 py-2 text-xs uppercase tracking-[0.35em] text-night/60 shadow-sm shadow-white/70">
            {serviceRequests.length} active request{serviceRequests.length === 1 ? '' : 's'}
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-10 space-y-6"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-night">Service catalogue</h2>
              <p className="mt-1 max-w-3xl text-sm text-night/65">
                Explore what’s included before you submit a brief. Every engagement pairs you with
                a Launch &amp; Lift specialist plus curated playbooks proven across rounds.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {FOUNDER_SERVICE_DETAILS.map((service) => {
              const Icon = serviceIconMap[service.id] ?? Sparkles;
              const accent = serviceAccentMap[service.id] ?? 'from-royal/15 via-white/70 to-sunbeam/20';
              return (
                <div
                  key={service.id}
                  className="relative overflow-hidden rounded-3xl border border-white/65 bg-white/95 p-6 text-night shadow-[0_32px_100px_-70px_rgba(91,33,209,0.45)]"
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`} />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/85 shadow-sm shadow-white/60">
                        <Icon className="h-5 w-5 text-royal" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-night">{service.title}</h3>
                        <p className="text-xs uppercase tracking-[0.25em] text-night/50">Available now</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-night/75">{service.tagline}</p>
                    <p className="text-sm leading-6 text-night/70">{service.description}</p>
                    <div className="space-y-2 rounded-2xl border border-white/70 bg-white/90 p-4 text-sm text-night/70 shadow-inner shadow-white/70">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-night/45">
                        Deliverables
                      </p>
                      <ul className="space-y-2">
                        {service.outcomes.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-royal" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]"
        >
          <Card className="border-white/70 bg-white/95 text-night shadow-[0_32px_110px_-60px_rgba(91,33,209,0.35)]">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl text-night">Create a new request</CardTitle>
              <p className="text-sm text-night/65">
                Tell us what you need help with. We tailor the engagement based on urgency and the
                outcome you&apos;re targeting.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-3">
                  <Label className="text-night/70" htmlFor="serviceType">
                    Service focus
                  </Label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-night/10 bg-white/90 px-4 text-sm text-night focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/40"
                  >
                    {FOUNDER_SERVICE_OPTIONS.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3">
                  <Label className="text-night/70" htmlFor="urgency">
                    Urgency
                  </Label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={form.urgency}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-night/10 bg-white/90 px-4 text-sm text-night focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/40"
                  >
                    {FOUNDER_SERVICE_URGENCY.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3">
                  <Label className="text-night/70" htmlFor="note">
                    What should we deliver?
                  </Label>
                  <Textarea
                    id="note"
                    name="note"
                    required
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Example: Need a narrative refresh + 12-slide investor deck ahead of upcoming meetings."
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
                    Send request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card className="border-white/70 bg-white/95 text-night shadow-[0_32px_110px_-60px_rgba(91,33,209,0.35)]">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg text-night">Recent briefs</CardTitle>
                <ClipboardList className="h-4 w-4 text-royal" />
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-night/70">
                {serviceRequests.length ? (
                  serviceRequests.map((request) => (
                    <div
                      key={`${request.serviceType}-${request.createdAt}`}
                      className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-inner shadow-white/60"
                    >
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-night/50">
                        <span>{request.serviceType}</span>
                        <span>{request.urgency}</span>
                      </div>
                      <p className="mt-2 text-xs text-night/55">
                        {formatDateDisplay(request.createdAt)}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-night/70">{request.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-night/60">
                    No briefs yet. Submit your first request to start collaborating with our experts.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/90 text-night shadow-[0_26px_90px_-60px_rgba(91,33,209,0.28)]">
              <CardHeader className="space-y-2">
                <CardTitle className="text-base text-night">How the studio works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-night/55">
                <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-white/70">
                  <p className="font-semibold text-night">1. Intake</p>
                  <p className="mt-1">
                    We confirm scope and assign a specialist matched to your sector and deliverable.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-white/70">
                  <p className="font-semibold text-night">2. Collaboration</p>
                  <p className="mt-1">
                    Expect a kickoff within 24 hours. We keep everything asynchronous unless you need
                    a deep dive.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-white/70">
                  <p className="font-semibold text-night">3. Delivery</p>
                  <p className="mt-1">
                    Final assets land in your inbox with context for investor conversations and next
                    steps.
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-white/70">
                  <MessageCircle className="h-4 w-4 text-royal" />
                  <p>
                    Questions? Ping <span className="font-semibold text-night">services@launchandlift.co</span>{' '}
                    and we&apos;ll respond quickly.
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

export default FounderServices;
