import { useEffect, useMemo, useState } from 'react';
import { contentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const maskPan = (pan) => {
  if (!pan) return '—';
  const normalized = pan.toUpperCase();
  if (normalized.length <= 4) {
    return normalized;
  }
  return `${normalized.slice(0, 2)}••••${normalized.slice(-2)}`;
};

const InvestorDashboard = () => {
  const { token, user } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioResponse, statsResponse] = await Promise.all([
          contentApi.portfolio(),
          contentApi.stats(token),
        ]);
        setPortfolio(portfolioResponse.items ?? []);
        setStats(statsResponse);
        setLoading(false);
      } catch (err) {
        setError('Unable to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-brand-muted p-10 text-center text-sm text-slate-600">
          Loading LaunchAndLift Mission Control…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-burnt/10 p-10 text-center text-sm font-semibold text-burnt">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
      <header className="flex flex-col gap-6 rounded-3xl bg-brand-muted p-10 text-brand-dark shadow-sm shadow-brand-muted/60 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lagoon">Mission Control</p>
          <h1 className="mt-3 text-3xl font-semibold">
            Welcome back, {user?.fullName ?? user?.name ?? 'LaunchAndLift investor'}
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Access your LaunchAndLift allocations, review portfolio performance, and stay aligned with upcoming deal flow.
          </p>
        </div>
        {user?.investorDetails?.profilePhoto?.data && (
          <div className="flex items-center gap-3 rounded-3xl border border-white/70 bg-white/70 px-5 py-4 shadow-sm">
            <img
              src={user.investorDetails.profilePhoto.data}
              alt={user.fullName}
              className="h-20 w-20 rounded-2xl object-cover shadow-lg shadow-brand-muted/40"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lagoon">Profile photo</p>
              <p className="text-sm text-slate-600">Provided for verification</p>
            </div>
          </div>
        )}
      </header>

      <InvestorProfileSummary user={user} />

      {stats && (
        <section className="grid gap-4 sm:grid-cols-2">
          {stats.metrics?.map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-burnt">{item.value}</p>
              <p className="mt-2 text-sm text-slate-600">{item.caption}</p>
            </div>
          ))}
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-brand-dark">Active allocations</h2>
          <button
            type="button"
            className="rounded-full border border-lagoon px-5 py-2 text-xs font-semibold uppercase tracking-wide text-lagoon hover:border-burnt hover:text-burnt"
          >
            Download NAV report
          </button>
        </div>
        <div className="space-y-3">
          {portfolio.map((company) => (
            <div key={company.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-lagoon">
                    {company.sector}
                  </p>
                  <h3 className="text-lg font-semibold text-brand-dark">{company.name}</h3>
                </div>
                <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-burnt">
                  {company.status ?? 'Active'}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{company.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InvestorDashboard;

const InvestorProfileSummary = ({ user }) => {
  const investorDetails = useMemo(() => user?.investorDetails ?? {}, [user]);
  const experience = investorDetails.experience ?? [];
  const assetsText =
    investorDetails.assetsOverThreshold === undefined
      ? '—'
      : investorDetails.assetsOverThreshold
        ? 'Yes'
        : 'No';
  const accountHolderType =
    investorDetails.accountHolderType === 'corporate' ? 'Corporate / Institutional' : 'Individual';

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
        <h2 className="text-lg font-semibold text-brand-dark">Investor profile</h2>
        <dl className="grid gap-3 text-sm text-slate-600">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Organization</dt>
            <dd>{user?.organization ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Phone</dt>
            <dd>
              {investorDetails.phone ?? '—'}{' '}
              {investorDetails.phone && (
                <span className={`text-xs font-semibold ${investorDetails.phoneVerified ? 'text-emerald-600' : 'text-burnt'}`}>
                  {investorDetails.phoneVerified ? 'Verified' : 'Pending verification'}
                </span>
              )}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">LinkedIn</dt>
            <dd>
              {investorDetails.linkedinUrl ? (
                <a href={investorDetails.linkedinUrl} target="_blank" rel="noreferrer" className="text-lagoon hover:text-neon">
                  View profile
                </a>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Country of citizenship</dt>
            <dd>{investorDetails.countryOfCitizenship ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Location</dt>
            <dd>{investorDetails.location ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">PAN</dt>
            <dd>{maskPan(investorDetails.panNumber)}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
        <h2 className="text-lg font-semibold text-brand-dark">Investment preferences</h2>
        <dl className="grid gap-3 text-sm text-slate-600">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Investor type</dt>
            <dd>{investorDetails.investorType ?? '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Account holder type</dt>
            <dd>{accountHolderType}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-brand-dark">Assets &gt; ₹2 Cr</dt>
            <dd>{assetsText}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-semibold text-brand-dark">Experience highlights</dt>
            <dd>
              {experience.length ? (
                <ul className="list-disc space-y-1 pl-5">
                  {experience.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                '—'
              )}
            </dd>
          </div>
          {user?.notes && (
            <div className="flex flex-col gap-1">
              <dt className="font-semibold text-brand-dark">Capital focus</dt>
              <dd className="rounded-2xl bg-brand-muted/40 p-3 text-sm text-slate-600">{user.notes}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
};
