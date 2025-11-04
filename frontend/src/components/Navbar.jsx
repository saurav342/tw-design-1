import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import logoImage from '../assets/image.png';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'FOR INVESTORS', to: '/investors' },
  { label: 'FOR FOUNDERS', to: '/founders' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Resources', to: '/resources' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className="sticky top-0 z-50 shadow-lg transition-shadow"
      style={{ fontFamily: '"Arial", sans-serif' }}
    >
      <div className="bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] shadow-[0_12px_35px_rgba(139,92,246,0.35)]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-white lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImage} alt="LaunchAndLift logo" className="h-20 w-60" />
            {/* <span className="font-display text-2xl font-semibold text-sunbeam">
              Launch<span className="text-sprout">&</span>Lift
            </span> */}
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.75h16.5M3.75 12h16.5M12 18.25h8.25"
              />
            </svg>
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            <div className="flex items-center gap-6">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'text-sm font-semibold uppercase tracking-[0.2em] transition',
                      isActive ? 'text-white' : 'text-white/70 hover:text-white',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {user ? (
              <nav
                aria-label="Account breadcrumb"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/${user.role}`)}
                  className="transition hover:text-white"
                >
                  Dashboard
                </button>
                <span className="text-white/50">/</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-full bg-white/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/20"
                >
                  Logout
                </button>
              </nav>
            ) : (
              <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.25em]">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="rounded-full border border-white/30 px-5 py-2 text-white transition hover:border-white hover:bg-white/10"
                >
                  Login
                </button>
                <Link
                  to="/signup"
                  className="text-white/80 transition hover:text-white"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#1a0f2f] px-4 py-4 text-white lg:hidden">
          <div className="space-y-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    'block rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wide transition',
                    isActive
                      ? 'bg-white/15 text-white shadow-inner'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <nav
                aria-label="Account breadcrumb"
                className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em]"
              >
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/dashboard/${user.role}`);
                    setMenuOpen(false);
                  }}
                  className="flex-1 text-left text-white/85 transition hover:text-white"
                >
                  Dashboard
                </button>
                <span className="px-2 text-white/50">/</span>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex-1 text-right text-white transition hover:text-white/80"
                >
                  Logout
                </button>
              </nav>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center rounded-md border border-white/30 px-3 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Login
                </button>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-center text-sm font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
