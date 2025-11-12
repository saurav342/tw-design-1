import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import {
  Building2,
  Menu,
  X,
  Home,
  Briefcase,
  Heart,
  DollarSign,
  Rocket,
  Users,
  Settings,
  BookOpen,
  LogOut,
  ChevronDown,
  Search,
  Bell,
  User,
  TrendingUp,
  FileText,
  Sparkles,
} from 'lucide-react';
import logoImage from '../assets/image.png';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardHeader = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/dashboard/investor' || path === '/dashboard/founder') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Investor-specific navigation
  const investorNavLinks = [
    {
      label: 'Dashboard',
      path: '/dashboard/investor',
      icon: Home,
      description: 'Overview & stats',
    },
    {
      label: 'Marketplace',
      path: '/dashboard/investor',
      icon: Building2,
      description: 'Browse startups',
      badge: 'all',
    },
    {
      label: 'Interested',
      path: '/dashboard/investor',
      icon: Heart,
      description: 'Saved startups',
      badge: 'interested',
    },
    {
      label: 'Portfolio',
      path: '/dashboard/investor',
      icon: Briefcase,
      description: 'My investments',
      badge: 'portfolio',
    },
    {
      label: 'Resources',
      path: '/resources',
      icon: BookOpen,
      description: 'Guides & tools',
    },
  ];

  // Founder-specific navigation
  const founderNavLinks = [
    {
      label: 'Dashboard',
      path: '/dashboard/founder',
      icon: Home,
      description: 'Overview & activity',
    },
    {
      label: 'Marketplace',
      path: '/dashboard/founder/marketplace',
      icon: Building2,
      description: 'Listing management',
    },
    {
      label: 'Success Fee',
      path: '/dashboard/founder/success-fee',
      icon: Rocket,
      description: 'Raise support',
    },
    {
      label: 'Services',
      path: '/dashboard/founder/services',
      icon: Sparkles,
      description: 'Expert support',
    },
    {
      label: 'Resources',
      path: '/resources',
      icon: BookOpen,
      description: 'Guides & tools',
    },
  ];

  const navLinks = role === 'investor' ? investorNavLinks : founderNavLinks;
  const userName = user?.fullName || user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-[1920px]">
        {/* Main Header Bar */}
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <Link
            to={role === 'investor' ? '/dashboard/investor' : '/dashboard/founder'}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src={logoImage}
                alt="Launch & Lift"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white"></div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Launch & Lift
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                  {role === 'investor' ? 'Investor' : 'Founder'}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              
              return (
                <Link
                  key={link.path + link.badge}
                  to={link.path}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 group
                    ${
                      active
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-600'}`} />
                  <span>{link.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Icon (Desktop) */}
            <button
              className="hidden lg:flex items-center justify-center h-9 w-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button
              className="hidden lg:flex relative items-center justify-center h-9 w-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-gray-900">{userName}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{role}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Link>
                      <Link
                        to="#"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        to="/resources"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Resources</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  
                  return (
                    <Link
                      key={link.path + link.badge}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                        transition-colors
                        ${
                          active
                            ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-l-4 border-purple-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-purple-600' : 'text-gray-500'}`} />
                      <div className="flex-1">
                        <p className="font-medium">{link.label}</p>
                        <p className="text-xs text-gray-500">{link.description}</p>
                      </div>
                    </Link>
                  );
                })}
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default DashboardHeader;

