import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Rocket, Sparkles, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import PortfolioGrid from '../components/PortfolioGrid';
import { contentApi } from '../services/api.js';

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await contentApi.portfolio();
        const items = Array.isArray(response?.items) ? response.items : [];
        setPortfolioItems(items);
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
        setError('Failed to load portfolio data. Please try again later.');
        // Fallback to empty array on error
        setPortfolioItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-purple-50/30">
      {/* Animated Background Orbs */}
      <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-purple-200/40 blur-[120px]" />
      <div className="absolute right-[-80px] top-[200px] h-[350px] w-[350px] rounded-full bg-pink-200/30 blur-[100px]" />
      <div className="absolute bottom-[-150px] left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-indigo-200/20 blur-[120px]" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 pt-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 shadow-sm backdrop-blur-sm"
            >
              <Briefcase className="h-4 w-4" />
              Portfolio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-night md:text-6xl lg:text-7xl"
            >
              <span className="font-bold text-[#8b5cf6]">Launch & Lift</span> portfolio{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                snapshots
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-night/70 md:text-xl"
            >
              A cross-section of Launch & Lift-backed companies building climate resilience, applied AI, health, and infrastructure solutions.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-3">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-night">{portfolioItems.length}+</div>
                  <div className="text-xs text-night/70 uppercase tracking-wide">Companies</div>
                </div>
              </div>
              <div className="h-12 w-px bg-night/10" />
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-night">Active</div>
                  <div className="text-xs text-night/70 uppercase tracking-wide">Portfolio</div>
                </div>
              </div>
              <div className="h-12 w-px bg-night/10" />
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-pink-500 to-rose-500 p-3">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-night">Diverse</div>
                  <div className="text-xs text-night/70 uppercase tracking-wide">Sectors</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section className="relative py-12">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
              <p className="text-lg font-medium text-night/70">Loading portfolio companies...</p>
              <p className="mt-2 text-sm text-night/50">Discovering innovative startups</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50/50 p-12 text-center shadow-lg"
            >
              <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load Portfolio</h3>
              <p className="text-red-700">{error}</p>
            </motion.div>
          ) : portfolioItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-12 text-center shadow-lg"
            >
              <Briefcase className="mx-auto h-16 w-16 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-night mb-2">Portfolio Coming Soon</h3>
              <p className="text-night/70">No portfolio companies available yet. Check back soon for updates.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <PortfolioGrid items={portfolioItems} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer Note Section */}
      <section className="relative py-12">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-purple-200/50 bg-gradient-to-br from-white/80 to-purple-50/30 p-8 backdrop-blur-sm shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-3 flex-shrink-0">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-night mb-2 uppercase tracking-wide">Portfolio Disclosure</h3>
                <p className="text-sm leading-relaxed text-night/70">
                  Portfolio companies highlighted represent a subset of{' '}
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Launch & Lift
                  </span>
                  's investments and may include realized and unrealized holdings. Data reflects publicly shareable information as of Q1 2025. For full details, investors can log in to{' '}
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Launch & Lift
                  </span>{' '}
                  Mission Control or contact our capital partnerships team.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
