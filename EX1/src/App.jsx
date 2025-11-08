import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { useScrollAnimations, useParallax, useButtonRipple, useMagneticCards } from './hooks/useScrollAnimations';

function App() {
  useScrollAnimations();
  useParallax();
  useButtonRipple();
  useMagneticCards();

  useEffect(() => {
    // Smooth reveal on page load
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 100);

    // Console log
    console.log('%c🚀 Launch and Lift', 'color: #6366f1; font-size: 24px; font-weight: bold;');
    console.log('%cBuilt with ❤️ and modern web technologies', 'color: #8b5cf6; font-size: 14px;');
  }, []);

  return (
    <div className="App">
      <Header />
      <Hero />
     
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;

