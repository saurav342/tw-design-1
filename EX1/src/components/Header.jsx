import { useEffect, useState } from 'react';

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
        <div className="logo">
          <span className="logo-icon">
            <img src="/image.png" width="250" height="50" alt="Launch and Lift" />
          </span>
        </div>
        <div className="nav-links">
          <a href="#solution" onClick={(e) => handleSmoothScroll(e, '#solution')}>Investors</a>
          <a href="#outcomes" onClick={(e) => handleSmoothScroll(e, '#outcomes')}>Founders</a>
          <a href="#how" onClick={(e) => handleSmoothScroll(e, '#how')}>How We Work</a>
        </div>
        <div className="nav-cta">
          <button className="btn btn-primary">Login</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default Header;

