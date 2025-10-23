import { Link } from 'react-router-dom';
import FAQAccordion from '../components/FAQAccordion';
import PortfolioGrid from '../components/PortfolioGrid';
import SectionHeader from '../components/SectionHeader';
import Testimonials from '../components/Testimonials';
import { investorHighlights, portfolioEntries, testimonials } from '../data/content';

const Investors = () => (
  <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12 lg:px-8">
    <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-6">
        <SectionHeader
          eyebrow="For investors"
          title="Build resilient exposure with LaunchAndLift"
          description={investorHighlights.intro}
          align="left"
        />
        <div className="grid gap-5">
          {investorHighlights.valueProps.map((value) => (
            <div key={value.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
              <h3 className="text-lg font-semibold text-brand-dark">{value.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/signup/investor" className="rounded-full bg-blaze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blaze/40 hover:bg-sunset">
            Request access
          </Link>
          <Link to="/resources" className="rounded-full border border-lagoon px-6 py-3 text-sm font-semibold uppercase tracking-wide text-lagoon hover:border-burnt hover:text-burnt">
            Download investor brief
          </Link>
        </div>
      </div>
      <div className="rounded-3xl bg-brand-muted p-8">
        <h3 className="text-2xl font-semibold text-brand-dark">
          LaunchAndLift Mission Control
        </h3>
        <p className="mt-3 text-sm text-slate-600">
          Real-time NAV, benchmarking, and portfolio intelligence delivered through our secure investor workspace. Track
          allocations, distribution waterfalls, and diligence updates in a unified dashboard.
        </p>
        <ul className="mt-6 space-y-4 text-sm text-slate-600">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-burnt" />
            Quarterly capital account statements and performance analytics.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sunset" />
            Portfolio construction support with co-investment alignment.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-lagoon" />
            ESG, impact, and compliance reporting built for family offices.
          </li>
        </ul>
      </div>
    </section>

    <section className="space-y-10">
      <SectionHeader
        eyebrow="How it works"
        title="Curated access with institutional rigor"
        description="A proven four-step model aligning LaunchAndLift with your goals from day one."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {investorHighlights.process.map((step) => (
          <div key={step.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-lagoon">
              {step.label}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-brand-dark">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-10">
      <SectionHeader
        eyebrow="Featured startups"
        title="Access vehicles built with founders"
        description="LaunchAndLift secures rightsized exposure with data-backed conviction."
      />
      <PortfolioGrid items={portfolioEntries.slice(0, 3)} condensed />
    </section>

    <section className="space-y-10">
      <SectionHeader
        eyebrow="Testimonials"
        title="Trusted by capital partners"
        description="Our investor network spans family offices, endowments, and impact-focused institutions."
      />
      <Testimonials
        items={testimonials.filter((item) => item.role.includes('Family Office') || item.role.includes('Investment'))}
      />
    </section>

    <section className="space-y-10">
      <SectionHeader
        eyebrow="Investor FAQ"
        title="Answers for capital partners"
        description="Transparency is core to LaunchAndLift. Here are the top questions we receive."
      />
      <FAQAccordion items={investorHighlights.faq} />
    </section>

    <section className="rounded-3xl bg-gradient-to-r from-lagoon via-neon to-blaze px-6 py-12 text-brand-dark shadow-lg shadow-lagoon/40">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
            Ready to co-invest?
          </p>
          <h3 className="text-3xl font-semibold">Book a LaunchAndLift allocation workshop.</h3>
          <p className="text-sm text-brand-dark/70">
            Share your objectives and our team will curate a roadmap tailored to your mandate.
          </p>
        </div>
        <Link to="/login" className="rounded-full bg-brand-dark px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-burnt">
          Schedule session
        </Link>
      </div>
    </section>
  </div>
);

export default Investors;
