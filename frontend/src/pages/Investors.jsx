import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  TrendingUp,
  Target,
  BarChart3,
  Users,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Filter,
  FileText,
  Network,
  Clock,
  DollarSign,
  Sparkles,
  Globe,
  Award,
  Search,
  PieChart,
  Activity,
} from 'lucide-react';
import FAQAccordion from '../components/FAQAccordion';
import { highlightBrandName } from '../lib/brandHighlight';

const MotionDiv = motion.div;
const MotionSection = motion.section;

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const AnimatedStat = ({ value, label, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] bg-clip-text sm:text-4xl">
        {value}
      </div>
      <div className="mt-2 text-xs font-medium text-[#3b2a57] uppercase tracking-wider">{label}</div>
    </MotionDiv>
  );
};

const Investors = () => {
  const valueProps = [
    {
      icon: Target,
      title: 'Pre-Qualified Deal Flow',
      description: 'AI-powered matching surfaces founders aligned with your thesis, stage, and sector focus.',
      gradient: 'from-[#ff4fa3] to-[#ff6bb3]',
      stat: '3-5x',
      statLabel: 'Better Conversion',
    },
    {
      icon: FileText,
      title: 'Founder Intelligence',
      description: 'Data-backed assessment across 6 dimensions reduces bias and speeds decision-making.',
      gradient: 'from-[#8b5cf6] to-[#a78bfa]',
      stat: '100+',
      statLabel: 'Data Signals',
    },
    {
      icon: Clock,
      title: 'Faster Due Diligence',
      description: 'Comprehensive profiles and pitch analysis reduce due diligence from months to weeks.',
      gradient: 'from-[#34d399] to-[#6ee7b7]',
      stat: '70%',
      statLabel: 'Time Saved',
    },
    {
      icon: Network,
      title: 'Investor Network',
      description: 'Co-investment opportunities, syndication, and warm introductions to quality deals.',
      gradient: 'from-[#8b5cf6] to-[#ff4fa3]',
      stat: '200+',
      statLabel: 'Active Investors',
    },
  ];

  const platformFeatures = [
    {
      icon: Filter,
      title: 'Intelligent Matching',
      description: '100+ data signals analyzed per match',
      color: '#ff4fa3',
    },
    {
      icon: BarChart3,
      title: 'Market Intelligence',
      description: 'Sector trends and benchmarking data',
      color: '#8b5cf6',
    },
    {
      icon: FileText,
      title: 'Founder Reports',
      description: 'Standardized assessment across 6 dimensions',
      color: '#34d399',
    },
    {
      icon: Network,
      title: 'Co-Investment',
      description: 'Syndication and network opportunities',
      color: '#ff4fa3',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Set Your Thesis',
      description: 'Define stage, sector, and investment criteria',
      icon: Target,
    },
    {
      step: '02',
      title: 'Get Matched',
      description: 'Receive pre-qualified founders aligned with your thesis',
      icon: Filter,
    },
    {
      step: '03',
      title: 'Review Intelligence',
      description: 'Access comprehensive founder assessment reports',
      icon: FileText,
    },
    {
      step: '04',
      title: 'Connect & Invest',
      description: 'Warm introductions and co-investment opportunities',
      icon: Network,
    },
  ];

  const faqItems = [
    {
      question: 'How does Launch & Lift source deal flow?',
      answer: 'We use proprietary AI algorithms to analyze 100+ data signals from founders—including background, experience, market opportunity, business model, growth trajectory, and team composition. Our matching engine surfaces founders that align with your investment thesis, stage focus, sector expertise, and geographic preferences. Founders are pre-qualified and assessed before being matched with investors.',
    },
    {
      question: 'What kind of founder intelligence do you provide?',
      answer: 'We provide comprehensive, data-backed founder assessment across 6 dimensions: experience & track record, execution capability, market understanding, network strength, founder-investor alignment, and resilience. This standardized evaluation helps reduce subjective bias and provides objective insights into founder quality and investment potential.',
    },
    {
      question: 'How much does it cost?',
      answer: 'Pricing ranges from $500-$5,000/month depending on investor size and needs. This includes access to deal flow, founder intelligence reports, investor network features, and market intelligence. We offer tiered subscriptions based on deal volume, quality requirements, and feature access.',
    },
    {
      question: 'What stages and sectors do you cover?',
      answer: 'We serve founders at pre-seed through Series A stages across all sectors. Our platform includes sector-specific matching engines for SaaS, fintech, biotech, AI, deeptech, hardware, and more. You can filter and focus on the stages and sectors that match your investment mandate.',
    },
    {
      question: 'How is this different from other deal sourcing platforms?',
      answer: 'Launch & Lift is the only platform combining AI-powered intelligent matching + comprehensive founder profiling + pitch optimization + integrated business services. We provide objective, data-backed founder assessment that reduces bias and speeds decision-making. Our network effects create increasing value as the ecosystem grows.',
    },
    {
      question: 'Can I co-invest or syndicate through the platform?',
      answer: 'Yes. Launch & Lift provides investor network features that enable co-investment opportunities and syndication. You can connect with other investors, share deal flow, and collaborate on investments. The platform facilitates warm introductions and relationship building among investors.',
    },
  ];

  const stats = [
    { value: '2200+', label: 'Active Investors' },
    { value: '3-5x', label: 'Better Deal Quality' },
    { value: '100+', label: 'Data Signals Analyzed' },
    { value: '80%+', label: 'Time Saved' },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff0fb] via-[#f5f0ff] to-[#f0fff6]">
      {/* Animated Background Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <MotionDiv
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-[#ff4fa3]/20 to-[#8b5cf6]/20 blur-3xl"
        />
        <MotionDiv
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-[#34d399]/20 to-[#8b5cf6]/20 blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 lg:px-8 lg:pt-32 lg:pb-24"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f9e4ff] to-[#f0e9ff] px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#8b5cf6] shadow-sm">
                  For Investors
                </span>
                <h1 className="text-4xl font-semibold text-[#1a1030] sm:text-5xl lg:text-6xl">
                  Quality Deal Flow,{' '}
                  <span className="text-transparent bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] bg-clip-text">
                    Intelligent Sourcing
                  </span>
                </h1>
                <p className="text-lg leading-relaxed text-[#3b2a57] sm:text-xl">
                  Access pre-qualified founders that fit your thesis. Stop wasting time on thousands of generic pitches. Get objective founder assessment data and make faster, more confident investment decisions.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat, idx) => (
                  <AnimatedStat key={stat.label} value={stat.value} label={stat.label} delay={idx * 0.1} />
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/signup/email?role=investor"
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff4fa3] to-[#8b5cf6] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#8b5cf6]/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#8b5cf6]/40"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Request Access
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  to="/resources"
                  className="rounded-2xl border-2 border-[#8b5cf6]/30 bg-white/80 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#8b5cf6] backdrop-blur-sm transition-all duration-300 hover:border-[#ff4fa3]/50 hover:bg-gradient-to-r hover:from-[#ff4fa3]/10 hover:via-[#8b5cf6]/10 hover:to-[#34d399]/10 hover:shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Visual Dashboard Preview */}
            <MotionDiv
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] p-8 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">Investor Dashboard</h3>
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  Real-time access to deal flow, founder intelligence reports, market benchmarking, and portfolio insights.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {platformFeatures.map((feature, idx) => (
                    <MotionDiv
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20"
                    >
                      <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                      <div className="text-xs font-semibold mb-1">{feature.title}</div>
                      <div className="text-xs text-white/70">{feature.description}</div>
                    </MotionDiv>
                  ))}
                </div>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* Value Props Section */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8"
        >
          <div className="space-y-10">
            <div className="space-y-3 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#f9e4ff] px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
                Why Investors Choose Us
              </span>
              <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">
                Better Deal Flow, Better Outcomes
              </h2>
              <p className="mx-auto max-w-2xl text-base text-[#3b2a57]">
                Join 2200+ investors using {highlightBrandName('Launch & Lift')} to source quality deals with improved conversion rates.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {valueProps.map((value, idx) => (
                <MotionDiv
                  key={value.title}
                  variants={fadeUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[0_18px_55px_rgba(139,92,246,0.12)] backdrop-blur transition-all hover:shadow-[0_24px_70px_rgba(139,92,246,0.2)]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                  <div className="relative">
                    <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${value.gradient} p-3 shadow-lg`}>
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="mb-2 flex items-baseline gap-2">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent`}>
                        {value.stat}
                      </div>
                      <div className="text-xs text-[#3b2a57] font-medium">{value.statLabel}</div>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a1030] mb-2">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-[#3b2a57]">{value.description}</p>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* How It Works */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8"
        >
          <div className="space-y-10">
            <div className="space-y-3 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#f9e4ff] px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
                How It Works
              </span>
              <h2 className="text-3xl font-semibold text-[#1a1030] md:text-4xl">
                Simple, Proven Process
              </h2>
              <p className="mx-auto max-w-2xl text-base text-[#3b2a57]">
                From setting your investment thesis to connecting with aligned founders—all in one platform.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((step, idx) => (
                <MotionDiv
                  key={step.step}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[0_18px_55px_rgba(139,92,246,0.12)] backdrop-blur transition-all hover:shadow-[0_24px_70px_rgba(139,92,246,0.2)]"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#ff4fa3] text-sm font-bold text-white shadow-lg">
                      {step.step}
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-[#8b5cf6]/50 to-transparent" />
                  </div>
                  <div className="mb-3 rounded-xl bg-gradient-to-br from-[#8b5cf6]/10 to-[#ff4fa3]/10 p-3 inline-flex">
                    <step.icon className="h-5 w-5 text-[#8b5cf6]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a1030] mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#3b2a57]">{step.description}</p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* Market Context */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#8b5cf6] via-[#ff4fa3] to-[#34d399] p-12 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-4xl text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <Globe className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">Market Opportunity</p>
              </div>
              <h3 className="text-3xl font-bold sm:text-4xl">The $412B+ VC Market Needs Better Infrastructure</h3>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Despite the venture capital market exceeding $412 billion annually, investors are overwhelmed with deal flow and lack standardized founder quality assessment.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                {[
                  { value: '$412B+', label: 'Global VC Market' },
                  { value: '$11.3B', label: 'India VC Funding' },
                  { value: '2-3 mo', label: 'Avg Due Diligence' },
                  { value: '3-5x', label: 'Our Improvement' },
                ].map((stat, idx) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-xs text-white/80 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MotionSection>

        {/* FAQ Section */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="relative mx-auto max-w-7xl space-y-10 px-4 py-16 lg:px-8"
        >
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
              Everything you need to know about {highlightBrandName('Launch & Lift')}'s platform, deal flow, and how we help investors make better decisions.
            </p>
          </div>
          <div className="relative">
            <FAQAccordion items={faqItems} initialVisibleCount={5} />
          </div>
        </MotionSection>

        {/* Final CTA */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#34d399] via-[#8b5cf6] to-[#ff4fa3] p-12 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">Ready to improve your deal flow?</p>
                </div>
                <h3 className="text-3xl font-bold sm:text-4xl">
                  Join 2200+ investors using {highlightBrandName('Launch & Lift')}
                </h3>
                <p className="text-lg text-white/90">
                  Access quality deal flow sourced intelligently. Get objective founder assessment. Make better investment decisions faster.
                </p>
              </div>
              <Link
                to="/signup/email?role=investor"
                className="group relative overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#8b5cf6] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Request Access
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </MotionSection>
      </div>
    </div>
  );
};

export default Investors;
