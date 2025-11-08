import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CTASection from '../components/CTASection';
import FooterEX1 from '../components/FooterEX1';
import FAQAccordion from '../components/FAQAccordion';
import Testimonials from '../components/Testimonials';
import { faqItems, homeTestimonials } from '../data/content';

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

const questionnaireRows = [
  {
    question: 'Stage of your startup',
    answer: 'Idea validation, MVP ready, pre-seed, seed, and Series A stories welcome.',
  },
  {
    question: 'Monthly recurring revenue',
    answer: 'From early pilots to INR 1 Cr+ MRR with vertical benchmarks for SaaS, climate, health, and consumer.',
  },
  {
    question: 'Capital target',
    answer: 'INR 3 Cr - INR 50 Cr with clarity on equity, venture debt, or blended structures.',
  },
  {
    question: 'Investor focus',
    answer: 'Strategic angels, family offices, Indian venture funds, and global partners chasing India growth.',
  },
  {
    question: 'Support you expect',
    answer: 'Narrative, pitch assets, data room build, model reviews, diligence prep, and warm introductions.',
  },
  {
    question: 'Ideal closing window',
    answer: 'Highly choreographed 4 - 16 week sprint with checkpoints every Friday from our HSR Bangalore studio.',
  },
];

const featureHighlights = [
  {
    title: 'Investor intelligence hub',
    description: 'Discover and prioritise aligned cheques using curated data from our deal desk.',
    benefits: [
      '300+ mapped investors tagged by sector, cheque size, and conviction signals.',
      'Weekly pulse on who is actively deploying into climate, SaaS, consumer, and health.',
      'Warm intro briefs authored in-house to prime every conversation with context.',
    ],
  },
  {
    title: 'Storycraft and collateral lab',
    description: 'Articulate your narrative with collateral that translates ambition into trust.',
    benefits: [
      'Pitch deck, teaser, and data room templates aligned with investor expectations.',
      'Financial model co-building with scenario planning and sensitivity analysis.',
      'Messaging sprints that convert traction, GTM, and moat into investor-ready soundbites.',
    ],
  },
  {
    title: 'Operator-led prep pods',
    description: 'Prep alongside ex-founders and operators who have closed rounds across the globe.',
    benefits: [
      'Mock diligence sessions that mirror real committee conversations.',
      'Negotiation playbooks to steer term sheets, valuation, and board structure.',
      'Dedicated accountability partner anchored in HSR Layout to keep momentum tight.',
    ],
  },
];

const differentiators = [
  {
    title: 'HSR Layout command centre',
    description: 'On-ground team embedded in Bengaluru’s founder hub for faster syncs and network access.',
  },
  {
    title: 'Data-backed matchmaking',
    description: 'Signals scored on traction, pace, and risk help you speak to funds ready to move.',
  },
  {
    title: 'Mentors on speed dial',
    description: 'Access sector operators and partners who join your boardrooms and negotiations.',
  },
  {
    title: 'Outcome-linked incentives',
    description: 'We win when you close—performance fees kick in only after funds hit your account.',
  },
];

const serviceStacks = [
  {
    title: 'Capital readiness',
    points: [
      'Vision narrative workshop',
      'Financial model diagnostics',
      'Data room and compliance checklist',
    ],
  },
  {
    title: 'Deal enablement',
    points: [
      'Investor longlist and prioritisation',
      'Warm intro orchestration with context notes',
      'Negotiation support and redline review',
    ],
  },
  {
    title: 'Growth catalysts',
    points: [
      'Mentor pool with GTM, product, and hiring expertise',
      'Revenue sprint design and tracking',
      'OKR and dashboard build to stay investor ready',
    ],
  },
  {
    title: 'Founder wellbeing',
    points: [
      'Leadership coaching pods',
      'Founder-only circles hosted monthly in HSR',
      'Templates to streamline investor updates',
    ],
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Clarity session',
    duration: 'Week 1',
    description: 'We audit your story, numbers, and round objective to define the sprint roadmap.',
  },
  {
    step: '02',
    title: 'Build and sharpen',
    duration: 'Weeks 2 - 4',
    description: 'Collateral, data room, and positioning upgrades led by sector specialists and operators.',
  },
  {
    step: '03',
    title: 'Investor motion',
    duration: 'Weeks 5 - 8',
    description: 'Warm introductions, conversation prep, and live feedback loops every 48 hours.',
  },
  {
    step: '04',
    title: 'Close with conviction',
    duration: 'Weeks 9 - 16',
    description: 'Term sheet navigation, diligence sprints, and closing support right through wiring.',
  },
];

