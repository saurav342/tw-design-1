import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setScrolled(currentScroll > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="container nav-container">
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-icon">
              <img 
                src="/image.png" 
                className="h-12 sm:h-16 md:h-20 w-auto max-w-[200px] sm:max-w-[250px]" 
                alt="Launch and Lift" 
              />
            </span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="nav-links hidden lg:flex">
            <a href="#investors" onClick={(e) => handleSmoothScroll(e, '#investors')}>Investors</a>
            <a href="#founders" onClick={(e) => handleSmoothScroll(e, '#founders')}>Founders</a>
            <a href="#how" onClick={(e) => handleSmoothScroll(e, '#how')}>How We Work</a>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="nav-cta hidden lg:flex">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-outline">Sign Up</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
              <span className="logo-icon">
                <img 
                  src="/image.png" 
                  className="h-12 w-auto max-w-[180px]" 
                  alt="Launch and Lift" 
                />
              </span>
            </Link>
            <button
              type="button"
              className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none rounded-md"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <a
              href="#investors"
              onClick={(e) => handleSmoothScroll(e, '#investors')}
              className="block px-4 py-3 text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              Investors
            </a>
            <a
              href="#founders"
              onClick={(e) => handleSmoothScroll(e, '#founders')}
              className="block px-4 py-3 text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              Founders
            </a>
            <a
              href="#how"
              onClick={(e) => handleSmoothScroll(e, '#how')}
              className="block px-4 py-3 text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              How We Work
            </a>
          </nav>

          {/* Mobile CTA Buttons */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-purple-500 hover:text-purple-600 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

