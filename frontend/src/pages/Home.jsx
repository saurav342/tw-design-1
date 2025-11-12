import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Hero from '../components/Hero';
import CTASection from '../components/CTASection';
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

const featureHighlights = [
  {
    title: 'Investor Intelligence Hub',
    description: 'Curated investor data. Warm intros. Weekly pulse.',
    benefits: [
      '2200+ mapped investors',
      'Active deployment tracking',
      'Context-rich intro briefs',
    ],
    icon: '🔍',
    color: 'from-[#ff4fa3] to-[#ff6bb3]',
  },
  {
    title: 'Storycraft Lab',
    description: 'Pitch decks. Financial models. Investor-ready narratives.',
    benefits: [
      'Templates aligned with expectations',
      'Scenario planning & analysis',
      'Traction-to-soundbite conversion',
    ],
    icon: '📊',
    color: 'from-[#8b5cf6] to-[#a78bfa]',
  },
  {
    title: 'Operator Prep Pods',
    description: 'Ex-founders. Mock diligence. Negotiation playbooks.',
    benefits: [
      'Real committee simulations',
      'Term sheet navigation',
      'HSR-based accountability',
    ],
    icon: '🚀',
    color: 'from-[#34d399] to-[#6ee7b7]',
  },
];

// SVG Icon Components for Result Badges
const LightningIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const RocketIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3L8 7h3v4h2V7h3l-4-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v10" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l-2 2m10-2l2 2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 17h4" />
  </svg>
);

const LinkIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const differentiators = [
  {
    title: 'AI-Powered Founder-Investor Matching',
    shortDesc: '100+ data signals analyzed',
    description: 'Multi-dimensional profiling. Warm intro pathways. Real-time availability matching.',
    result: {
      value: 'Weeks → Days',
      label: 'Time Reduction',
      icon: LightningIcon,
      metric: '3-5x faster',
    },
    icon: '🤖',
    gradient: 'from-[#ff4fa3] to-[#ff6bb3]',
    features: ['Experience & execution', 'Network strength', 'Market understanding', 'Compatibility analysis'],
  },
  {
    title: 'Comprehensive Founder Profiling',
    shortDesc: 'Data-backed assessment',
    description: 'Experience scoring. Execution capability. Network quality. Market insight.',
    result: {
      value: '100+',
      label: 'Data Points',
      icon: ChartIcon,
      metric: 'Signals analyzed',
    },
    icon: '📊',
    gradient: 'from-[#8b5cf6] to-[#a78bfa]',
    features: ['Track record analysis', 'Capability scoring', 'Network evaluation', 'Compatibility mapping'],
  },
  {
    title: 'AI-Powered Pitch Deck Refinement',
    shortDesc: 'Real-time optimization',
    description: 'Market validation. Investor-readiness. Narrative coherence. Financial analysis.',
    result: {
      value: '70%',
      label: 'Faster',
      icon: RocketIcon,
      metric: 'Pitch readiness',
    },
    icon: '✨',
    gradient: 'from-[#34d399] to-[#6ee7b7]',
    features: ['Benchmark scoring', 'Readiness assessment', 'Design optimization', 'Projection analysis'],
  },
  {
    title: 'Integrated Business Services',
    shortDesc: 'One unified platform',
    description: 'Legal. Technical. Growth. Operations. All in one place.',
    result: {
      value: '4-in-1',
      label: 'Platform',
      icon: LinkIcon,
      metric: 'Services unified',
    },
    icon: '🔗',
    gradient: 'from-[#f59e0b] to-[#fbbf24]',
    features: ['Cap table & IP', 'Cloud & security', 'Go-to-market', 'Financial management'],
  },
];

// SVG Icons for Services
const CapitalIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DealIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GrowthIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const WellbeingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const serviceStacks = [
  {
    title: 'Capital Readiness',
    shortDesc: 'Prepare to raise',
    icon: CapitalIcon,
    gradient: 'from-[#ff4fa3] to-[#ff6bb3]',
    highlights: ['Narrative workshop', 'Financial diagnostics', 'Compliance checklist'],
    count: '3',
  },
  {
    title: 'Deal Enablement',
    shortDesc: 'Close faster',
    icon: DealIcon,
    gradient: 'from-[#8b5cf6] to-[#a78bfa]',
    highlights: ['Investor prioritisation', 'Warm intros', 'Negotiation support'],
    count: '3',
  },
  {
    title: 'Growth Catalysts',
    shortDesc: 'Scale smart',
    icon: GrowthIcon,
    gradient: 'from-[#34d399] to-[#6ee7b7]',
    highlights: ['Mentor pool', 'Revenue sprints', 'OKR dashboards'],
    count: '3',
  },
  {
    title: 'Founder Wellbeing',
    shortDesc: 'Thrive, not just survive',
    icon: WellbeingIcon,
    gradient: 'from-[#f59e0b] to-[#fbbf24]',
    highlights: ['Coaching pods', 'Founder circles', 'Update templates'],
    count: '3',
  },
];

