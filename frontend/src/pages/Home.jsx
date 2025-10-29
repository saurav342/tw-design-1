import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import FAQAccordion from '../components/FAQAccordion';
import Testimonials from '../components/Testimonials';
import {
  benefitHighlights,
  blogIdeas,
  brandStory,
  corePromises,
  differentiators,
  faqItems,
  finalCta,
  founderSignals,
  homeIntro,
  homeTestimonials,
  outcomeStats,
  problemSolutions,
  processSteps,
  serviceCatalog,
} from '../data/content';

const MotionSection = motion.section;
const MotionDiv = motion.div;

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};

const Home = () => (
  <div className="space-y-24 pb-24">
    <HeroSection />

    {/* <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="relative h-24 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-aurora/60 via-white/40 to-solstice/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-amberflare via-solstice to-aurora opacity-70" />
    </MotionSection> */}

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
      className="mx-auto max-w-7xl px-4 lg:px-8"
    >
      <div className="space-y-6 text-center">
        <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-midnight/60 shadow-sm shadow-white/70">
          LaunchAndLift delivers
        </span>
        <h2 className="font-display text-3xl font-semibold text-midnight md:text-5xl">Momentum without the fundraising maze</h2>
        <p className="mx-auto max-w-3xl text-base text-midnight/70">
          The end-to-end platform that guides your entire raise—from narrative and numbers to curated investor conversations and confident closes.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {corePromises.map((promise) => (
          <MotionDiv
            key={promise.title}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-[#FFBA5A]/20 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#FF9966]/40"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-aurora/0 via-white/0 to-solstice/0 transition-all duration-300 group-hover:from-aurora/10 group-hover:via-white/50 group-hover:to-solstice/25" />
            <div className="relative">
              <h3 className="text-lg font-semibold text-midnight">{promise.title}</h3>
              <p className="mt-3 text-sm text-midnight/70">{promise.description}</p>
            </div>
          </MotionDiv>
        ))}
      </div>
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="relative overflow-hidden py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFF1BF]/70 via-aurora/30 to-solstice/20" />
      <div className="pointer-events-none absolute -top-24 right-10 h-56 w-56 rounded-full bg-white/40 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl space-y-12 px-4 lg:px-8">
        <div className="space-y-4 text-center">
          <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-midnight/60 shadow-sm shadow-white/80">
            How it works
          </span>
          <h2 className="font-display text-3xl font-semibold text-midnight md:text-5xl">Your roadmap from idea to investment</h2>
          <p className="mx-auto max-w-3xl text-base text-midnight/70">
            Structured, repeatable, and designed to compress your learning curve from months into weeks.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {processSteps.map((step) => (
            <MotionDiv
              key={step.title}
              variants={scaleIn}
              className="relative flex h-full flex-col rounded-3xl border border-white/60 bg-white/85 p-6 shadow-xl shadow-[#FFBB4A]/25 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1.5"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.45em] text-midnight/50">{step.step}</span>
              <h3 className="mt-3 text-lg font-semibold text-midnight">{step.title}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-solstice">{step.timeline}</p>
              <ul className="mt-4 space-y-3 text-sm text-midnight/70">
                {step.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-solstice" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
      className="mx-auto max-w-7xl px-4 lg:px-8"
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <MotionDiv variants={fadeUp} className="space-y-6">
          <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-midnight/60 shadow-sm shadow-white/80">
            Features & benefits
          </span>
          <h2 className="font-display text-3xl font-semibold text-midnight md:text-5xl">Why founders choose LaunchAndLift</h2>
          <p className="text-base text-midnight/70">
            Every engagement blends technology, expert operators, and dedicated mentorship to maximise your probability of closing.
          </p>
          <div className="grid gap-4">
            {benefitHighlights.slice(0, 3).map((item) => (
              <MotionDiv
                key={item.title}
                variants={fadeUp}
                className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-[#FFBC58]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF9966]/40"
              >
                <h3 className="text-lg font-semibold text-midnight">{item.title}</h3>
                <p className="mt-2 text-sm text-midnight/70">{item.description}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        <MotionDiv variants={fadeUp} className="space-y-4">
          {benefitHighlights.slice(3).map((item) => (
            <MotionDiv
              key={item.title}
              variants={fadeUp}
              className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-[#FFBC58]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF9966]/40"
            >
              <h3 className="text-lg font-semibold text-midnight">{item.title}</h3>
              <p className="mt-2 text-sm text-midnight/70">{item.description}</p>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-midnight via-[#2D224D] to-[#552A7B] px-4 py-20 text-white lg:px-8"
    >
      <div className="pointer-events-none absolute -top-32 left-16 h-64 w-64 rounded-full bg-aurora/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-12 h-72 w-72 rounded-full bg-solstice/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl space-y-10 text-white">
        <div className="space-y-4">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-aurora/80">
            Fundraising shouldn&apos;t be this hard
          </span>
          <h2 className="font-display text-3xl font-semibold md:text-5xl">From frustration to founder momentum</h2>
          <p className="max-w-3xl text-base text-white/80">
            LaunchAndLift replaces guesswork with choreography—pairing your unique story with investors ready to act.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {problemSolutions.map((item) => (
            <MotionDiv
              key={item.problem}
              variants={fadeUp}
              className="rounded-3xl bg-white/10 p-6 backdrop-blur transition duration-300 hover:bg-white/15"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-aurora/80">Challenge</p>
              <p className="mt-2 text-base font-semibold text-white">{item.problem}</p>
              <p className="mt-4 text-sm text-white/85">{item.solution}</p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="mx-auto max-w-7xl px-4 lg:px-8"
    >
      <div className="grid gap-6 md:grid-cols-5">
        {differentiators.map((item) => (
          <MotionDiv
            key={item.title}
            variants={fadeUp}
            className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg shadow-[#FFBC58]/20 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF9966]/40"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-solstice">What sets us apart</p>
            <h3 className="mt-3 text-base font-semibold text-midnight">{item.title}</h3>
            <p className="mt-2 text-sm text-midnight/70">{item.description}</p>
          </MotionDiv>
        ))}
      </div>
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="relative overflow-hidden py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-aurora/35 via-white/50 to-solstice/30" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-white/50 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl space-y-10 px-4 lg:px-8">
        <div className="space-y-4 text-center">
          <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-midnight/60 shadow-sm shadow-white/80">
            Comprehensive services
          </span>
          <h2 className="font-display text-3xl font-semibold text-midnight md:text-5xl">Everything you need to raise with confidence</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceCatalog.map((service) => (
            <MotionDiv
              key={service.title}
              variants={scaleIn}
              className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg shadow-[#FFBC58]/25 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#FF9966]/45"
            >
              <h3 className="text-lg font-semibold text-midnight">{service.title}</h3>
              <p className="mt-3 text-sm text-midnight/70">{service.description}</p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="mx-auto max-w-6xl px-4 lg:px-0"
    >
      <div className="rounded-[3rem] bg-gradient-to-r from-[#FFF2C7] via-[#FFD37C] to-[#FF9A5B] px-6 py-12 text-midnight shadow-2xl shadow-[#FF9E5E]/40 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-midnight/60">Trusted outcomes</p>
            <h2 className="font-display text-3xl font-semibold md:text-5xl">Trusted by founders, backed by results</h2>
            <p className="text-sm text-midnight/70">
              Proof that LaunchAndLift turns the fundraising grind into a guided, accelerated journey.
            </p>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center rounded-full bg-midnight/90 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-midnight"
            >
              Explore success stories
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {outcomeStats.map((stat) => (
              <MotionDiv key={stat.label} variants={scaleIn} className="rounded-3xl bg-white/75 p-6 text-midnight backdrop-blur shadow-lg shadow-white/30">
                <p className="text-3xl font-semibold text-midnight">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-midnight/60">{stat.label}</p>
                <p className="mt-1 text-xs text-midnight/60">{stat.caption}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="mx-auto max-w-7xl space-y-12 px-4 lg:px-8"
    >
      <div className="space-y-4 text-center">
        <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-midnight/60 shadow-sm shadow-white/80">
          Founder testimonials
        </span>
        <h2 className="font-display text-3xl font-semibold text-midnight md:text-5xl">Momentum you can feel</h2>
        <p className="mx-auto max-w-3xl text-base text-midnight/70">
          Hear from founders who transformed their fundraise with LaunchAndLift&apos;s operators, mentors, and investor network.
        </p>
      </div>
      <Testimonials items={homeTestimonials} />
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="mx-auto max-w-7xl space-y-10 px-4 lg:px-8"
    >
      <div className="space-y-4 text-center">
        <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-midnight/60 shadow-sm shadow-white/80">
          Answers when you need them
        </span>
        <h2 className="font-display text-3xl font-semibold text-midnight md:text-5xl">Your fundraising questions, answered</h2>
      </div>
      <FAQAccordion items={faqItems} />
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="mx-auto max-w-7xl px-4 lg:px-8"
    >
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <MotionDiv variants={fadeUp} className="space-y-5">
          <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-midnight/60 shadow-sm shadow-white/80">
            Our story
          </span>
          <h2 className="font-display text-3xl font-semibold text-midnight md:text-5xl">Built by founders, for founders</h2>
          <p className="text-base text-midnight/70">{brandStory.mission}</p>
          <ul className="space-y-3 text-sm text-midnight/70">
            {brandStory.teamHighlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-solstice" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </MotionDiv>
        <MotionDiv variants={fadeUp} className="rounded-[2.5rem] border border-white/60 bg-white/85 p-8 shadow-xl shadow-[#FFBC58]/25 backdrop-blur-sm">
          <div className="space-y-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.35em] text-solstice">Resources for insight</span>
            <h3 className="font-display text-2xl font-semibold text-midnight">Guides that build your fundraising IQ</h3>
            <div className="space-y-4">
              {blogIdeas.map((idea) => (
                <div key={idea} className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm shadow-white/30">
                  <span className="mt-1 text-sm font-semibold text-solstice">•</span>
                  <span className="text-sm text-midnight/70">{idea}</span>
                </div>
              ))}
            </div>
            <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-midnight hover:text-solstice">
              Browse our resource library
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0-6-6m6 6-6 6" />
              </svg>
            </Link>
          </div>
        </MotionDiv>
      </div>
    </MotionSection>

    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={scaleIn}
      className="mx-auto max-w-6xl px-4 lg:px-0"
    >
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-midnight via-[#251E53] to-[#412567] px-6 py-14 text-white shadow-2xl shadow-midnight/50 md:px-12">
        <div className="pointer-events-none absolute -top-16 right-16 h-48 w-48 rounded-full bg-aurora/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-20 h-56 w-56 rounded-full bg-solstice/35 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Let&apos;s build your raise</p>
            <h2 className="font-display text-3xl font-semibold md:text-5xl">{finalCta.headline}</h2>
            <p className="text-sm text-white/80">{finalCta.subheadline}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to={finalCta.primary.to}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-aurora to-solstice px-6 py-3 text-sm font-semibold uppercase tracking-wide text-midnight transition hover:shadow-lg hover:shadow-aurora/30"
            >
              {finalCta.primary.label}
            </Link>
            <Link
              to={finalCta.secondary.to}
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              {finalCta.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </MotionSection>
  </div>
);

export default Home;
