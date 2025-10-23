import { Link } from 'react-router-dom';
import FAQAccordion from '../components/FAQAccordion';
import PortfolioGrid from '../components/PortfolioGrid';
import SectionHeader from '../components/SectionHeader';
import Testimonials from '../components/Testimonials';
import { founderHighlights, portfolioEntries, testimonials } from '../data/content';

const Founders = () => (
  <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12 lg:px-8">
    <section className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div className="rounded-3xl bg-brand-muted p-8 shadow-sm shadow-lagoon/40">
        <SectionHeader
          eyebrow="For founders"
          title="Operator-led capital for purposeful scale"
          description={founderHighlights.intro}
          align="left"
        />
        <div className="mt-6 grid gap-4">
          {founderHighlights.valueProps.map((value) => (
            <div key={value.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200">
              <h3 className="text-lg font-semibold text-brand-dark">{value.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/signup/founder" className="rounded-full bg-blaze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blaze/40 hover:bg-sunset">
            Apply to LaunchAndLift
          </Link>
          <Link to="/resources" className="rounded-full border border-lagoon px-6 py-3 text-sm font-semibold uppercase tracking-wide text-lagoon hover:border-burnt hover:text-burnt">
            Download founder toolkit
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
          <h3 className="text-xl font-semibold text-brand-dark">Launch readiness score</h3>
          <p className="mt-3 text-sm text-slate-600">
            Founders join LaunchAndLift with a custom readiness blueprint. We run operator-led sprints to elevate product,
            go-to-market, finance, and team fundamentals within 12 weeks.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-blaze" />
              <span>Product-market alignment mapped through customer signal analysis.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-burnt" />
              <span>Revenue playbooks co-designed with LaunchAndLift go-to-market experts.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-lagoon" />
              <span>Fundraising narrative support including design, data rooms, and board prep.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
          <h3 className="text-xl font-semibold text-brand-dark">LaunchAndLift Studios</h3>
          <p className="mt-3 text-sm text-slate-600">
            From concept to product-market fit, LaunchAndLift Studios co-builds with founding teams, providing capital, design,
            engineering, and talent recruiting support.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-10">
      <SectionHeader
        eyebrow="Founder journey"
        title="Your path with LaunchAndLift"
        description="We stand up a dual-track growth plan covering capital, operators, and go-to-market momentum."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {founderHighlights.process.map((step) => (
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
        eyebrow="Founder stories"
        title="What our founders say"
        description="Operators become part of your team, so you can focus on product and customers."
      />
      <Testimonials items={testimonials.filter((item) => item.role.includes('Founder'))} />
    </section>

    <section className="space-y-10">
      <SectionHeader
        eyebrow="Portfolio momentum"
        title="Join high-velocity teams"
        description="A sampling of founders building with LaunchAndLift capital and operators."
      />
      <PortfolioGrid items={portfolioEntries.slice(0, 4)} condensed />
    </section>

    <section className="space-y-10">
      <SectionHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about partnering with LaunchAndLift."
      />
      <FAQAccordion items={founderHighlights.faq} />
    </section>

    <section className="rounded-3xl bg-gradient-to-r from-burnt via-sunset to-blaze px-6 py-12 text-white shadow-2xl shadow-burnt/40">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Apply</p>
          <h3 className="text-3xl font-semibold">Share your deck and meet LaunchAndLift operators.</h3>
          <p className="text-sm text-white/80">
            We review submissions weekly and respond with next steps within seven business days.
          </p>
        </div>
        <Link to="/signup/founder" className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-burnt hover:bg-neon hover:text-brand-dark">
          Submit your company
        </Link>
      </div>
    </section>
  </div>
);

export default Founders;
