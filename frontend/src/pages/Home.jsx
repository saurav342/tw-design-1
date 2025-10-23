import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import StatsPanel from '../components/StatsPanel';
import VideoCarousel from '../components/VideoCarousel';
import PortfolioGrid from '../components/PortfolioGrid';
import Testimonials from '../components/Testimonials';
import TeamGrid from '../components/TeamGrid';
import NewsTicker from '../components/NewsTicker';
import {
  ecosystem,
  heroContent,
  newsItems,
  portfolioEntries,
  stats,
  team,
  testimonials,
  videoShowcase,
} from '../data/content';

const Home = () => (
  <div className="space-y-20 pb-20">
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-muted via-white to-neon/10">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-r from-burnt via-blaze to-lagoon opacity-20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lagoon">
            {heroContent.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold text-brand-dark sm:text-5xl">
            {heroContent.title}
          </h1>
          <p className="text-base text-slate-600">{heroContent.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            {heroContent.ctas.map((cta) => (
              <Link
                key={cta.to}
                to={cta.to}
                className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition ${
                  cta.style === 'primary'
                    ? 'bg-blaze text-white shadow-lg shadow-blaze/40 hover:bg-sunset'
                    : 'border border-lagoon text-lagoon hover:border-burnt hover:text-burnt'
                }`}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white bg-white/70 p-6 shadow-xl shadow-brand-muted/60 backdrop-blur">
          <SectionHeader
            eyebrow="Mission statement"
            title="Launch bold ideas. Lift lasting value."
            description="LaunchAndLift exists to accelerate private market innovation responsibly. We align capital, operators, and data to help founders build enduring companies while delivering resilient outcomes for investors."
            align="left"
          />
          <div className="mt-6 rounded-2xl bg-brand-muted p-4 text-sm text-slate-600">
            We invest in climate resilience, applied AI, health, and infrastructure while supporting founders with our
            LaunchAndLift Mission Control operating system.
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
        <StatsPanel items={stats} />
      </div>
    </section>

    <section className="mx-auto max-w-7xl space-y-10 px-4 lg:px-8" id="ecosystem">
      <SectionHeader
        eyebrow="Ecosystem"
        title="The LaunchAndLift platform"
        description={ecosystem.overview}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {ecosystem.pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200"
          >
            <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${pillar.color}`}>
              {pillar.title}
            </div>
            <p className="mt-4 text-sm text-slate-600">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 lg:px-0">
      <VideoCarousel items={videoShowcase} />
    </section>

    <section className="mx-auto max-w-7xl space-y-10 px-4 lg:px-8" id="portfolio">
      <SectionHeader
        eyebrow="Portfolio"
        title="Companies catalyzed by LaunchAndLift"
        description="We back founders building solutions for climate, infrastructure, health, and applied AI. Explore a sampling of the teams scaling with LaunchAndLift."
      />
      <PortfolioGrid items={portfolioEntries.slice(0, 6)} />
    </section>

    <section className="bg-brand-muted/60 py-16">
      <div className="mx-auto max-w-7xl space-y-10 px-4 lg:px-8">
        <SectionHeader
          eyebrow="Platform features"
          title="Operate with LaunchAndLift Mission Control"
          description="Dashboards, diligence, and operator resources designed to accelerate your next milestone."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Mission Control Dashboard',
              description: 'Real-time portfolio visibility, KPIs, and scenario modeling for investors and founders.',
            },
            {
              title: 'Operator Guild',
              description: '70+ operators provide on-demand support across product, GTM, finance, and people.',
            },
            {
              title: 'Capital Continuum',
              description: 'Studio, venture, opportunity, and credit vehicles tailored for each growth stage.',
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white bg-white/90 p-6 shadow-lg shadow-white/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-lagoon">Platform</p>
              <h3 className="mt-3 text-lg font-semibold text-brand-dark">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              <Link to="/resources" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-burnt hover:text-blaze">
                Explore resources
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0-6-6m6 6-6 6" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl space-y-10 px-4 lg:px-8">
      <SectionHeader
        eyebrow="Meet the team"
        title="Operators, investors, and builders"
        description="Our multi-disciplinary team brings institutional investing rigor and operational depth from scaled startups."
      />
      <TeamGrid members={team} />
    </section>

    <section className="mx-auto max-w-7xl space-y-10 px-4 lg:px-8">
      <SectionHeader
        eyebrow="Testimonials"
        title="Stories from our community"
        description="Founders and investors share how LaunchAndLift unlocks measurable growth."
      />
      <Testimonials items={testimonials} />
    </section>

    <section className="mx-auto max-w-6xl px-4 lg:px-0">
      <NewsTicker items={newsItems} />
    </section>

    <section className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-burnt via-blaze to-lagoon px-6 py-12 text-white shadow-xl shadow-blaze/40">
      <div className="mx-auto flex flex-col items-start gap-6 text-left md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            Ready to launch?
          </p>
          <h2 className="text-3xl font-semibold">
            Partner with LaunchAndLift to accelerate your next inflection point.
          </h2>
          <p className="text-sm text-white/80">
            Investors gain resilient exposure while founders tap an operator-first growth engine.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/investors"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-burnt transition hover:bg-neon hover:text-brand-dark"
          >
            Investor access
          </Link>
          <Link
            to="/founders"
            className="inline-flex items-center justify-center rounded-full border border-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white/10"
          >
            Founder intake
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
