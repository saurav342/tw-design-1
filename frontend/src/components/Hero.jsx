import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Zap, Users, Target, Clock, DollarSign, Building2, Handshake, FileText, Database } from 'lucide-react';

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
                // Create a wrapper function that preserves the suffix
                const originalAnimateCounter = animateCounter;
                const animateWithSuffix = (element, targetValue, duration = 2000) => {
                  const start = 0;
                  const increment = targetValue / (duration / 16);
                  let current = start;
                  
                  const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetValue) {
                      element.textContent = formatNumber(targetValue) + suffix;
                      clearInterval(timer);
                    } else {
                      element.textContent = formatNumber(Math.floor(current)) + suffix;
                    }
                  }, 16);
                };
                animateWithSuffix(stat, target);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const stats = [
    {
      value: '2200+',
      label: 'Investors',
      icon: Users,
      gradient: 'from-[#8b5cf6] to-[#a78bfa]',
    },
    {
      value: '400+',
      label: 'Startups Onboarded',
      icon: Building2,
      gradient: 'from-[#ff4fa3] to-[#ff6bb3]',
    },
    {
      value: '1100+',
      label: 'Meetings Arranged',
      icon: Handshake,
      gradient: 'from-[#34d399] to-[#6ee7b7]',
    },
    {
      value: '250+',
      label: 'Pitch Decks',
      icon: FileText,
      gradient: 'from-[#f59e0b] to-[#fbbf24]',
    },
    {
      value: '100+',
      label: 'Data Signals',
      icon: Database,
      gradient: 'from-[#ec4899] to-[#f472b6]',
    },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#fef6ff] to-[#f0fff4]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#ff4fa3]/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#34d399]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#8b5cf6]/10 to-transparent rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.03]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#8b5cf6]/20 shadow-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff4fa3] to-[#8b5cf6] animate-pulse" />
            <span className="text-xs font-semibold text-[#8b5cf6] uppercase tracking-wider">
              AI-Powered Fundraising Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <div className="text-[#1a1030]">Transform Your</div>
            <div>
              <span 
                className="bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{
                  animation: 'gradient 8s ease infinite',
                }}
              >
                Fundraising
              </span>
              <span className="text-[#1a1030]"> Journey</span>
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-[#3b2a57] mb-10 max-w-lg mx-auto leading-tight font-medium"
          >
            <span className="block">Connect with aligned investors in days, not months.</span>
            <span className="block whitespace-nowrap">Leverage AI-powered matching, comprehensive profiling, and integrated support.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/founders"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[#34d399] text-white font-semibold text-lg shadow-[0_20px_60px_-15px_rgba(52,211,153,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(52,211,153,0.6)] hover:bg-[#10b981] transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                For Founders
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </Link>
            
            <Link
              to="/investors"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-[#8b5cf6]/30 text-[#1a1030] font-semibold text-lg shadow-sm hover:shadow-md hover:border-[#8b5cf6]/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                For Investors
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            ref={statsRef}
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  className="group relative p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(139,92,246,0.12)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.2)] transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`relative mb-3 inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Stat Value */}
                  <div className="relative">
                    <div className={`text-3xl font-bold mb-1.5 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent stat-number`}>
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-[#3b2a57] uppercase tracking-wide stat-label">
                      {stat.label}
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5cf6]/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
