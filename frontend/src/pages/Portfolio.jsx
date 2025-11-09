import { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
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
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 lg:px-8">
      <SectionHeader
        eyebrow="Portfolio"
        title="LaunchAndLift portfolio snapshots"
        description="A cross-section of LaunchAndLift-backed companies building climate resilience, applied AI, health, and infrastructure solutions."
      />
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Loading portfolio...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : portfolioItems.length === 0 ? (
        <div className="rounded-3xl bg-night-soft p-8 text-center">
          <p className="text-slate-600">No portfolio companies available yet.</p>
        </div>
      ) : (
        <PortfolioGrid items={portfolioItems} />
      )}
      <section className="rounded-3xl bg-night-soft p-8 text-sm text-slate-600">
        <p>
          Portfolio companies highlighted represent a subset of LaunchAndLift's investments and may include realized and
          unrealized holdings. Data reflects publicly shareable information as of Q1 2025. For full details, investors can log in
          to LaunchAndLift Mission Control or contact our capital partnerships team.
        </p>
      </section>
    </div>
  );
};

export default Portfolio;
