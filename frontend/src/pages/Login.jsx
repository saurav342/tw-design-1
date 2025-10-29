import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const roles = [
  { value: 'investor', label: 'Investor' },
  { value: 'founder', label: 'Founder' },
  { value: 'admin', label: 'Admin' },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, setError, user } = useAuth();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    role: 'investor',
  });

  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => () => setError(null), [setError]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(formState);
      const redirectTo = location.state?.from?.pathname ?? `/dashboard/${response.user.role}`;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-night-soft/60 px-4 py-16">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-[0_40px_120px_-40px_rgba(91,33,209,0.42)] md:grid md:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-sunbeam via-blossom to-sprout p-10 text-white md:flex">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Welcome back
            </p>
            <h2 className="text-3xl font-semibold">Access LaunchAndLift Mission Control</h2>
            <p className="text-sm text-white/80">
              Review deal flow, track portfolio performance, and collaborate with LaunchAndLift operators.
            </p>
          </div>
          <div className="text-xs uppercase tracking-wide text-white/70">
            Need an account?{' '}
            <Link to="/signup" className="font-semibold text-white hover:text-mint">
              Activate LaunchAndLift access
            </Link>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <h1 className="text-2xl font-semibold text-night">Sign in to LaunchAndLift</h1>
          <p className="mt-2 text-sm text-slate-500">
            Secure login for investors, founders, and LaunchAndLift administrators.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-night">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formState.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-night focus:border-sprout focus:outline-none focus:ring-2 focus:ring-sprout"
                placeholder="you@launchandlift.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-night">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formState.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-night focus:border-sprout focus:outline-none focus:ring-2 focus:ring-sprout"
                placeholder="Enter your password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-semibold text-night">
                Sign in as
              </label>
              <select
                id="role"
                name="role"
                value={formState.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-night focus:border-sprout focus:outline-none focus:ring-2 focus:ring-sprout"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="rounded-xl bg-sunbeam/10 px-4 py-3 text-sm text-sunbeam">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blossom px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[0_28px_75px_rgba(255,79,154,0.35)] transition hover:bg-royal disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <button type="button" className="font-semibold text-sprout hover:text-mint">
              Forgot password?
            </button>
            <div className="flex items-center gap-2">
              <span>Need access?</span>
              <Link to="/signup/investor" className="font-semibold text-sunbeam hover:text-blossom">
                Investor
              </Link>
              <span className="text-slate-400">/</span>
              <Link to="/signup/founder" className="font-semibold text-sunbeam hover:text-blossom">
                Founder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
