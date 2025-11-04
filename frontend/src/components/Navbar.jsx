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
    <header className="sticky top-0 z-50 bg-white/90 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoImage} alt="LaunchAndLift logo" className="h-20 w-60" />
          {/* <span className="font-display text-2xl font-semibold text-sunbeam">
            Launch<span className="text-sprout">&</span>Lift
          </span> */}
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-sunbeam px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blossom focus:outline-none focus:ring-2 focus:ring-mint lg:hidden"
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

        <div className="hidden items-center gap-10 lg:flex">
          <div className="flex items-center gap-6">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'text-sm font-medium uppercase tracking-wide transition',
                    isActive ? 'text-sunbeam' : 'text-slate-600 hover:text-sunbeam',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-sprout px-5 py-2 text-sm font-semibold text-sprout transition hover:border-sunbeam hover:text-sunbeam"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/${user.role}`)}
                  className="rounded-full bg-blossom px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[0_28px_75px_rgba(255,79,154,0.35)] transition hover:bg-royal focus:outline-none focus:ring-2 focus:ring-mint"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="rounded-full border border-sprout px-5 py-2 text-sm font-semibold text-sprout transition hover:border-sunbeam hover:text-sunbeam"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="rounded-full bg-blossom px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[0_28px_75px_rgba(255,79,154,0.35)] transition hover:bg-royal focus:outline-none focus:ring-2 focus:ring-mint"
                >
                  Join LaunchAndLift
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <div className="space-y-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    'block rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wide',
                    isActive ? 'bg-night-soft text-sunbeam' : 'text-slate-600 hover:bg-night-soft hover:text-sunbeam',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/dashboard/${user.role}`);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center rounded-md bg-blossom px-3 py-2 text-sm font-semibold text-white shadow hover:bg-royal"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center rounded-md border border-sprout px-3 py-2 text-sm font-semibold text-sprout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center rounded-md border border-sprout px-3 py-2 text-sm font-semibold text-sprout"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/signup');
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center rounded-md bg-blossom px-3 py-2 text-sm font-semibold text-white shadow hover:bg-royal"
                >
                  Join LaunchAndLift
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
