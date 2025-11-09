import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const signupFlows = [
  {
    role: 'investor',
    eyebrow: 'For capital partners',
    title: 'Investor onboarding',
    description:
      'Request access to LaunchAndLift funds, co-investments, and our Mission Control workspace built for family offices and institutions.',
    benefits: [
      'Allocation diligence, quarterly NAV, and performance dashboards.',
      'Direct access to LaunchAndLift deal teams and co-investment pipeline.',
      'Secure document vault with compliance-ready exports.',
    ],
    to: '/signup/email?role=investor',
    cta: 'Start investor access',
  },
  {
    role: 'founder',
    eyebrow: 'For founders',
    title: 'Founder onboarding',
    description:
      'Share your company story so LaunchAndLift operators can activate capital, GTM, and product support tailored to your stage.',
    benefits: [
      '12-week readiness sprints to accelerate traction and fundraising.',
      'Dedicated operator pod across GTM, product, and finance.',
      'Mission Control workspace for updates, data rooms, and sprints.',
    ],
    to: '/signup/email?role=founder',
    cta: 'Apply as a founder',
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="bg-night-soft/60 px-4 py-16">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-[0_40px_120px_-40px_rgba(91,33,209,0.42)]">
        <div className="grid gap-10 p-10 md:grid-cols-[0.9fr_1.1fr] md:p-16">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sprout">Activate access</p>
            <h1 className="text-3xl font-semibold text-night">Choose your LaunchAndLift onboarding path</h1>
            <p className="text-sm text-slate-600">
              LaunchAndLift provides tailored onboarding for investors and founders. Select the track that best fits your
              role to share details, unlock Mission Control, and collaborate with our team.
            </p>
            <div className="rounded-2xl bg-night-soft p-5 text-sm text-slate-600">
              <p className="font-semibold text-night">What to expect</p>
              <ul className="mt-3 space-y-2">
                <li>1. Submit your details using the relevant onboarding flow.</li>
                <li>2. Our team reviews your submission within two business days.</li>
                <li>3. Receive Mission Control credentials and next-step guidance.</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-6">
            {signupFlows.map((flow) => (
              <div
                key={flow.role}
                className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:border-sprout/60 hover:shadow-[0_28px_75px_rgba(46,220,146,0.25)]"
              >
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sprout">{flow.eyebrow}</p>
                  <h2 className="text-2xl font-semibold text-night">{flow.title}</h2>
                  <p className="text-sm text-slate-600">{flow.description}</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {flow.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-sprout" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <Link
                    to={flow.to}
                    className="inline-flex w-full items-center justify-center rounded-full bg-blossom px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[0_28px_75px_rgba(255,79,154,0.35)] transition hover:bg-royal"
                  >
                    {flow.cta}
                  </Link>
                </div>
              </div>
            ))}
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              <p className="font-semibold text-night">LaunchAndLift team member?</p>
              <p className="mt-2 mb-3">
                Admin access uses a separate authentication portal.
              </p>
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition"
              >
                Go to Admin Portal
              </Link>
            </div>

            <div className="text-xs text-slate-500">
              Already have credentials?{' '}
              <Link to="/login" className="font-semibold text-sunbeam hover:text-blossom">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
