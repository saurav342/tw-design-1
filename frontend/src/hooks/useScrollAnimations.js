import { useEffect } from 'react';

export const useScrollAnimations = () => {
  useEffect(() => {
    // Wait for DOM to be ready
    let observer = null;
    let animatedElements = [];

    const setupAnimations = () => {
      // Intersection Observer for scroll animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe all sections and cards
      animatedElements = document.querySelectorAll(
        '.problem-card, .feature-item, .feature-card, .section-header, .how-card, .metric-card, .testimonial-card, .pricing-card, .faq-item, .logo-item, .outcome-card, .case-card'
      );

      animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    };

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(setupAnimations, 100);
    
    return () => {
      clearTimeout(timeoutId);
      if (observer && animatedElements.length > 0) {
        animatedElements.forEach(el => observer.unobserve(el));
      }
    };
  }, []);
};

export const useParallax = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const orbs = document.querySelectorAll('.gradient-orb');
      
      orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.2);
        orb.style.transform = `translate(${scrolled * speed * 0.1}px, ${scrolled * speed * 0.05}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

export const useButtonRipple = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const button = e.target.closest('.btn');
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
      `;
      
      button.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
};

export const useMagneticCards = () => {
  useEffect(() => {
    let cards = [];
    let cleanup = null;

    const setupMagneticCards = () => {
      cards = document.querySelectorAll('.problem-card, .feature-card, .feature-item, .how-card, .metric-card, .testimonial-card, .pricing-card, .outcome-card, .case-card');

      const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        card.style.transform = `perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg) translateY(-10px)`;
      };

      const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = '';
      };

      cards.forEach(card => {
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });

      cleanup = () => {
        cards.forEach(card => {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };

    const timeoutId = setTimeout(setupMagneticCards, 100);
    
    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
  }, []);
};

