import { useEffect, useRef } from 'react';

const Hero = () => {
  const statsRef = useRef(null);

  useEffect(() => {
    // Counter animation for stats
    const animateCounter = (element, target, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = formatNumber(target);
          clearInterval(timer);
        } else {
          element.textContent = formatNumber(Math.floor(current));
        }
      }, 16);
    };

    const formatNumber = (num) => {
      if (num >= 1000) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return num;
    };

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            const text = stat.textContent;
            const match = text.match(/\d+/);
            if (match) {
              const target = parseInt(match[0]);
              const suffix = text.replace(/\d+/, '');
              stat.textContent = '0' + suffix;
              setTimeout(() => {
                animateCounter(stat, target);
                setTimeout(() => {
                  stat.textContent = text;
                }, 2000);
              }, 500);
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        statsObserver.unobserve(statsRef.current);
      }
    };
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
    <section className="hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        
        {/* Revolving Blob Animation like meetjamie.ai */}
        <div className="blob-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="blob blob-4"></div>
          <div className="blob blob-5"></div>
        </div>
      </div>
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your <span className="gradient-text">Fundraising</span> Journey
          </h1>
          <p className="hero-subtitle">
            Connect with aligned investors in days, not months. Leverage AI-powered matching, 
            comprehensive profiling, and integrated growth support.
          </p>
          <div className="hero-cta">
            <a href="#founders" className="btn btn-primary btn-large" onClick={(e) => handleSmoothScroll(e, '#founders')}>For Founders</a>
            <a href="#investors" className="btn btn-outline btn-large" onClick={(e) => handleSmoothScroll(e, '#investors')}>For Investors</a>
          </div>
          <div className="hero-stats" ref={statsRef}>
            <div className="stat-item">
              <div className="stat-number">$412B</div>
              <div className="stat-label">VC Market</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Data Signals</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">70%</div>
              <div className="stat-label">Faster Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

