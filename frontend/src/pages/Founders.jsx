import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Users,
  FileText,
  Shield,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Brain,
  BarChart3,
  Globe,
  Briefcase,
  Lightbulb,
  Award,
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
      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blossom via-royal to-sprout bg-clip-text">
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
      className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:border-sprout/50 hover:shadow-2xl hover:shadow-sprout/20"
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

const ServiceCard = ({ title, items, color, delay = 0 }) => {
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
        <h3 className="text-lg font-semibold text-night">{title}</h3>
        <ul className="mt-4 space-y-3">
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

const ProcessStep = ({ number, title, description, delay = 0 }) => {
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blossom to-royal text-2xl font-bold text-white shadow-lg">
            {number}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-sprout/50 to-transparent" />
        </div>
        <h3 className="text-lg font-semibold text-night">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </MotionDiv>
  );
};

const Founders = () => {
  const valueProps = [
    {
      icon: Zap,
      title: 'Connect with aligned investors in days, not months',
      description: 'AI-powered matching analyzes 100+ signals to surface high-probability investor connections. No more cold outreach with &lt;10% response rates—get 3-5x higher conversion rates through intelligent matching.',
      gradient: 'from-blossom to-royal',
    },
    {
      icon: Brain,
      title: 'AI-powered pitch optimization',
      description: 'Real-time feedback on your pitch deck compared to investor expectations and successful funding benchmarks. Reach investor-quality standards 70% faster—from weeks to days.',
      gradient: 'from-royal to-sprout',
    },
    {
      icon: Briefcase,
      title: 'Integrated business services',
      description: 'One platform for legal compliance, technical solutions, growth marketing, and operational support. Stop coordinating with 5-10 separate vendors—access enterprise-grade expertise without enterprise overhead.',
      gradient: 'from-sprout to-mint',
    },
    {
      icon: BarChart3,
      title: 'Comprehensive founder profiling',
      description: 'Objective, data-backed assessment across experience, execution capability, network strength, and market understanding. Get actionable insights to improve your profile and investor readiness.',
      gradient: 'from-mint to-sunbeam',
    },
  ];

  const platformCapabilities = [
    {
      icon: Target,
      label: '01',
      title: 'Intelligent Matching',
      description: 'Proprietary AI algorithms analyze 100+ data signals—founder background, market opportunity, business model, investor thesis alignment—to surface matches that would be impossible to find manually.',
      gradient: 'from-blossom to-royal',
    },
    {
      icon: Users,
      label: '02',
      title: 'Founder Profiling & Assessment',
      description: 'Multi-dimensional AI assessment across experience, execution capability, network strength, market understanding, and resilience. Benchmark against successful founders and get specific improvement recommendations.',
      gradient: 'from-royal to-sprout',
    },
    {
      icon: FileText,
      label: '03',
      title: 'Pitch Deck Refinement',
      description: 'AI analyzes your pitch against investor expectations, market benchmarks, and successful funding patterns. Get real-time feedback on market validation, narrative coherence, financial projections, and design.',
      gradient: 'from-sprout to-mint',
    },
    {
      icon: Rocket,
      label: '04',
      title: 'Integrated Business Services',
      description: 'Access legal & compliance, technical infrastructure, growth & marketing, and operational excellence services—all through one platform. No more fragmented vendor coordination.',
      gradient: 'from-mint to-sunbeam',
    },
  ];

  const services = [
    {
      title: 'Legal & Compliance',
      items: [
        'Cap table management & equity documentation',
        'Investment agreement review & negotiation',
        'Corporate structuring & tax advice',
        'Regulatory compliance for your industry',
        'IP protection & stock option plans',
      ],
      color: 'from-blossom to-royal',
    },
    {
      title: 'Technical Solutions',
      items: [
        'Cloud infrastructure setup & optimization',
        'Scalable architecture design',
        'Custom software development & MVP support',
        'Security & compliance infrastructure',
        'Performance optimization & scaling',
      ],
      color: 'from-royal to-sprout',
    },
    {
      title: 'Growth & Marketing',
      items: [
        'Go-to-market strategy development',
        'Customer acquisition & channel optimization',
        'Brand positioning & messaging',
        'Performance marketing setup',
        'Product-market fit validation',
      ],
      color: 'from-sprout to-mint',
    },
    {
      title: 'Operational Excellence',
      items: [
        'Financial management & investor reporting',
        'KPI frameworks & metric dashboards',
        'Team hiring & talent acquisition',
        'Board governance & investor relations',
        'Operational risk assessment',
      ],
      color: 'from-mint to-sunbeam',
    },
  ];

  const faqItems = [
    {
      question: 'How does the AI-powered matching work?',
      answer: 'Our proprietary matching engine analyzes 100+ data signals including founder background, market opportunity, business model, growth trajectory, team composition, investment stage, and investor thesis alignment. Machine learning models assess compatibility probability and surface high-probability matches that would be missed through manual research.',
    },
    {
      question: 'What stage of startups do you work with?',
      answer: 'We serve founders at pre-seed through Series A stages. Whether you\'re validating an idea, have an MVP ready, or are preparing for your next funding round, Launch and Lift provides the matching, profiling, and support services you need to succeed.',
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer a freemium model for basic matching. Premium tiers provide advanced features including pitch deck analysis, founder profiling, warm introductions, and direct access to business services. Pricing ranges from $49-199/month for founders, with additional costs for professional services as needed.',
    },
    {
      question: 'How long does it take to connect with investors?',
      answer: 'Founders typically reduce time-to-qualified-investor-conversation from weeks to days. Our platform identifies warm introduction pathways and connects you with investors actively deploying capital, dramatically improving response rates compared to cold outreach.',
    },
    {
      question: 'What makes Launch and Lift different from other platforms?',
      answer: 'We\'re the only platform combining intelligent matching + comprehensive founder profiling + AI-powered pitch optimization + integrated business services. Rather than coordinating separately with lawyers, developers, and marketers, everything you need is available through one platform with data-backed insights.',
    },
    {
      question: 'Do you provide actual funding?',
      answer: 'Launch and Lift connects you with aligned investors—from angel investors to institutional VCs—who are actively deploying capital. We facilitate the matching and provide support services, but the actual investment comes from our network of investors who use our platform to source quality deal flow.',
    },
  ];

  const stats = [
    { value: '3-5x', label: 'Higher conversion rates vs. cold outreach' },
    { value: '70%', label: 'Faster pitch preparation' },
    { value: '100+', label: 'Data signals analyzed per match' },
    { value: '20+', label: 'Integrated business services' },
  ];

  const problemPoints = [
    { icon: TrendingUp, text: 'Inefficient discovery: &lt;10% cold outreach response rate' },
    { icon: Users, text: 'Network bias: 70% of capital flows through warm connections' },
    { icon: Briefcase, text: 'Fragmented services: 60-80 hours wasted on vendor coordination' },
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
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-blossom/20 to-royal/20 blur-3xl"
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
          className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-lilac/30 p-8 shadow-2xl shadow-slate-300/50 backdrop-blur-xl lg:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blossom/5 via-transparent to-sprout/5" />
            <div className="relative z-10">
        <SectionHeader
          eyebrow="For founders"
                title="AI-Powered Fundraising & Growth Support"
                description="Connect with perfectly aligned investors in days, not months. Get AI-powered pitch optimization, comprehensive founder profiling, and integrated access to legal, technical, marketing, and operational services—all in one platform."
          align="left"
        />
              <div className="mt-8 grid gap-4">
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
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/signup/founder"
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blossom to-royal px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-blossom/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blossom/50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
          </Link>
                <Link
                  to="/resources"
                  className="rounded-full border-2 border-sprout bg-white/80 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-sprout backdrop-blur-sm transition-all duration-300 hover:border-sunbeam hover:bg-sprout hover:text-white hover:shadow-lg"
                >
                  Learn More
          </Link>
              </div>
        </div>
      </div>

      <div className="space-y-6">
            <MotionDiv
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm"
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blossom via-royal to-sprout" />
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blossom/20 to-royal/20 p-2">
                  <Lightbulb className="h-5 w-5 text-blossom" />
                </div>
                <h3 className="text-xl font-semibold text-night">The Problem We Solve</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Founders spend 30-40 hours/month on unfocused investor outreach with &lt;10% response rates. You coordinate separately with lawyers, developers, and marketers—wasting time and creating friction.
              </p>
              <ul className="mt-6 space-y-3">
                {problemPoints.map((point, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <div className="mt-0.5 rounded-full bg-gradient-to-br from-sprout to-mint p-1">
                      <point.icon className="h-3 w-3 text-white" />
                    </div>
                    <span>{point.text}</span>
                  </motion.li>
                ))}
          </ul>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-slate-200/50 bg-gradient-to-br from-white/90 to-sprout/5 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-sprout/20 to-mint/20 p-2">
                  <Award className="h-5 w-5 text-sprout" />
                </div>
                <h3 className="text-xl font-semibold text-night">Why Launch and Lift?</h3>
        </div>
              <p className="text-sm leading-relaxed text-slate-600">
                We're the only platform combining AI-powered matching, comprehensive founder profiling, pitch optimization, and integrated business services.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <AnimatedStat key={stat.label} value={stat.value} label={stat.label} delay={0.6 + idx * 0.1} />
                ))}
        </div>
            </MotionDiv>
      </div>
        </MotionSection>

        {/* Platform Capabilities */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
      <SectionHeader
            eyebrow="Platform capabilities"
            title="The Complete Solution for Founders"
            description="Four powerful capabilities working together to accelerate your fundraising and growth journey."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformCapabilities.map((capability, idx) => (
              <MotionDiv
                key={capability.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-4">
                    <div className={`rounded-2xl bg-gradient-to-br ${capability.gradient} p-3 shadow-lg`}>
                      <capability.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                      {capability.label}
            </span>
                  </div>
                  <h3 className="text-xl font-semibold text-night">{capability.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{capability.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        {/* Integrated Services */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
          <SectionHeader
            eyebrow="Integrated business services"
            title="Everything You Need to Scale"
            description="Access enterprise-grade expertise without enterprise overhead. All critical startup support services available through one platform."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                items={service.items}
                color={service.color}
                delay={idx * 0.1}
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
            title="Your Path to Fundraising Success"
            description="From profile creation to investor meetings—we guide you through every step."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProcessStep
              number="1"
              title="Create Your Profile"
              description="Complete our comprehensive intake covering your background, experience, market opportunity, and business model."
              delay={0}
            />
            <ProcessStep
              number="2"
              title="Get AI Assessment"
              description="Receive data-backed founder profiling with actionable insights to improve your investor readiness and pitch quality."
              delay={0.1}
            />
            <ProcessStep
              number="3"
              title="Optimize Your Pitch"
              description="Upload your pitch deck for AI-powered analysis and real-time feedback against investor expectations and benchmarks."
              delay={0.2}
            />
            <ProcessStep
              number="4"
              title="Connect with Investors"
              description="Get matched with aligned investors through warm introductions. Access integrated services as you scale."
              delay={0.3}
            />
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
            <h3 className="text-4xl font-bold">The $412B+ Global VC Market Needs Better Infrastructure</h3>
            <p className="mt-4 text-lg text-white/90">
              Despite the venture capital market exceeding $412 billion annually, founders continue to struggle with inefficient investor discovery, fragmented support services, and information asymmetry.
            </p>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                { value: '$412B+', label: 'Global VC Market (2025)' },
                { value: '43%', label: 'India VC Growth (YoY)' },
                { value: '&lt;10%', label: 'Cold Outreach Response Rate' },
                { value: '3-5x', label: 'Our Conversion Improvement' },
              ].map((stat, idx) => (
                <AnimatedStat key={stat.label} value={stat.value} label={stat.label} delay={idx * 0.1} />
              ))}
            </div>
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
        eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="Everything you need to know about Launch and Lift's platform and services."
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
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-night/70">Get Started</p>
              </div>
              <h3 className="text-4xl font-bold">Join the future of fundraising</h3>
              <p className="text-lg text-night/80">
                Connect with aligned investors in days, not months. Access AI-powered pitch optimization and integrated business services. Start your journey today.
          </p>
        </div>
            <Link
              to="/signup/founder"
              className="group relative overflow-hidden rounded-full bg-night px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign Up Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
        </Link>
          </div>
        </MotionSection>
      </div>
  </div>
);
};

export default Founders;