// SVG Icons for Workflow Steps
const ClarityIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const BuildIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const MotionIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const workflowSteps = [
  {
    step: '01',
    title: 'Clarity Session',
    duration: 'Week 1',
    description: 'Audit story, numbers, and round objective. Define sprint roadmap.',
    icon: ClarityIcon,
    gradient: 'from-[#ff4fa3] to-[#ff6bb3]',
  },
  {
    step: '02',
    title: 'Build & Sharpen',
    duration: 'Weeks 2-4',
    description: 'Collateral, data room, and positioning upgrades. Sector specialists.',
    icon: BuildIcon,
    gradient: 'from-[#8b5cf6] to-[#a78bfa]',
  },
  {
    step: '03',
    title: 'Investor Motion',
    duration: 'Weeks 5-8',
    description: 'Warm introductions. Conversation prep. Live feedback every 48h.',
    icon: MotionIcon,
    gradient: 'from-[#34d399] to-[#6ee7b7]',
  },
  {
    step: '04',
    title: 'Close with Conviction',
    duration: 'Weeks 9-16',
    description: 'Term sheet navigation. Diligence sprints. Closing support.',
    icon: CloseIcon,
    gradient: 'from-[#f59e0b] to-[#fbbf24]',
  },
];

const impactStats = [
  {
    value: '94%',
    caption: 'Success rate',
    description: 'Founders secure second meetings within 4 weeks',
    icon: '🎯',
    gradient: 'from-[#ff4fa3] to-[#ff6bb3]',
    highlight: 'vs. 10% industry avg',
  },
  {
    value: '28 days',
    caption: 'To term sheet',
    description: 'Average time to first term sheet',
    icon: '⚡',
    gradient: 'from-[#8b5cf6] to-[#a78bfa]',
    highlight: '3x faster than market',
  },
  {
    value: 'INR 410 Cr',
    caption: 'Capital raised',
    description: 'Catalysed for India-first companies',
    icon: '💰',
    gradient: 'from-[#34d399] to-[#6ee7b7]',
    highlight: 'Since 2021',
  },
  {
    value: '70+',
    caption: 'Expert mentors',
    description: 'Operators, ex-founders, and leaders',
    icon: '🌟',
    gradient: 'from-[#f59e0b] to-[#fbbf24]',
    highlight: 'On-demand access',
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
      <motion.div
        aria-hidden="true"
        style={{ scaleX: readingProgress, opacity: progressOpacity }}
        className="pointer-events-none fixed left-0 top-0 z-40 h-1 origin-left bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] to-[#34d399]"
      />
      <div className="space-y-24 bg-gradient-to-br from-[#fef6ff] via-[#f5f3ff] to-[#f0fff4]">
        <Hero />

        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 lg:px-8"
        >
          <div className="relative space-y-12">
            {/* Section Header */}
            <div className="space-y-4 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f0f4ff] to-[#f5f3ff] px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5cf6] border border-[#8b5cf6]/20">
                Problem & Solution
              </span>
              <h2 className="text-4xl font-bold text-[#1a1030] md:text-5xl">
                The Market Gaps We're Solving
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-[#3b2a57] leading-relaxed">
                Fundraising friction costs the ecosystem billions annually. Here's how <span className="font-bold text-[#8b5cf6]">Launch & Lift</span> transforms the process with AI-powered intelligence and integrated support.
              </p>
            </div>

            {/* Desktop Two-Column Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-10">
              {/* The Problem Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-1 w-12 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full" />
                  <h2 className="text-4xl font-bold text-[#1a1030]">The Problem</h2>
                </div>
                
                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#fef2f2] via-white to-[#fff7ed] p-7 border-2 border-[#fee2e2] shadow-[0_4px_20px_rgba(239,68,68,0.08)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-all"
                >
                  <div className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-base font-bold text-white shadow-lg">
                    1
                  </div>
                  <div className="pl-14">
                    <h3 className="text-xl font-bold text-[#1a1030] mb-3">Inefficient Discovery</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      Founders spend <span className="font-bold text-[#ef4444]">30-40 hours/month</span> on unfocused investor outreach with minimal results.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fee2e2] border border-[#fecaca]">
                      <span className="text-xs font-bold text-[#dc2626]">&lt;10%</span>
                      <span className="text-xs text-[#991b1b]">cold outreach response rate</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#fef2f2] via-white to-[#fff7ed] p-7 border-2 border-[#fee2e2] shadow-[0_4px_20px_rgba(239,68,68,0.08)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-all"
                >
                  <div className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] text-base font-bold text-white shadow-lg">
                    2
                  </div>
                  <div className="pl-14">
                    <h3 className="text-xl font-bold text-[#1a1030] mb-3">Network Dependency</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      Fundraising success heavily depends on existing connections, creating systemic inequity.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fee2e2] border border-[#fecaca]">
                      <span className="text-xs font-bold text-[#dc2626]">70%</span>
                      <span className="text-xs text-[#991b1b]">of capital flows through warm networks</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#fef2f2] via-white to-[#fff7ed] p-7 border-2 border-[#fee2e2] shadow-[0_4px_20px_rgba(239,68,68,0.08)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-all"
                >
                  <div className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-base font-bold text-white shadow-lg">
                    3
                  </div>
                  <div className="pl-14">
                    <h3 className="text-xl font-bold text-[#1a1030] mb-3">Fragmented Services</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      Founders coordinate separately with <span className="font-bold text-[#ef4444]">5-10 different vendors</span> for legal, tech, marketing, and operations.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fee2e2] border border-[#fecaca]">
                      <span className="text-xs font-bold text-[#dc2626]">60-80 hours</span>
                      <span className="text-xs text-[#991b1b]">wasted on coordination monthly</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="relative rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#991b1b] p-7 border-2 border-[#b91c1c] shadow-[0_8px_30px_rgba(220,38,38,0.25)]"
                >
                  <h3 className="text-xl font-bold text-white mb-3">The Cost</h3>
                  <p className="text-sm text-white/90 font-medium leading-relaxed">
                    Missed opportunities. Wasted time. A broken feedback loop that slows innovation and leaves brilliant founders unfunded—costing the ecosystem billions annually.
                  </p>
                </MotionDiv>
              </div>

              {/* The Solution Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-1 w-12 bg-gradient-to-r from-[#34d399] to-[#10b981] rounded-full" />
                  <h2 className="text-4xl font-bold text-[#1a1030]">The Solution</h2>
                </div>
                
                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] p-7 border-2 border-[#d1fae5] shadow-[0_4px_20px_rgba(52,211,153,0.08)] hover:shadow-[0_8px_30px_rgba(52,211,153,0.15)] transition-all"
                >
                  <div className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#34d399] to-[#10b981] text-base font-bold text-white shadow-lg">
                    1
                  </div>
                  <div className="pl-14">
                    <h3 className="text-xl font-bold text-[#1a1030] mb-3">AI-Powered Matching Engine</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      Analyzes <span className="font-bold text-[#10b981]">100+ data signals</span> for founder-investor alignment, including experience, market fit, and investment thesis.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#d1fae5] border border-[#a7f3d0]">
                      <span className="text-xs font-bold text-[#059669]">3-5x</span>
                      <span className="text-xs text-[#047857]">higher conversion rates vs. cold outreach</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] p-7 border-2 border-[#d1fae5] shadow-[0_4px_20px_rgba(52,211,153,0.08)] hover:shadow-[0_8px_30px_rgba(52,211,153,0.15)] transition-all"
                >
                  <div className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] text-base font-bold text-white shadow-lg">
                    2
                  </div>
                  <div className="pl-14">
                    <h3 className="text-xl font-bold text-[#1a1030] mb-3">Founder Profiling & Pitch Optimization</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      AI-powered multi-dimensional assessment with real-time feedback on pitch quality, financial models, and investor-readiness.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#d1fae5] border border-[#a7f3d0]">
                      <span className="text-xs font-bold text-[#059669]">70%</span>
                      <span className="text-xs text-[#047857]">faster pitch readiness (weeks → days)</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] p-7 border-2 border-[#d1fae5] shadow-[0_4px_20px_rgba(52,211,153,0.08)] hover:shadow-[0_8px_30px_rgba(52,211,153,0.15)] transition-all"
                >
                  <div className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] text-base font-bold text-white shadow-lg">
                    3
                  </div>
                  <div className="pl-14">
                    <h3 className="text-xl font-bold text-[#1a1030] mb-3">Integrated Business Services</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      One platform for legal compliance, tech enhancement, growth marketing, and operational support—eliminating vendor coordination.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#d1fae5] border border-[#a7f3d0]">
                      <span className="text-xs font-bold text-[#059669]">360°</span>
                      <span className="text-xs text-[#047857]">startup growth support in one place</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="relative rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] p-7 border-2 border-[#047857] shadow-[0_8px_30px_rgba(16,185,129,0.25)]"
                >
                  <h3 className="text-xl font-bold text-white mb-3">The Impact</h3>
                  <p className="text-sm text-white/90 font-medium leading-relaxed">
                    <span className="font-bold text-white">Launch & Lift</span> transforms fundraising from months to days. Founders connect with aligned investors faster, while investors access pre-qualified, high-quality deal flow. Data-driven decisions replace guesswork.
                  </p>
                </MotionDiv>
              </div>
            </div>

            {/* Mobile/Tablet Stacked Layout */}
            <div className="lg:hidden space-y-12">
              {/* Section Header for Mobile */}
              <div className="space-y-4 text-center">
                <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f0f4ff] to-[#f5f3ff] px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5cf6] border border-[#8b5cf6]/20">
                  Problem & Solution
                </span>
                <h2 className="text-3xl font-bold text-[#1a1030]">
                  The Market Gaps We're Solving
                </h2>
                <p className="mx-auto max-w-3xl text-base text-[#3b2a57] leading-relaxed">
                  Fundraising friction costs the ecosystem billions annually. Here's how <span className="font-bold text-[#8b5cf6]">Launch & Lift</span> transforms the process with AI-powered intelligence and integrated support.
                </p>
              </div>

              {/* The Problem Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-10 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full" />
                  <h2 className="text-3xl font-bold text-[#1a1030]">The Problem</h2>
                </div>
                
                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#fef2f2] via-white to-[#fff7ed] p-6 border-2 border-[#fee2e2] shadow-[0_4px_20px_rgba(239,68,68,0.08)]"
                >
                  <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-sm font-bold text-white shadow-lg">
                    1
                  </div>
                  <div className="pl-12">
                    <h3 className="text-lg font-bold text-[#1a1030] mb-2">Inefficient Discovery</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      Founders spend <span className="font-bold text-[#ef4444]">30-40 hours/month</span> on unfocused investor outreach with minimal results.
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#fee2e2] border border-[#fecaca]">
                      <span className="text-xs font-bold text-[#dc2626]">&lt;10%</span>
                      <span className="text-xs text-[#991b1b]">cold outreach response rate</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#fef2f2] via-white to-[#fff7ed] p-6 border-2 border-[#fee2e2] shadow-[0_4px_20px_rgba(239,68,68,0.08)]"
                >
                  <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] text-sm font-bold text-white shadow-lg">
                    2
                  </div>
                  <div className="pl-12">
                    <h3 className="text-lg font-bold text-[#1a1030] mb-2">Network Dependency</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      Fundraising success heavily depends on existing connections, creating systemic inequity.
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#fee2e2] border border-[#fecaca]">
                      <span className="text-xs font-bold text-[#dc2626]">70%</span>
                      <span className="text-xs text-[#991b1b]">of capital flows through warm networks</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#fef2f2] via-white to-[#fff7ed] p-6 border-2 border-[#fee2e2] shadow-[0_4px_20px_rgba(239,68,68,0.08)]"
                >
                  <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-sm font-bold text-white shadow-lg">
                    3
                  </div>
                  <div className="pl-12">
                    <h3 className="text-lg font-bold text-[#1a1030] mb-2">Fragmented Services</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      Founders coordinate separately with <span className="font-bold text-[#ef4444]">5-10 different vendors</span> for legal, tech, marketing, and operations.
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#fee2e2] border border-[#fecaca]">
                      <span className="text-xs font-bold text-[#dc2626]">60-80 hours</span>
                      <span className="text-xs text-[#991b1b]">wasted on coordination monthly</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="relative rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#991b1b] p-6 border-2 border-[#b91c1c] shadow-[0_8px_30px_rgba(220,38,38,0.25)]"
                >
                  <h3 className="text-lg font-bold text-white mb-2">The Cost</h3>
                  <p className="text-sm text-white/90 font-medium leading-relaxed">
                    Missed opportunities. Wasted time. A broken feedback loop that slows innovation and leaves brilliant founders unfunded—costing the ecosystem billions annually.
                  </p>
                </MotionDiv>
              </div>

              {/* The Solution Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-10 bg-gradient-to-r from-[#34d399] to-[#10b981] rounded-full" />
                  <h2 className="text-3xl font-bold text-[#1a1030]">The Solution</h2>
                </div>
                
                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] p-6 border-2 border-[#d1fae5] shadow-[0_4px_20px_rgba(52,211,153,0.08)]"
                >
                  <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#34d399] to-[#10b981] text-sm font-bold text-white shadow-lg">
                    1
                  </div>
                  <div className="pl-12">
                    <h3 className="text-lg font-bold text-[#1a1030] mb-2">AI-Powered Matching Engine</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      Analyzes <span className="font-bold text-[#10b981]">100+ data signals</span> for founder-investor alignment, including experience, market fit, and investment thesis.
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#d1fae5] border border-[#a7f3d0]">
                      <span className="text-xs font-bold text-[#059669]">3-5x</span>
                      <span className="text-xs text-[#047857]">higher conversion rates vs. cold outreach</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] p-6 border-2 border-[#d1fae5] shadow-[0_4px_20px_rgba(52,211,153,0.08)]"
                >
                  <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] text-sm font-bold text-white shadow-lg">
                    2
                  </div>
                  <div className="pl-12">
                    <h3 className="text-lg font-bold text-[#1a1030] mb-2">Founder Profiling & Pitch Optimization</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      AI-powered multi-dimensional assessment with real-time feedback on pitch quality, financial models, and investor-readiness.
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#d1fae5] border border-[#a7f3d0]">
                      <span className="text-xs font-bold text-[#059669]">70%</span>
                      <span className="text-xs text-[#047857]">faster pitch readiness (weeks → days)</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] p-6 border-2 border-[#d1fae5] shadow-[0_4px_20px_rgba(52,211,153,0.08)]"
                >
                  <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] text-sm font-bold text-white shadow-lg">
                    3
                  </div>
                  <div className="pl-12">
                    <h3 className="text-lg font-bold text-[#1a1030] mb-2">Integrated Business Services</h3>
                    <p className="text-sm text-[#3b2a57] leading-relaxed mb-2">
                      One platform for legal compliance, tech enhancement, growth marketing, and operational support—eliminating vendor coordination.
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#d1fae5] border border-[#a7f3d0]">
                      <span className="text-xs font-bold text-[#059669]">360°</span>
                      <span className="text-xs text-[#047857]">startup growth support in one place</span>
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                  className="relative rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] p-6 border-2 border-[#047857] shadow-[0_8px_30px_rgba(16,185,129,0.25)]"
                >
                  <h3 className="text-lg font-bold text-white mb-2">The Impact</h3>
                  <p className="text-sm text-white/90 font-medium leading-relaxed">
                    <span className="font-bold text-white">Launch & Lift</span> transforms fundraising from months to days. Founders connect with aligned investors faster, while investors access pre-qualified, high-quality deal flow. Data-driven decisions replace guesswork.
                  </p>
                </MotionDiv>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          id="founders"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mx-auto max-w-7xl px-4 py-16 lg:px-8"
        >
          <div className="space-y-10">
            {/* Section Header */}
            <div className="space-y-3 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#f9e4ff] px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
                Features & Benefits
              </span>
              <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">
                Everything you need to raise with confidence
              </h2>
              <p className="mx-auto max-w-2xl text-base text-[#3b2a57]">
                Intelligence, storytelling, and operating support for India-first teams.
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-8">
              {/* Left: Hero Card */}
          <MotionDiv
            variants={fadeUp}
                className="relative flex flex-col overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] p-10 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
                
                {/* Decorative gradient orbs */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                
                <div className="relative flex flex-1 flex-col justify-between space-y-8">
                  {/* Top Content */}
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/90">
                      Features & Benefits
                    </div>
                    <h2 className="text-3xl font-semibold md:text-4xl leading-tight">
                      Everything you need to raise with confidence
                    </h2>
                    <p className="max-w-lg text-sm text-white/90 leading-relaxed">
                      A vibrant blend of intelligence, storytelling, and operating support tailored to India-first teams raising right now.
                    </p>
                  </div>

                  {/* Bottom: Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
                      <div className="text-2xl font-bold mb-1">2200+</div>
                      <div className="text-xs text-white/80 font-medium">Mapped Investors</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
                      <div className="text-2xl font-bold mb-1">70%</div>
                      <div className="text-xs text-white/80 font-medium">Faster Ready</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
                      <div className="text-2xl font-bold mb-1">3-5x</div>
                      <div className="text-xs text-white/80 font-medium">Higher Conversion</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
                      <div className="text-2xl font-bold mb-1">360°</div>
                      <div className="text-xs text-white/80 font-medium">Growth Support</div>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
                      AI-Powered Matching
              </span>
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
                      Real-Time Feedback
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
                      Integrated Services
                    </span>
                  </div>
                </div>
              </MotionDiv>

              {/* Right: Feature Cards */}
              <div className="flex flex-col gap-6">
                {featureHighlights.map((feature, index) => (
                  <MotionDiv
                    key={feature.title}
                    variants={fadeUp}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                    className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[0_18px_55px_rgba(139,92,246,0.12)] backdrop-blur transition-all hover:shadow-[0_24px_70px_rgba(139,92,246,0.2)]"
                  >
                    {/* Gradient accent on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                    
                    <div className="relative flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-2xl shadow-lg`}>
                        {feature.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-[#1a1030]">{feature.title}</h3>
                          <p className="mt-1.5 text-sm font-medium text-[#8b5cf6]">{feature.description}</p>
                        </div>
                        
                        {/* Compact Benefits */}
                        <div className="flex flex-wrap gap-2">
                  {feature.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="inline-flex items-center rounded-full bg-[#f5f3ff] px-3 py-1 text-xs font-medium text-[#6d28d9]"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden space-y-8">
              {/* Hero Card for Mobile */}
              <MotionDiv
                variants={fadeUp}
                className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] p-8 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
                
                {/* Decorative gradient orbs */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
                
                <div className="relative space-y-6">
                  <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/90">
                    Features & Benefits
                  </div>
                  <h2 className="text-2xl font-semibold leading-tight">
                    Everything you need to raise with confidence
                  </h2>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Intelligence, storytelling, and operating support for India-first teams.
                  </p>
                  
                  {/* Stats Grid for Mobile */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/20">
                      <div className="text-xl font-bold mb-1">2200+</div>
                      <div className="text-xs text-white/80 font-medium">Mapped Investors</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/20">
                      <div className="text-xl font-bold mb-1">70%</div>
                      <div className="text-xs text-white/80 font-medium">Faster Ready</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/20">
                      <div className="text-xl font-bold mb-1">3-5x</div>
                      <div className="text-xs text-white/80 font-medium">Higher Conversion</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/20">
                      <div className="text-xl font-bold mb-1">360°</div>
                      <div className="text-xs text-white/80 font-medium">Growth Support</div>
                    </div>
                  </div>

                  {/* Key Highlights for Mobile */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
                      AI-Powered Matching
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
                      Real-Time Feedback
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
                      Integrated Services
                    </span>
                  </div>
            </div>
          </MotionDiv>

              {/* Feature Cards for Mobile */}
              <div className="space-y-6">
            {featureHighlights.map((feature) => (
              <MotionDiv
                key={feature.title}
                variants={fadeUp}
                    whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                    className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[0_18px_55px_rgba(139,92,246,0.12)] backdrop-blur"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                    
                    <div className="relative flex items-start gap-4">
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-xl shadow-lg`}>
                        {feature.icon}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-[#1a1030]">{feature.title}</h3>
                          <p className="mt-1.5 text-sm font-medium text-[#8b5cf6]">{feature.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                  {feature.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="inline-flex items-center rounded-full bg-[#f5f3ff] px-3 py-1 text-xs font-medium text-[#6d28d9]"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
              </MotionDiv>
            ))}
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          id="investors"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8"
        >
          {/* Background decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#ff4fa3]/10 to-transparent blur-3xl" />
            <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#34d399]/10 to-transparent blur-3xl" />
          </div>

          <div className="relative space-y-10">
            {/* Header Section */}
          <div className="space-y-3 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#e9e1ff] px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
                What Sets Us Apart
            </span>
              <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">
                Core Platform Capabilities
              </h2>
              <p className="mx-auto max-w-2xl text-base text-[#3b2a57] leading-relaxed">
                Four powerful capabilities that eliminate fundraising friction and accelerate your journey from pitch to close.
            </p>
          </div>

            {/* Desktop: Flowing Card Layout */}
            <div className="hidden lg:block space-y-6">
              {differentiators.map((item, index) => (
              <MotionDiv
                key={item.title}
                  variants={fadeUp}
                  className={`flex items-center gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Icon & Visual Element */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className={`relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-xl overflow-hidden group/icon`}>
                        <item.result.icon className="h-10 w-10 text-white z-10 relative" />
                        {/* Animated gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover/icon:opacity-20 transition-opacity duration-300`} />
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/30 blur-sm" />
                          <div className="absolute bottom-2 left-2 h-4 w-4 rounded-full bg-white/20 blur-sm" />
                        </div>
                      </div>
                      {index < differentiators.length - 1 && (
                        <div className="absolute top-24 left-1/2 h-12 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#8b5cf6]/30 to-transparent" />
                      )}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 group">
                    <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/95 p-6 shadow-[0_20px_60px_rgba(139,92,246,0.12)] backdrop-blur transition-all hover:shadow-[0_28px_80px_rgba(139,92,246,0.2)]">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                      
                      <div className="relative space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-[#8b5cf6] uppercase tracking-wide mb-1.5">
                              {item.shortDesc}
                            </p>
                            <h3 className="text-xl font-bold text-[#1a1030] mb-2 leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-sm text-[#3b2a57] leading-relaxed mb-3">
                              {item.description}
                            </p>
                          </div>
                          <div className={`flex-shrink-0 w-40 rounded-xl bg-gradient-to-br ${item.gradient} bg-opacity-15 border-2 border-current border-opacity-25 backdrop-blur-sm p-4 hover:bg-opacity-20 transition-all duration-300`}>
                            <div className="space-y-2.5">
                              {/* Icon and Label */}
                              <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} shadow-md`}>
                                  <item.result.icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-xs font-bold text-[#1a1030] uppercase tracking-wider">{item.result.label}</span>
                              </div>
                              
                              {/* Value */}
                              <div className={`text-2xl font-bold text-[#1a1030] leading-none`}>
                                {item.result.value}
                              </div>
                              
                              {/* Metric */}
                              <div className="text-xs font-semibold text-[#3b2a57] pt-1.5 border-t border-[#3b2a57]/20">
                                {item.result.metric}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Features List */}
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/40">
                          {item.features.map((feature) => (
                            <span
                              key={feature}
                              className="inline-flex items-center rounded-full bg-[#f5f3ff] px-2.5 py-0.5 text-xs font-medium text-[#6d28d9]"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
              </MotionDiv>
            ))}
            </div>

            {/* Mobile/Tablet: Stacked Layout */}
            <div className="lg:hidden space-y-6">
              {differentiators.map((item, index) => (
                <MotionDiv
                  key={item.title}
                  variants={fadeUp}
                  className="relative"
                >
                  {/* Connecting Line */}
                  {index < differentiators.length - 1 && (
                    <div className="absolute left-6 top-20 h-6 w-0.5 bg-gradient-to-b from-[#8b5cf6]/30 to-transparent z-0" />
                  )}

                  <div className="relative flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg overflow-hidden group/icon`}>
                        <item.result.icon className="h-7 w-7 text-white z-10 relative" />
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-white/30 blur-sm" />
                          <div className="absolute bottom-1 left-1 h-2 w-2 rounded-full bg-white/20 blur-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 group">
                      <div className="relative overflow-hidden rounded-xl border border-white/60 bg-white/95 p-4 shadow-[0_18px_55px_rgba(139,92,246,0.12)] backdrop-blur">
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                        
                        <div className="relative space-y-2.5">
                          <div>
                            <p className="text-xs font-semibold text-[#8b5cf6] uppercase tracking-wide mb-1">
                              {item.shortDesc}
                            </p>
                            <h3 className="text-base font-bold text-[#1a1030] mb-1.5 leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-sm text-[#3b2a57] leading-relaxed mb-2.5">
                              {item.description}
                            </p>
                          </div>

                          <div className={`inline-flex flex-col w-full max-w-[160px] rounded-lg bg-gradient-to-br ${item.gradient} bg-opacity-15 border-2 border-current border-opacity-25 backdrop-blur-sm p-3`}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${item.gradient} shadow-md`}>
                                <item.result.icon className="h-3.5 w-3.5 text-white" />
                              </div>
                              <span className="text-xs font-bold text-[#1a1030] uppercase tracking-wider">{item.result.label}</span>
                            </div>
                            <div className={`text-xl font-bold text-[#1a1030] leading-none mb-1`}>
                              {item.result.value}
                            </div>
                            <div className="text-xs font-semibold text-[#3b2a57] pt-1 border-t border-[#3b2a57]/20">
                              {item.result.metric}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/40">
                            {item.features.map((feature) => (
                              <span
                                key={feature}
                                className="inline-flex items-center rounded-full bg-[#f5f3ff] px-2 py-0.5 text-xs font-medium text-[#6d28d9]"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </MotionDiv>
            ))}
            </div>

            {/* Bottom CTA/Summary */}
            <MotionDiv
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5f3ff] via-[#fef6ff] to-[#f0fff4] p-6 md:p-8 border border-white/60"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08),transparent_70%)]" />
              <div className="relative text-center space-y-2">
                <h3 className="text-xl font-bold text-[#1a1030] md:text-2xl">
                  One Platform. Complete Solution.
                </h3>
                <p className="mx-auto max-w-2xl text-sm text-[#3b2a57] leading-relaxed">
                  From AI-powered matching to integrated business services—everything you need to raise capital faster and smarter.
                </p>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#110720] via-[#1a0f2e] to-[#110720] px-6 py-16 text-white shadow-[0_32px_95px_rgba(17,7,32,0.65)] lg:px-12"
        >
          {/* Enhanced background effects */}
          <div className="pointer-events-none absolute -top-24 left-16 h-64 w-64 rounded-full bg-[#ff4fa3]/30 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-28 right-16 h-72 w-72 rounded-full bg-[#34d399]/30 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b5cf6]/20 blur-[140px]" />
          
          <div className="relative space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/80 backdrop-blur-sm">
                Comprehensive Services
              </span>
              <h2 className="text-3xl font-semibold md:text-4xl">Every layer of your fundraise, handled</h2>
              <p className="mx-auto max-w-2xl text-sm text-white/75">
                Integrated pods combining strategy, execution, and founder care.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {serviceStacks.map((stack) => (
                <MotionDiv
                  key={stack.title}
                  variants={scaleIn}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  className="group relative flex flex-col rounded-2xl bg-white/5 p-6 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(139,92,246,0.3)]"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stack.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className="relative space-y-4">
                    {/* Icon and Title */}
                    <div className="flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stack.gradient} shadow-lg`}>
                        <stack.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${stack.gradient} bg-opacity-20 text-xs font-bold text-white`}>
                        {stack.count}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1">
                          {stack.shortDesc}
                        </p>
                        <h3 className="text-lg font-bold leading-tight">{stack.title}</h3>
                      </div>

                      {/* Highlights as compact pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {stack.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection
          id="how"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8"
        >
          {/* Background decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#ff4fa3]/10 to-transparent blur-3xl" />
            <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#34d399]/10 to-transparent blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#8b5cf6]/5 to-transparent blur-3xl" />
          </div>

          <div className="relative space-y-16">
            {/* Header */}
            <div className="space-y-4 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#dfffea] px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#34d399]">
                The Process
            </span>
              <h2 className="text-4xl font-semibold text-[#1a1030] md:text-5xl">
                Your Journey from Pitch to Close
              </h2>
              <p className="mx-auto max-w-2xl text-base text-[#3b2a57]">
                A streamlined 16-week sprint designed to accelerate your fundraising journey with precision and support.
              </p>
          </div>

            {/* Desktop: Continuous Process Flow Diagram */}
            <div className="hidden lg:block relative py-12">
              {/* Main Flow Path - Horizontal with wave */}
              <div className="relative">
                {/* Flow Line Background */}
                <div className="absolute top-32 left-0 right-0 h-2 bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] via-[#34d399] to-[#f59e0b] opacity-20 rounded-full" />
                
                {/* Flow Path with Wave */}
                <svg className="absolute top-32 left-0 right-0 h-2" viewBox="0 0 1200 8" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="flowPath" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff4fa3" />
                      <stop offset="33%" stopColor="#8b5cf6" />
                      <stop offset="66%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 4 Q 300 0, 600 4 T 1200 4"
                    stroke="url(#flowPath)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                </svg>

                {/* Steps along the flow */}
                <div className="relative grid grid-cols-4 gap-0">
                  {workflowSteps.map((step, index) => (
              <MotionDiv
                key={step.title}
                      variants={fadeUp}
                      className="relative group"
                    >
                      {/* Step Node */}
                      <div className="flex flex-col items-center">
                        {/* Icon Circle - On Flow Line */}
                        <div className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-2xl border-4 border-white group-hover:scale-110 transition-transform duration-300 z-10 mb-6`}>
                          <step.icon className="h-12 w-12 text-white" />
                          {/* Step Number Badge */}
                          <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg border-2 border-[#1a1030]/10">
                            <span className="text-xs font-bold text-[#1a1030]">{step.step}</span>
                          </div>
                        </div>

                        {/* Content - Always visible, compact */}
                        <div className="w-full px-2 space-y-2 text-center">
                          <h3 className="text-base font-bold text-[#1a1030] leading-tight">{step.title}</h3>
                          <p className="text-xs font-semibold text-[#8b5cf6] uppercase tracking-wide">{step.duration}</p>
                          <p className="text-xs text-[#3b2a57] leading-relaxed">{step.description}</p>
                        </div>
                      </div>

                      {/* Flow Arrow (between steps) */}
                      {index < workflowSteps.length - 1 && (
                        <div className="absolute top-32 left-full -translate-y-1/2 -translate-x-1/2 z-0">
                          <svg className="h-5 w-8 text-[#8b5cf6] opacity-50" fill="currentColor" viewBox="0 0 24 12">
                            <path d="M0 6h18l-5-5v10l5-5z" />
                          </svg>
                        </div>
                      )}
              </MotionDiv>
            ))}
                </div>
              </div>
            </div>

            {/* Mobile/Tablet: Vertical Flow Timeline */}
            <div className="lg:hidden space-y-8">
              {workflowSteps.map((step, index) => (
                <MotionDiv
                  key={step.title}
                  variants={fadeUp}
                  className="relative"
                >
                  {/* Flow Line */}
                  {index < workflowSteps.length - 1 && (
                    <div className="absolute left-10 top-24 h-full w-1 bg-gradient-to-b from-[#ff4fa3] via-[#8b5cf6] via-[#34d399] to-[#f59e0b] opacity-20 rounded-full z-0" />
                  )}

                  <div className="relative flex gap-4">
                    {/* Icon Node */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-xl border-4 border-white`}>
                        <step.icon className="h-10 w-10 text-white" />
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md border border-[#1a1030]/10">
                          <span className="text-[10px] font-bold text-[#1a1030]">{step.step}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-[#1a1030]">{step.title}</h3>
                        <p className="text-xs font-semibold text-[#8b5cf6] uppercase tracking-wide">{step.duration}</p>
                        <p className="text-sm text-[#3b2a57] leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>

            {/* Bottom Summary */}
            <MotionDiv
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5f3ff] via-[#fef6ff] to-[#f0fff4] p-8 border border-white/60"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08),transparent_70%)]" />
              <div className="relative text-center space-y-3">
                <h3 className="text-xl font-bold text-[#1a1030] md:text-2xl">
                  From First Sync to Signed Wires
                </h3>
                <p className="mx-auto max-w-2xl text-sm text-[#3b2a57] leading-relaxed">
                  Every step optimized for speed, precision, and founder success. Weekly checkpoints. Real-time support. Proven outcomes.
                </p>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 lg:px-8"
        >
          {/* Background decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#ff4fa3]/15 to-transparent blur-3xl" />
            <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#34d399]/15 to-transparent blur-3xl" />
          </div>

          <div className="relative space-y-10">
            {/* Header */}
            <div className="space-y-4 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-white/60 px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
                Proven Results
                </span>
              <h2 className="text-4xl font-semibold text-[#1a1030] md:text-5xl">
                Numbers That Speak for Themselves
              </h2>
              <p className="mx-auto max-w-2xl text-base text-[#3b2a57]">
                Real outcomes from founders who chose <span className="font-bold text-[#8b5cf6]">Launch & Lift</span>. Join the success story.
                </p>
              </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {impactStats.map((stat) => (
                  <MotionDiv
                    key={stat.value}
                    variants={scaleIn}
                  whileHover={{ y: -12, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/95 p-6 shadow-[0_20px_60px_rgba(139,92,246,0.12)] backdrop-blur transition-all hover:shadow-[0_28px_80px_rgba(139,92,246,0.25)]"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className="relative space-y-4">
                    {/* Icon and Value */}
                    <div className="flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg text-2xl group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      <span className={`text-xs font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent uppercase tracking-wide`}>
                        {stat.caption}
                      </span>
                    </div>

                    {/* Value */}
                    <div className="space-y-2">
                      <div className={`text-4xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent leading-none`}>
                        {stat.value}
                      </div>
                      <p className="text-sm font-semibold text-[#1a1030] leading-tight">
                        {stat.description}
                      </p>
                      <p className="text-xs font-medium text-[#8b5cf6]">
                        {stat.highlight}
                      </p>
                    </div>
                  </div>
                  </MotionDiv>
                ))}
              </div>

            {/* Encouraging CTA */}
            <MotionDiv
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] p-8 md:p-12 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
              <div className="relative text-center space-y-4">
                <h3 className="text-2xl font-bold md:text-3xl">
                  Ready to Join These Success Stories?
                </h3>
                <p className="mx-auto max-w-2xl text-sm text-white/90 leading-relaxed">
                  Start your fundraising journey today. Connect with aligned investors in days, not months.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#8b5cf6] shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    Get Started Now
                  </Link>
                  <Link
                    to="/founders"
                    className="inline-flex items-center justify-center rounded-full bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
                  >
                    Learn More
                  </Link>
            </div>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="relative mx-auto max-w-7xl space-y-12 px-4 py-16 lg:px-8"
        >
          {/* Background decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#ff4fa3]/8 to-transparent blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#8b5cf6]/8 to-transparent blur-3xl" />
          </div>

          <div className="relative space-y-4 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-white/60 px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#ff4fa3] backdrop-blur-sm">
              Testimonials
            </span>
            <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent">
                Real Stories, Real Results
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-[#3b2a57] lg:text-lg">
              Founders who transformed their fundraising journey with <span className="font-bold text-[#8b5cf6]">Launch & Lift</span>. From pitch to close, faster.
            </p>
          </div>
          <Testimonials items={homeTestimonials} />
        </MotionSection>

        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="relative mx-auto max-w-7xl space-y-10 px-4 py-16 lg:px-8"
        >
          {/* Background decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#ff4fa3]/8 to-transparent blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#8b5cf6]/8 to-transparent blur-3xl" />
          </div>

          <div className="relative space-y-4 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f9e4ff] to-[#f0e9ff] px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#8b5cf6] shadow-sm">
              FAQ
            </span>
            <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl lg:text-5xl">
              Got Questions?
            </h2>
            <p className="mx-auto max-w-2xl text-base text-[#3b2a57] leading-relaxed">
              Everything you need to know about <span className="font-bold text-[#8b5cf6]">Launch & Lift</span>'s platform, services, and how we help founders raise capital faster.
            </p>
          </div>
          <div className="relative">
            <FAQAccordion items={faqItems} initialVisibleCount={6} />
          </div>
        </MotionSection>

        <CTASection />
      </div>
    </>
  );
};

export default Home;
