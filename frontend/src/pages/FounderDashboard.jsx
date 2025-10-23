import { useEffect, useMemo, useState } from 'react';
import { contentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatMonthYear = (value) => {
  if (!value) return '—';
  const date = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long' }).format(date);
};

const FounderDashboard = () => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [portfolioResponse, testimonialsResponse] = await Promise.all([
          contentApi.portfolio(),
          contentApi.testimonials(),
        ]);
        setUpdates(portfolioResponse.items ?? []);
        setTestimonials(testimonialsResponse.items ?? []);
      } catch (error) {
        console.error('Failed to load founder dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-brand-muted p-10 text-center text-sm text-slate-600">
          Loading your LaunchAndLift workspace…
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
      <header className="rounded-3xl bg-gradient-to-r from-lagoon via-neon to-blaze p-10 text-brand-dark shadow-lg shadow-lagoon/40">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/70">
          Founder Workspace
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Hello, {user?.fullName ?? 'LaunchAndLift founder'}</h1>
        <p className="mt-3 text-sm text-brand-dark/70">
          Track capital milestones, connect with operator guild experts, and monitor LaunchAndLift mission control tasks.
        </p>
      </header>

      <FounderSummary user={user} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-brand-dark">Operator guild tasks</h2>
          <button type="button" className="rounded-full border border-brand-dark px-5 py-2 text-xs font-semibold uppercase tracking-wide text-brand-dark hover:border-burnt hover:text-burnt">
            Request support
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {['GTM Sprint', 'People Ops', 'Finance Readiness', 'Product Roadmap'].map((task) => (
            <div key={task} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-lagoon">{task}</p>
              <p className="mt-2 text-sm text-slate-600">
                LaunchAndLift operator guild is reviewing your milestones. Expect feedback within 48 hours.
              </p>
              <button type="button" className="mt-4 text-xs font-semibold text-burnt hover:text-blaze">
                View details
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-dark">My LaunchAndLift deals</h2>
        <div className="space-y-3">
          {updates.slice(0, 4).map((deal) => (
            <div key={deal.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-burnt">{deal.sector}</p>
                  <h3 className="text-lg font-semibold text-brand-dark">{deal.name}</h3>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Next milestone
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{deal.milestone}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-dark">Community shoutouts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.slice(0, 2).map((item) => (
            <div key={item.name} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
              <p className="text-sm text-slate-600">“{item.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-brand-dark">{item.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-400">{item.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FounderDashboard;

const FounderSummary = ({ user }) => {
  const founderDetails = useMemo(() => user?.founderDetails ?? {}, [user]);
  const startupDetails = founderDetails.startupDetails ?? {};
  const coFounder = founderDetails.coFounder;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
        <h2 className="text-lg font-semibold text-brand-dark">Founder profile</h2>
        <dl className="grid gap-3 text-sm text-slate-600">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Email</dt>
            <dd>{user?.email ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Phone</dt>
            <dd>
              {founderDetails.phone ?? '—'}{' '}
              {founderDetails.phone && (
                <span className={`text-xs font-semibold ${founderDetails.phoneVerified ? 'text-emerald-600' : 'text-burnt'}`}>
                  {founderDetails.phoneVerified ? 'Verified' : 'Pending verification'}
                </span>
              )}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">LinkedIn</dt>
            <dd>
              {founderDetails.linkedinUrl ? (
                <a href={founderDetails.linkedinUrl} target="_blank" rel="noreferrer" className="text-lagoon hover:text-neon">
                  View profile
                </a>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Referrer</dt>
            <dd>{founderDetails.referrer ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Founder structure</dt>
            <dd>{founderDetails.singleFounder ? 'Single founder' : 'Founder team'}</dd>
          </div>
          {!founderDetails.singleFounder && coFounder && (
            <div className="rounded-2xl bg-brand-muted/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-lagoon">Co-founder</p>
              <p className="text-sm text-brand-dark">{coFounder.name}</p>
              <p className="text-xs text-slate-500">{coFounder.email}</p>
              {coFounder.linkedinUrl && (
                <a href={coFounder.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-lagoon hover:text-neon">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </dl>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
        <h2 className="text-lg font-semibold text-brand-dark">Company snapshot</h2>
        <dl className="grid gap-3 text-sm text-slate-600">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Brand name</dt>
            <dd>{startupDetails.brandName ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Legal name</dt>
            <dd>{startupDetails.legalName ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Stage</dt>
            <dd>{startupDetails.stage ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Sector focus</dt>
            <dd>
              {startupDetails.sectorTags?.length
                ? startupDetails.sectorTags.join(', ')
                : startupDetails.sector ?? '—'}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">City</dt>
            <dd>{startupDetails.cityOfOperation ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Company type</dt>
            <dd>{startupDetails.companyType ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Monthly revenue</dt>
            <dd>{startupDetails.monthlyRevenue ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Pre-money valuation</dt>
            <dd>{startupDetails.preMoneyValuation ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Capital to raise</dt>
            <dd>{startupDetails.capitalToRaise ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Incorporation</dt>
            <dd>{formatMonthYear(startupDetails.incorporationDate)}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-semibold text-brand-dark">Pitch deck</dt>
            <dd>
              {startupDetails.pitchDeck?.data ? (
                <a
                  href={startupDetails.pitchDeck.data}
                  download={startupDetails.pitchDeck.fileName ?? 'launchandlift-pitch-deck.pdf'}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-lagoon hover:text-neon"
                >
                  Download deck
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M9 2a1 1 0 0 1 2 0v7.586l1.293-1.293a1 1 0 0 1 1.414 1.414l-3.001 3a1 1 0 0 1-1.414 0l-3.001-3A1 1 0 0 1 7.293 8.293L8.586 9.586V2Z" />
                    <path d="M3 12a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" />
                  </svg>
                </a>
              ) : (
                '—'
              )}
            </dd>
          </div>
          {startupDetails.description && (
            <div className="flex flex-col gap-1">
              <dt className="font-semibold text-brand-dark">What we are building</dt>
              <dd className="rounded-2xl bg-brand-muted/40 p-3 text-sm text-slate-600">
                {startupDetails.description}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
};
