import { motion } from 'framer-motion';
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

const MotionDiv = motion.div;

const HeroSection = () => (
  <section
    className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFF6D7] via-[#FFE085] to-[#FF935C] text-midnight"
    style={{ fontFamily: 'var(--framer-blockquote-font-family, var(--framer-font-family, "Space Grotesk"))' }}
  >
    <MotionDiv
      aria-hidden="true"
      animate={{ rotate: [0, 6, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-44 -left-32 h-[32rem] w-[32rem] rounded-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-aurora/60 via-amberflare/30 to-solstice/50 blur-[140px]"
    />
    <MotionDiv
      aria-hidden="true"
      animate={{ rotate: [0, -8, 0] }}
      transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -bottom-52 right-[-6rem] h-[36rem] w-[36rem] rounded-full bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-solstice/50 via-amberflare/20 to-aurora/60 blur-[160px]"
    />

    <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col items-center gap-16 px-4 pt-28 pb-24 sm:px-6 lg:flex-row lg:px-8 lg:pt-10 lg:pb-32">
      <div className="flex-1 max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-midnight/70 shadow-glow-amber">
          LaunchAndLift
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-midnight sm:text-5xl lg:text-6xl">
          {homeIntro.headline}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-midnight/70 sm:text-lg">
          {homeIntro.subheadline}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amberflare via-solstice to-[#FF6F3C] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-midnight shadow-glow-amber transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#FF8A3D]/40 sm:text-base">
            {homeIntro.primaryCta.label}
          </button>
          <button className="flex items-center gap-2 rounded-full border border-midnight/10 bg-white/40 px-6 py-3 text-sm font-semibold text-midnight transition-all duration-200 hover:bg-white/60 sm:text-base">
            <svg className="h-4 w-4 text-solstice" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            How it works
          </button>
        </div>

        <ul className="mt-8 space-y-3">
          {[
            'Book unlimited 1-on-1 calls',
            'New challenge? Pick a new mentor',
            'No pitches. Just honest advice.',
          ].map((text) => (
            <li key={text} className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora to-solstice">
                <svg className="h-4 w-4 text-midnight" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-midnight/80 sm:text-base">{text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex max-w-xl flex-wrap gap-x-10 gap-y-6 border-t border-midnight/10 pt-8">
          {[
            { number: '50,000+', label: 'Sessions booked' },
            { number: '750+', label: 'Vetted mentors' },
            { number: '4.8/5', label: 'Average session rating' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <div className="text-xl font-semibold text-midnight sm:text-2xl">{stat.number}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-midnight/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center lg:justify-end w-full">
        <div className="relative max-w-md w-full mx-auto lg:mx-0">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-aurora to-solstice ring-2 ring-white/60 shadow-2xl shadow-[#FFAB4C]/50" />
            <div className="absolute left-1/2 top-full h-10 w-0.5 -translate-x-1/2 bg-gradient-to-b from-white/60 to-transparent" />
          </div>

          <MotionDiv
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl shadow-lg shadow-[#FFB347]/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold uppercase tracking-wide text-midnight/60">Find a mentor</span>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/70 text-midnight shadow-sm transition-colors hover:bg-white">
                  <svg className="h-4 w-4 text-solstice" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-midnight/90 px-4 py-2 text-sm font-medium text-white">
                <span className="text-amberflare">#</span>
                Fundraising partner
              </div>
            </div>

            <MotionDiv
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl bg-white/90 px-4 py-3 shadow-xl shadow-[#FFBC58]/40 backdrop-blur"
            >
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#FF9E5E] to-[#FD7A47]" />

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold leading-tight text-midnight">Agata</div>
                <div className="text-[11px] leading-tight text-midnight/60">VP Growth at DemoCo</div>
              </div>

              <button className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-solstice text-midnight shadow-md shadow-[#FF935C]/40 transition-colors hover:bg-[#FF6F3C] hover:text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </MotionDiv>

            <MotionDiv
              animate={{ x: [0, 3, 0, -3, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mt-6 flex items-center gap-3 pl-4"
            >
              <div className="flex -space-x-2">
                {[
                  'from-[#FFE066] to-[#FFB100]',
                  'from-[#FFB347] to-[#FF6F3C]',
                  'from-[#FFC15E] to-[#F79256]',
                  'from-[#FFF1A6] to-[#FFBD3F]',
                ].map((gradient) => (
                  <div
                    key={gradient}
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradient} ring-2 ring-white/70 shadow-lg shadow-[#FFAB4C]/40`}
                  />
                ))}
              </div>

              <svg className="h-5 w-5 rotate-12 text-midnight/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
              </svg>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
