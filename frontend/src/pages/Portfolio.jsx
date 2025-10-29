import SectionHeader from '../components/SectionHeader';
import PortfolioGrid from '../components/PortfolioGrid';
import { portfolioEntries } from '../data/content';

const Portfolio = () => (
  <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 lg:px-8">
    <SectionHeader
      eyebrow="Portfolio"
      title="LaunchAndLift portfolio snapshots"
      description="A cross-section of LaunchAndLift-backed companies building climate resilience, applied AI, health, and infrastructure solutions."
    />
    <PortfolioGrid items={portfolioEntries} />
    <section className="rounded-3xl bg-night-soft p-8 text-sm text-slate-600">
      <p>
        Portfolio companies highlighted represent a subset of LaunchAndLift’s investments and may include realized and
        unrealized holdings. Data reflects publicly shareable information as of Q1 2025. For full details, investors can log in
        to LaunchAndLift Mission Control or contact our capital partnerships team.
      </p>
    </section>
  </div>
);

export default Portfolio;
