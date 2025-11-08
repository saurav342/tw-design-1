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
  Briefcase,
  Globe,
  Award,
  Sparkles,
  Filter,
  FileText,
  Network,
  Lightbulb,
  Clock,
  DollarSign,
} from 'lucide-react';
import FAQAccordion from '../components/FAQAccordion';
import SectionHeader from '../components/SectionHeader';

const MotionDiv = motion.div;
const MotionSection = motion.section;

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
      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-royal via-blossom to-sprout bg-clip-text">
        {value}
      </div>
      <div className="mt-2 text-sm font-medium text-slate-600">{label}</div>
    </MotionDiv>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0, gradient }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:border-royal/50 hover:shadow-2xl hover:shadow-royal/20"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
      <div className="relative z-10">
        <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${gradient} p-3 shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-night">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </MotionDiv>
  );
};

const BenefitCard = ({ title, items, color, delay = 0, icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/90 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
    >
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${color}`} />
      <div className="mt-2">
        <div className="mb-4 flex items-center gap-3">
          <div className={`rounded-xl bg-gradient-to-br ${color} p-2 opacity-20`}>
            <Icon className="h-5 w-5 text-night" />
          </div>
          <h3 className="text-lg font-semibold text-night">{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-sprout" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </MotionDiv>
  );
};

const ProcessStep = ({ step, title, description, delay = 0, icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      <div className="relative rounded-3xl border border-slate-200/50 bg-white/90 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-royal to-blossom text-2xl font-bold text-white shadow-lg">
            {Icon ? <Icon className="h-6 w-6" /> : step}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-royal/50 to-transparent" />
        </div>
        <h3 className="text-lg font-semibold text-night">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </MotionDiv>
  );
};

const Investors = () => {
  const valueProps = [
    {
      icon: Target,
      title: 'High-quality deal flow',
      description: 'Get pre-qualified founders you actually want to meet. Stop wasting time on 1,000 pitches—we surface the top 20 that fit your thesis, stage, and sector focus.',
      gradient: 'from-royal to-blossom',
    },
    {
      icon: BarChart3,
      title: 'Objective founder assessment',
      description: 'Standardized, data-backed founder intelligence reduces subjective bias and investment risk. Make faster, more confident decisions with comprehensive founder profiling across 6 dimensions.',
      gradient: 'from-blossom to-sprout',
    },
    {
      icon: TrendingUp,
      title: '3-5x better conversion efficiency',
      description: 'Our AI-powered matching surfaces genuinely aligned opportunities. Investors using Launch and Lift report 3-5x improvement in deal quality and conversion rates compared to traditional sourcing.',
      gradient: 'from-sprout to-mint',
    },
    {
      icon: Clock,
      title: 'Faster due diligence',
      description: 'Access comprehensive founder profiles, pitch analysis, and market validation data before the first meeting. Reduce due diligence time from 2-3 months to weeks.',
      gradient: 'from-mint to-sunbeam',
    },
  ];

  const platformFeatures = [
    {
      icon: Filter,
      label: '01',
      title: 'Intelligent Deal Sourcing',
      description: 'AI-powered matching engine analyzes 100+ signals to surface founders that align with your thesis, stage focus, sector expertise, geographic preference, and ticket size. Get pre-qualified opportunities, not noise.',
      gradient: 'from-royal to-blossom',
    },
    {
      icon: FileText,
      label: '02',
      title: 'Founder Intelligence Reports',
      description: 'Comprehensive, data-backed founder assessment across experience, execution capability, network strength, market understanding, and resilience. Standardized evaluation reduces bias and speeds decision-making.',
      gradient: 'from-blossom to-sprout',
    },
    {
      icon: BarChart3,
      label: '03',
      title: 'Market Intelligence & Benchmarking',
      description: 'Access market intelligence, sector trends, and benchmarking data. Compare founders against successful raises in their sector and stage. Understand competitive positioning and market timing.',
      gradient: 'from-sprout to-mint',
    },
    {
      icon: Network,
      label: '04',
      title: 'Investor Network & Syndication',
      description: 'Connect with other investors for co-investment opportunities and syndication. Access warm introduction pathways and build relationships through the platform.',
      gradient: 'from-mint to-sunbeam',
    },
  ];

  const investorBenefits = [
    {
      title: 'Deal Flow Quality',
      items: [
        'Pre-qualified founders matching your thesis',
        'Stage and sector alignment verified',
        'Founder profiles with objective assessment data',
        'Pitch decks pre-analyzed for investor readiness',
      ],
      color: 'from-royal to-blossom',
      icon: Target,
    },
    {
      title: 'Time Efficiency',
      items: [
        'Reduce time on unqualified pitches by 80%+',
        'Faster due diligence with standardized data',
        'Warm introductions increase response rates',
        'Real-time availability matching',
      ],
      color: 'from-blossom to-sprout',
      icon: Clock,
    },
    {
      title: 'Better Outcomes',
      items: [
        '3-5x improvement in deal quality',
        'Reduced information asymmetry',
        'Data-backed investment decisions',
        'Access to deal flow across geographies',
      ],
      color: 'from-sprout to-mint',
      icon: TrendingUp,
    },
    {
      title: 'Network Effects',
      items: [
        'Join 200+ investors using the platform',
        'Co-investment and syndication opportunities',
        'Access to emerging market deal flow',
        'Growing ecosystem creates increasing value',
      ],
      color: 'from-mint to-sunbeam',
      icon: Network,
    },
  ];

  const faqItems = [
    {
      question: 'How does Launch and Lift source deal flow?',
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
      answer: 'Launch and Lift is the only platform combining AI-powered intelligent matching + comprehensive founder profiling + pitch optimization + integrated business services. We provide objective, data-backed founder assessment that reduces bias and speeds decision-making. Our network effects create increasing value as the ecosystem grows.',
    },
    {
      question: 'Can I co-invest or syndicate through the platform?',
      answer: 'Yes. Launch and Lift provides investor network features that enable co-investment opportunities and syndication. You can connect with other investors, share deal flow, and collaborate on investments. The platform facilitates warm introductions and relationship building among investors.',
    },
    {
      question: 'What geographic coverage do you have?',
      answer: 'We currently focus on India (the world\'s third-largest startup ecosystem with $11.3B in VC funding) and are expanding to US, EU, and APAC markets. Our platform enables access to deal flow across geographies, with localized legal and compliance support for each market.',
    },
  ];

  const stats = [
    { value: '200+', label: 'Investors using the platform' },
    { value: '3-5x', label: 'Better deal quality & conversion' },
    { value: '100+', label: 'Data signals analyzed per match' },
    { value: '80%+', label: 'Time saved on unqualified pitches' },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Define Your Investment Thesis',
      description: 'Set your preferences for stage, sector, geographic focus, ticket size, and investment criteria. Our platform learns your patterns and refines matches over time.',
      icon: Target,
    },
    {
      step: '2',
      title: 'Receive Pre-Qualified Matches',
      description: 'Get matched with founders who align with your thesis. Each match includes comprehensive founder intelligence, pitch analysis, and market validation data.',
      icon: Filter,
    },
    {
      step: '3',
      title: 'Review Founder Intelligence',
      description: 'Access standardized founder assessment reports covering experience, execution capability, market understanding, network strength, and resilience. Make data-backed decisions faster.',
      icon: FileText,
    },
    {
      step: '4',
      title: 'Connect & Invest',
      description: 'Use warm introduction pathways to connect with founders. Access market intelligence and benchmarking data. Co-invest with other investors through the platform.',
      icon: Network,
    },
  ];

  const dashboardFeatures = [
    { icon: Target, text: 'Pre-qualified deal flow matching your investment thesis' },
    { icon: FileText, text: 'Comprehensive founder intelligence and assessment reports' },
    { icon: BarChart3, text: 'Market intelligence, benchmarking, and sector trend analysis' },
    { icon: Network, text: 'Co-investment and syndication opportunities' },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-lilac via-white to-lilac/30">
      {/* Animated Background Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <MotionDiv
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-royal/20 to-blossom/20 blur-3xl"
        />
        <MotionDiv
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-sprout/20 to-mint/20 blur-3xl"
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-20 px-4 py-16 lg:px-8 lg:py-24">
        {/* Hero Section */}
        <MotionSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div className="space-y-6">
            <SectionHeader
              eyebrow="For investors"
              title="Quality Deal Flow Meets Intelligent Sourcing"
              description="Access pre-qualified founders that fit your thesis. Stop wasting time on thousands of generic pitches. Get objective founder assessment data and make faster, more confident investment decisions."
              align="left"
            />
            <div className="grid gap-5">
              {valueProps.map((value, idx) => (
                <FeatureCard
                  key={value.title}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  delay={idx * 0.1}
                  gradient={value.gradient}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup/investor"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-royal to-blossom px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-royal/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-royal/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Request Access
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                to="/resources"
                className="rounded-full border-2 border-sprout bg-white/80 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-sprout backdrop-blur-sm transition-all duration-300 hover:border-sunbeam hover:bg-sprout hover:text-white hover:shadow-lg"
              >
                Download Investor Brief
              </Link>
            </div>
          </div>

          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/50 bg-gradient-to-br from-night-soft via-white/90 to-night-soft/50 p-8 shadow-2xl shadow-slate-300/50 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-royal/5 via-transparent to-blossom/5" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-royal/20 to-blossom/20 p-2">
                  <BarChart3 className="h-6 w-6 text-royal" />
                </div>
                <h3 className="text-2xl font-semibold text-night">Investor Intelligence Dashboard</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Real-time access to deal flow, founder intelligence reports, market benchmarking, and portfolio insights. Track matches, review founder assessments, and manage your investment pipeline through our secure investor workspace.
              </p>
              <ul className="mt-6 space-y-4">
                {dashboardFeatures.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <div className="mt-0.5 rounded-full bg-gradient-to-br from-royal to-blossom p-1">
                      <feature.icon className="h-4 w-4 text-white" />
                    </div>
                    <span>{feature.text}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <AnimatedStat key={stat.label} value={stat.value} label={stat.label} delay={0.6 + idx * 0.1} />
                ))}
              </div>
            </div>
          </MotionDiv>
        </MotionSection>

        {/* Platform Features */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
          <SectionHeader
            eyebrow="Platform features"
            title="Everything You Need for Better Deal Sourcing"
            description="Intelligent matching, comprehensive founder intelligence, and market insights—all designed to help you make better investment decisions faster."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {platformFeatures.map((feature, idx) => (
              <MotionDiv
                key={feature.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-4">
                    <div className={`rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                      {feature.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-night">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        {/* Investor Benefits */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
          <SectionHeader
            eyebrow="Why investors choose us"
            title="Better Deal Flow, Better Outcomes"
            description="Join 200+ investors using Launch and Lift to source 30-40% of their annual deal flow with improved quality and conversion rates."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {investorBenefits.map((benefit, idx) => (
              <BenefitCard
                key={benefit.title}
                title={benefit.title}
                items={benefit.items}
                color={benefit.color}
                delay={idx * 0.1}
                icon={benefit.icon}
              />
            ))}
          </div>
        </MotionSection>

        {/* How It Works */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
          <SectionHeader
            eyebrow="How it works"
            title="Curated Access with Institutional Rigor"
            description="A proven four-step model aligning Launch and Lift with your investment goals from day one."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, idx) => (
              <ProcessStep
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                delay={idx * 0.1}
                icon={step.icon}
              />
            ))}
          </div>
        </MotionSection>

        {/* Market Context */}
        <MotionSection
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal via-blossom to-sunbeam p-12 text-white shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Globe className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">Market Opportunity</p>
            </div>
            <h3 className="text-4xl font-bold">The $412B+ VC Market Needs Better Infrastructure</h3>
            <p className="mt-4 text-lg text-white/90">
              Despite the venture capital market exceeding $412 billion annually, investors are overwhelmed with deal flow, lack standardized founder quality assessment, and struggle with information asymmetry.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { value: '$412B+', label: 'Global VC Market (2025)' },
                { value: '$11.3B', label: 'India VC Funding (2024)' },
                { value: '2-3 mo', label: 'Avg Due Diligence Time' },
                { value: '3-5x', label: 'Our Conversion Improvement' },
              ].map((stat, idx) => (
                <AnimatedStat key={stat.label} value={stat.value} label={stat.label} delay={idx * 0.1} />
              ))}
            </div>
          </div>
        </MotionSection>

        {/* Competitive Advantages */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
          <SectionHeader
            eyebrow="Competitive advantages"
            title="Why Launch and Lift Wins"
            description="Proprietary data, network effects, and integrated intelligence create defensible competitive moats."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Proprietary Data & Intelligence',
                description: 'Continuous aggregation of founder, investor, and deal outcomes creates proprietary training datasets. Pattern recognition around successful matches improves continuously, creating a 3-5 year competitive lead.',
                icon: Shield,
                gradient: 'from-royal to-blossom',
              },
              {
                title: 'Network Effects',
                description: 'Each new founder increases platform value for investors (better deal flow). Each new investor increases platform value for founders (more funding opportunities). Virtuous cycle accelerates as ecosystem grows.',
                icon: Network,
                gradient: 'from-blossom to-sprout',
              },
              {
                title: 'AI & Technical Moat',
                description: 'Proprietary matching algorithms refined through thousands of founder-investor interactions. Machine learning models continuously improve based on match quality and funding outcomes. Technical complexity creates barrier to entry.',
                icon: Zap,
                gradient: 'from-sprout to-mint',
              },
            ].map((advantage, idx) => (
              <MotionDiv
                key={advantage.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/90 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${advantage.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <div className="relative z-10">
                  <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${advantage.gradient} p-2`}>
                    <advantage.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-night">{advantage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{advantage.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        {/* FAQ */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-10"
        >
          <SectionHeader
            eyebrow="Investor FAQ"
            title="Answers for Capital Partners"
            description="Transparency is core to Launch and Lift. Here are the top questions we receive from investors."
          />
          <FAQAccordion items={faqItems} />
        </MotionSection>

        {/* CTA */}
        <MotionSection
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sprout via-mint to-blossom p-12 text-night shadow-2xl"
        >
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/30 px-4 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-night" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-night/70">Ready to improve your deal flow?</p>
              </div>
              <h3 className="text-4xl font-bold">Join 200+ investors using Launch and Lift</h3>
              <p className="text-lg text-night/80">
                Access quality deal flow sourced intelligently. Get objective founder assessment. Make better investment decisions faster. Request access to start sourcing better deals today.
              </p>
            </div>
            <Link
              to="/signup/investor"
              className="group relative overflow-hidden rounded-full bg-night px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Request Access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </MotionSection>
      </div>
    </div>
  );
};

export default Investors;
