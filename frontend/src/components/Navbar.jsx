import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import logoImage from '../assets/image.png';

const navLinks = [
  { label: 'HOME', to: '/' },
  { label: 'INVESTORS', to: '/investors' },
  { label: 'FOUNDERS', to: '/founders' },
  { label: 'PORTFOLIO', to: '/portfolio' },
  { label: 'RESOURCES', to: '/resources' },
];

const NavLinkItem = ({ to, label }) => {
  const location = useLocation();
  const isActive = to === '/' 
    ? location.pathname === '/' 
    : location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <NavLink
      to={to}
      className={`relative text-sm font-medium transition-colors duration-200 pb-1 hover:text-purple-600 ${
        isActive ? 'text-purple-600 font-semibold' : 'text-gray-600'
      }`}
    >
      <span>{label}</span>
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
      )}
    </NavLink>
  );
};

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
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 transition-all duration-300 shadow-sm"
      style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logoImage} alt="Launch & Lift logo" className="h-16 w-auto transition-transform duration-300 group-hover:scale-105" />
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-6 w-6"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>

        <div className="hidden items-center gap-8 lg:flex">
          <div className="flex items-center gap-8">
            {navLinks.map((item) => (
              <NavLinkItem key={item.to} to={item.to} label={item.label} />
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/${user.role}`)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-sm hover:shadow-md hover:from-purple-700 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#ff4fa3] to-[#8b5cf6] rounded-lg shadow-lg hover:shadow-xl hover:from-[#ff6bb3] hover:to-[#a78bfa] transition-all duration-200 transform hover:scale-105"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 py-4 lg:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    'block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/dashboard/${user.role}`);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/login');
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#ff4fa3] to-[#8b5cf6] shadow-lg hover:shadow-xl hover:from-[#ff6bb3] hover:to-[#a78bfa] transition-all duration-200"
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
