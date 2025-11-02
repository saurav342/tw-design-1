import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import FAQAccordion from '../components/FAQAccordion';
import Testimonials from '../components/Testimonials';
import {
  benefitHighlights,
  dashboardOfferings,
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

const Home = () => {
  const { scrollYProgress } = useScroll();
  const readingProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  const progressOpacity = useTransform(readingProgress, [0, 0.02], [0, 1]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: readingProgress, opacity: progressOpacity }}
        className="pointer-events-none fixed left-0 top-0 z-40 h-1 origin-left bg-gradient-to-r from-royal via-blossom to-sunbeam"
      />
      <div className="space-y-24 pb-24">
        <HeroSection />
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="relative overflow-hidden py-24"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-royal/15 via-white/30 to-sprout/15" />
          <div className="pointer-events-none absolute -right-32 -top-20 h-72 w-72 rounded-full bg-royal/20 blur-[140px]" />
          <div className="pointer-events-none absolute -bottom-36 left-20 h-72 w-72 rounded-full bg-sunbeam/30 blur-[160px]" />
          <div className="relative mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-5 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-night/60 shadow-sm shadow-white/80">
                {dashboardOfferings.intro.eyebrow}
              </span>
              <h2 className="font-display text-3xl font-semibold text-night md:text-5xl">
                {dashboardOfferings.intro.title}
              </h2>
              <p className="mx-auto max-w-3xl text-base text-night/70">
                {dashboardOfferings.intro.description}
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {dashboardOfferings.tracks.map((track) => (
                <MotionDiv
                  key={track.name}
                  variants={fadeUp}
                  whileHover={{ y: -14, scale: 1.015 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 24 }}
                  className="group relative flex h-full flex-col rounded-3xl border border-white/60 bg-white/85 p-7 shadow-xl shadow-[0_22px_60px_rgba(79,70,229,0.16)] backdrop-blur-sm transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 via-white/0 to-royal/0 transition-opacity duration-300 group-hover:via-white/60 group-hover:to-royal/10" />
                  <div className="relative flex items-center justify-between text-xs font-semibold uppercase tracking-[0.36em] text-night/50">
                    <span>{track.name}</span>
                    <span className="rounded-full bg-royal/10 px-3 py-1 text-[0.6rem] text-royal">{track.badge}</span>
                  </div>
                  <p className="relative mt-5 text-night/80">
                    {track.summary}
                  </p>
                  <ul className="relative mt-6 space-y-3 text-sm text-night/70">
                    {track.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-royal/70 shadow-[0_8px_20px_rgba(79,70,229,0.35)]" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="relative mt-8 inline-flex items-center justify-center rounded-full bg-royal px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-royal/40 transition-transform duration-200 hover:-translate-y-1 hover:bg-[#4338ca]"
                  >
                    {track.cta}
                  </button>
                </MotionDiv>
              ))}
            </div>
            <div className="mx-auto max-w-4xl rounded-3xl border border-white/60 bg-white/75 p-6 text-center text-sm text-night/60 shadow-lg shadow-[0_18px_40px_rgba(79,70,229,0.12)] backdrop-blur-sm">
              {dashboardOfferings.adminNote}
            </div>
          </div>
        </MotionSection>

    {/* <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="relative h-24 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sunbeam/60 via-white/40 to-blossom/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-royal via-blossom to-sunbeam opacity-70" />
    </MotionSection> */}

        <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
      className="mx-auto max-w-7xl px-4 lg:px-8"
    >
      <div className="space-y-6 text-center">
        <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-night/60 shadow-sm shadow-white/70">
          LaunchAndLift delivers
        </span>
        <h2 className="font-display text-3xl font-semibold text-night md:text-5xl">Momentum without the fundraising maze</h2>
        <p className="mx-auto max-w-3xl text-base text-night/70">
          The end-to-end platform that guides your entire raise—from narrative and numbers to curated investor conversations and confident closes.
        </p>
      </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {corePromises.map((promise) => (
            <MotionDiv
              key={promise.title}
              variants={fadeUp}
              whileHover={{ y: -14, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-[0_20px_55px_rgba(247,201,72,0.22)] transition-transform duration-300 hover:shadow-2xl hover:shadow-[0_30px_75px_rgba(255,79,154,0.28)]"
            >
            <div className="absolute inset-0 bg-gradient-to-br from-sunbeam/0 via-white/0 to-blossom/0 transition-all duration-300 group-hover:from-sunbeam/10 group-hover:via-white/50 group-hover:to-blossom/25" />
            <div className="relative">
              <h3 className="text-lg font-semibold text-night">{promise.title}</h3>
              <p className="mt-3 text-sm text-night/70">{promise.description}</p>
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-honey/70 via-sunbeam/30 to-blossom/20" />
      <div className="pointer-events-none absolute -top-24 right-10 h-56 w-56 rounded-full bg-white/40 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl space-y-12 px-4 lg:px-8">
        <div className="space-y-4 text-center">
          <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-night/60 shadow-sm shadow-white/80">
            How it works
          </span>
          <h2 className="font-display text-3xl font-semibold text-night md:text-5xl">Your roadmap from idea to investment</h2>
          <p className="mx-auto max-w-3xl text-base text-night/70">
            Structured, repeatable, and designed to compress your learning curve from months into weeks.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {processSteps.map((step) => (
            <MotionDiv
              key={step.title}
              variants={scaleIn}
              whileHover={{ y: -16, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 250, damping: 24 }}
              className="relative flex h-full flex-col rounded-3xl border border-white/60 bg-white/85 p-6 shadow-xl shadow-[0_22px_58px_rgba(247,201,72,0.24)] backdrop-blur-sm transition-transform duration-300"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.45em] text-night/50">{step.step}</span>
              <h3 className="mt-3 text-lg font-semibold text-night">{step.title}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-blossom">{step.timeline}</p>
              <ul className="mt-4 space-y-3 text-sm text-night/70">
                {step.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blossom" />
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
          <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-night/60 shadow-sm shadow-white/80">
            Features & benefits
          </span>
          <h2 className="font-display text-3xl font-semibold text-night md:text-5xl">Why founders choose LaunchAndLift</h2>
          <p className="text-base text-night/70">
            Every engagement blends technology, expert operators, and dedicated mentorship to maximise your probability of closing.
          </p>
          <div className="grid gap-4">
            {benefitHighlights.slice(0, 3).map((item) => (
              <MotionDiv
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 250, damping: 23 }}
                className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-[0_22px_58px_rgba(247,201,72,0.24)] transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-night">{item.title}</h3>
                <p className="mt-2 text-sm text-night/70">{item.description}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        <MotionDiv variants={fadeUp} className="space-y-4">
          {benefitHighlights.slice(3).map((item) => (
            <MotionDiv
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 250, damping: 23 }}
              className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-[0_22px_58px_rgba(247,201,72,0.24)] transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-night">{item.title}</h3>
              <p className="mt-2 text-sm text-night/70">{item.description}</p>
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
      className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-night via-royal to-blossom px-4 py-20 text-white lg:px-8"
    >
      <div className="pointer-events-none absolute -top-32 left-16 h-64 w-64 rounded-full bg-sunbeam/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-12 h-72 w-72 rounded-full bg-blossom/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl space-y-10 text-white">
        <div className="space-y-4">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-sunbeam/80">
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
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="rounded-3xl bg-white/10 p-6 backdrop-blur transition duration-300 hover:bg-white/15"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-sunbeam/80">Challenge</p>
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
            whileHover={{ y: -12, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 250, damping: 22 }}
            className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg shadow-[0_20px_55px_rgba(247,201,72,0.22)] transition-transform duration-300"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-blossom">What sets us apart</p>
            <h3 className="mt-3 text-base font-semibold text-night">{item.title}</h3>
            <p className="mt-2 text-sm text-night/70">{item.description}</p>
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-sunbeam/35 via-white/50 to-blossom/30" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-white/50 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl space-y-10 px-4 lg:px-8">
        <div className="space-y-4 text-center">
          <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-night/60 shadow-sm shadow-white/80">
            Comprehensive services
          </span>
          <h2 className="font-display text-3xl font-semibold text-night md:text-5xl">Everything you need to raise with confidence</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceCatalog.map((service) => (
            <MotionDiv
              key={service.title}
              variants={scaleIn}
              whileHover={{ y: -16, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg shadow-[0_22px_58px_rgba(247,201,72,0.24)] transition-transform duration-300 hover:shadow-2xl hover:shadow-[0_30px_80px_rgba(255,79,154,0.3)]"
            >
              <h3 className="text-lg font-semibold text-night">{service.title}</h3>
              <p className="mt-3 text-sm text-night/70">{service.description}</p>
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
      <div className="rounded-[3rem] bg-gradient-to-r from-lilac via-honey to-blossom px-6 py-12 text-night shadow-2xl shadow-[0_28px_80px_rgba(255,79,154,0.32)] md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-night/60">Trusted outcomes</p>
            <h2 className="font-display text-3xl font-semibold md:text-5xl">Trusted by founders, backed by results</h2>
            <p className="text-sm text-night/70">
              Proof that LaunchAndLift turns the fundraising grind into a guided, accelerated journey.
            </p>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center rounded-full bg-night/90 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-night"
            >
              Explore success stories
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {outcomeStats.map((stat) => (
              <MotionDiv
                key={stat.label}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className="rounded-3xl bg-white/75 p-6 text-night backdrop-blur shadow-lg shadow-white/30"
              >
                <p className="text-3xl font-semibold text-night">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-night/60">{stat.label}</p>
                <p className="mt-1 text-xs text-night/60">{stat.caption}</p>
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
        <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-night/60 shadow-sm shadow-white/80">
          Founder testimonials
        </span>
        <h2 className="font-display text-3xl font-semibold text-night md:text-5xl">Momentum you can feel</h2>
        <p className="mx-auto max-w-3xl text-base text-night/70">
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
        <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-night/60 shadow-sm shadow-white/80">
          Answers when you need them
        </span>
        <h2 className="font-display text-3xl font-semibold text-night md:text-5xl">Your fundraising questions, answered</h2>
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
          <span className="inline-block rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-night/60 shadow-sm shadow-white/80">
            Our story
          </span>
          <h2 className="font-display text-3xl font-semibold text-night md:text-5xl">Built by founders, for founders</h2>
          <p className="text-base text-night/70">{brandStory.mission}</p>
          <ul className="space-y-3 text-sm text-night/70">
            {brandStory.teamHighlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blossom" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </MotionDiv>
        <MotionDiv variants={fadeUp} className="rounded-[2.5rem] border border-white/60 bg-white/85 p-8 shadow-xl shadow-[0_22px_58px_rgba(247,201,72,0.24)] backdrop-blur-sm">
          <div className="space-y-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.35em] text-blossom">Resources for insight</span>
            <h3 className="font-display text-2xl font-semibold text-night">Guides that build your fundraising IQ</h3>
            <div className="space-y-4">
              {blogIdeas.map((idea) => (
                <div key={idea} className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm shadow-white/30">
                  <span className="mt-1 text-sm font-semibold text-blossom">•</span>
                  <span className="text-sm text-night/70">{idea}</span>
                </div>
              ))}
            </div>
            <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-night hover:text-blossom">
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
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-night via-royal to-blossom px-6 py-14 text-white shadow-2xl shadow-[0_32px_90px_rgba(23,11,46,0.5)] md:px-12">
        <div className="pointer-events-none absolute -top-16 right-16 h-48 w-48 rounded-full bg-sunbeam/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-20 h-56 w-56 rounded-full bg-blossom/35 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Let&apos;s build your raise</p>
            <h2 className="font-display text-3xl font-semibold md:text-5xl">{finalCta.headline}</h2>
            <p className="text-sm text-white/80">{finalCta.subheadline}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to={finalCta.primary.to}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sunbeam to-blossom px-6 py-3 text-sm font-semibold uppercase tracking-wide text-night transition hover:shadow-lg hover:shadow-[0_28px_75px_rgba(247,201,72,0.3)]"
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
  </>
);

};

export default Home;
