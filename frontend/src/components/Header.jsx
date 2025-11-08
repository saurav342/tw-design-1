import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setScrolled(currentScroll > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <img src="/image.png" width="250" height="50" alt="Launch and Lift" />
          </span>
        </Link>
        <div className="nav-links">
          <a href="#investors" onClick={(e) => handleSmoothScroll(e, '#investors')}>Investors</a>
          <a href="#founders" onClick={(e) => handleSmoothScroll(e, '#founders')}>Founders</a>
          <a href="#how" onClick={(e) => handleSmoothScroll(e, '#how')}>How We Work</a>
        </div>
        <div className="nav-cta">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/signup" className="btn btn-outline">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;