const impactStats = [
  {
    value: '94%',
    caption: 'Founders securing second meetings within four weeks of launch.',
  },
  {
    value: '28 days',
    caption: 'Average time to first term sheet across SaaS, climate, and consumer brands.',
  },
  {
    value: 'INR 410 Cr',
    caption: 'Capital catalysed for India-first companies since 2021.',
  },
  {
    value: '70+ mentors',
    caption: 'Operators, ex-founders, and functional leaders on our advisory bench.',
  },
];

const finalCtaContent = {
  heading: 'Let’s build your raise from HSR Layout, Bengaluru',
  body: 'Drop by our studio or jump on a quick call—either way, we will craft a fundraising journey rooted in vibrant energy, sharp storytelling, and the network you need.',
  primary: { label: 'Book a Discovery Call', to: '/signup' },
  secondary: { label: 'See How We Support Founders', to: '/founders' },
};

const Home = () => {
  const { scrollYProgress } = useScroll();
  const readingProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  const progressOpacity = useTransform(readingProgress, [0, 0.02], [0, 1]);

  return (
    <>
      <Header />
      <motion.div
        aria-hidden="true"
        style={{ scaleX: readingProgress, opacity: progressOpacity }}
        className="pointer-events-none fixed left-0 top-0 z-40 h-1 origin-left bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] to-[#34d399]"
      />
      <div className="space-y-24 bg-gradient-to-br from-[#fef6ff] via-[#f5f3ff] to-[#f0fff4] pb-24">
        <Hero />

        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-white/90 px-6 py-12 shadow-[0_28px_80px_rgba(139,92,246,0.18)] backdrop-blur lg:px-12"
        >
          <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#ff4fa3]/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#34d399]/25 blur-3xl" />
          <div className="relative space-y-8">
            <div className="space-y-3 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#f9e4ff] px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
                Questionnaire
              </span>
              <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">
                Are we the right partner for your raise?
              </h2>
              <p className="mx-auto max-w-3xl text-base text-[#3b2a57]">
                Fast-track alignment by answering the essentials we cover during our first call.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/80">
              <table className="w-full table-auto border-collapse text-left text-sm text-[#1a1030]">
                <tbody>
                  {questionnaireRows.map((item) => (
                    <tr
                      key={item.question}
                      className="border-b border-white/40 bg-white/60 backdrop-blur last:border-none"
                    >
                      <td className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5cf6] sm:px-8 sm:py-5">
                        {item.question}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#2e1d48] sm:px-8 sm:py-5">{item.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          id="founders"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mx-auto flex max-w-7xl flex-col gap-10 px-4 lg:flex-row lg:px-8"
        >
          <MotionDiv
            variants={fadeUp}
            className="relative flex-1 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] p-10 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
            <div className="relative space-y-6">
              <span className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/80">
                Features & benefits
              </span>
              <h2 className="text-3xl font-semibold md:text-4xl">Everything you need to raise with confidence</h2>
              <p className="max-w-lg text-sm text-white/85">
                A vibrant blend of intelligence, storytelling, and operating support tailored to India-first teams raising right
                now.
              </p>
            </div>
          </MotionDiv>
          <div className="flex-1 space-y-6">
            {featureHighlights.map((feature) => (
              <MotionDiv
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_18px_55px_rgba(139,92,246,0.16)] transition"
              >
                <h3 className="text-lg font-semibold text-[#1a1030]">{feature.title}</h3>
                <p className="mt-2 text-sm text-[#3b2a57]">{feature.description}</p>
                <ul className="mt-4 space-y-3 text-sm text-[#2e1d48]/80">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#ff4fa3] shadow-[0_0_0_4px_rgba(255,79,163,0.18)]" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          id="investors"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mx-auto max-w-7xl space-y-10 px-4 lg:px-8"
        >
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-[#e9e1ff] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
              What sets us apart
            </span>
            <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">Designed for Indian founders closing now</h2>
            <p className="mx-auto max-w-3xl text-base text-[#3b2a57]">
              Partnerships rooted in HSR Layout with a global investor network and relentless operator support.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item) => (
              <MotionDiv
                key={item.title}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                className="rounded-3xl border border-white/60 bg-white/90 p-6 text-left shadow-[0_22px_60px_rgba(52,211,153,0.2)] transition"
              >
                <h3 className="text-base font-semibold text-[#1a1030]">{item.title}</h3>
                <p className="mt-3 text-sm text-[#3b2a57]">{item.description}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[#110720] px-6 py-16 text-white shadow-[0_32px_95px_rgba(17,7,32,0.65)] lg:px-12"
        >
          <div className="pointer-events-none absolute -top-24 left-16 h-64 w-64 rounded-full bg-[#ff4fa3]/30 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-28 right-16 h-72 w-72 rounded-full bg-[#34d399]/30 blur-[140px]" />
          <div className="relative space-y-10">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/70">
                Comprehensive services
              </span>
              <h2 className="text-3xl font-semibold md:text-4xl">Every layer of your fundraise, handled</h2>
              <p className="max-w-3xl text-sm text-white/75">
                Build momentum with integrated pods that combine strategy, execution, and founder care.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {serviceStacks.map((stack) => (
                <MotionDiv
                  key={stack.title}
                  variants={scaleIn}
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  className="flex flex-col rounded-3xl bg-white/10 p-6 backdrop-blur transition hover:bg-white/15"
                >
                  <h3 className="text-lg font-semibold">{stack.title}</h3>
                  <ul className="mt-4 space-y-3 text-sm text-white/80">
                    {stack.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-6 rounded-full bg-white/40" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection
          id="how"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mx-auto max-w-7xl space-y-10 px-4 lg:px-8"
        >
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-[#dfffea] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#34d399]">
              How it works
            </span>
            <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">A guided arc from first sync to signed wires</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step) => (
              <MotionDiv
                key={step.title}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 230, damping: 23 }}
                className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_20px_60px_rgba(255,79,163,0.18)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ff4fa3]">{step.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-[#1a1030]">{step.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#8b5cf6]">{step.duration}</p>
                <p className="mt-3 text-sm text-[#3b2a57]">{step.description}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mx-auto max-w-7xl px-4 lg:px-8"
        >
          <div className="rounded-[3rem] bg-gradient-to-r from-[#ff4fa3]/20 via-[#8b5cf6]/15 to-[#34d399]/20 px-6 py-12 shadow-[0_26px_75px_rgba(139,92,246,0.18)] md:px-10 md:py-16">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div className="space-y-4">
                <span className="inline-flex items-center justify-center rounded-full bg-white/60 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
                  Stats
                </span>
                <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">Proof that the vibrant approach works</h2>
                <p className="text-sm text-[#3b2a57]">
                  Outcomes measured across the founders and investors partnering with us from Bengaluru and beyond.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {impactStats.map((stat) => (
                  <MotionDiv
                    key={stat.value}
                    variants={scaleIn}
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 230, damping: 23 }}
                    className="rounded-3xl border border-white/50 bg-white/95 p-6 text-[#1a1030] shadow-[0_18px_55px_rgba(52,211,153,0.18)]"
                  >
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    <p className="mt-2 text-sm text-[#3b2a57]">{stat.caption}</p>
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
          className="mx-auto max-w-7xl space-y-10 px-4 lg:px-8"
        >
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-[#fce3f3] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#ff4fa3]">
              Testimonials
            </span>
            <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">Momentum felt by founders like you</h2>
            <p className="mx-auto max-w-3xl text-base text-[#3b2a57]">
              Stories from teams who partnered with our HSR Layout crew and closed transformative rounds.
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
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-[#e9e1ff] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
              FAQ
            </span>
            <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">Your next questions, already answered</h2>
          </div>
          <FAQAccordion items={faqItems} />
        </MotionSection>

        <CTASection />
      </div>
      <FooterEX1 />
    </>
  );
};

export default Home;
