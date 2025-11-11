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
  Search,
  PieChart,
  Activity,
  Clock,
  Network,
  User,
  Star,
  ArrowRightCircle,
  PlayCircle,
  Calendar,
  DollarSign,
  ChartLine,
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

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const AnimatedStat = ({ value, label, delay = 0, icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg hover:shadow-xl transition-shadow"
    >
      {Icon && (
        <div className="mb-3 p-3 rounded-full bg-gradient-to-br from-[#ff4fa3] to-[#8b5cf6] text-white">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] bg-clip-text sm:text-4xl mb-2">
        {value}
      </div>
      <div className="text-xs font-medium text-[#3b2a57] uppercase tracking-wider">{label}</div>
    </MotionDiv>
  );
};

const Founders = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Connect with perfectly aligned investors in days, not months',
      stat: '3-5x',
      statLabel: 'Higher Conversion',
      gradient: 'from-[#ff4fa3] to-[#ff6bb3]',
    },
    {
      icon: Brain,
      title: 'Pitch Optimization',
      description: 'Real-time AI feedback on your pitch deck and investor readiness',
      stat: '70%',
      statLabel: 'Faster Ready',
      gradient: 'from-[#8b5cf6] to-[#a78bfa]',
    },
    {
      icon: Briefcase,
      title: 'Integrated Services',
      description: 'Legal, tech, marketing, and operations—all in one platform',
      stat: '20+',
      statLabel: 'Services',
      gradient: 'from-[#34d399] to-[#6ee7b7]',
    },
  ];

  const journeySteps = [
    {
      number: '01',
      title: 'Sign Up & Create Profile',
      description: 'Complete our comprehensive intake covering your background, experience, market opportunity, and business model. Takes just 10 minutes.',
      icon: User,
      color: '#ff4fa3',
    },
    {
      number: '02',
      title: 'Get AI Assessment',
      description: 'Receive data-backed founder profiling across 6 dimensions with actionable insights to improve your investor readiness.',
      icon: Brain,
      color: '#8b5cf6',
    },
    {
      number: '03',
      title: 'Optimize Your Pitch',
      description: 'Upload your pitch deck for AI-powered analysis. Get real-time feedback against investor expectations and successful benchmarks.',
      icon: FileText,
      color: '#34d399',
    },
    {
      number: '04',
      title: 'Connect & Raise Capital',
      description: 'Get matched with aligned investors through warm introductions. Access integrated services as you scale your startup.',
      icon: Rocket,
      color: '#ff4fa3',
    },
  ];

  const services = [
    {
      icon: Shield,
      title: 'Legal & Compliance',
      items: ['Cap table management', 'Investment agreements', 'IP protection', 'Corporate structuring'],
      gradient: 'from-[#ff4fa3] to-[#ff6bb3]',
    },
    {
      icon: Activity,
      title: 'Technical Solutions',
      items: ['Cloud infrastructure', 'Scalable architecture', 'Security & compliance', 'Performance optimization'],
      gradient: 'from-[#8b5cf6] to-[#a78bfa]',
    },
    {
      icon: TrendingUp,
      title: 'Growth & Marketing',
      items: ['Go-to-market strategy', 'Customer acquisition', 'Brand positioning', 'Product-market fit'],
      gradient: 'from-[#34d399] to-[#6ee7b7]',
    },
    {
      icon: PieChart,
      title: 'Operations',
      items: ['Financial management', 'KPI frameworks', 'Team hiring', 'Board governance'],
      gradient: 'from-[#8b5cf6] to-[#ff4fa3]',
    },
  ];

  const faqItems = [
    {
      question: 'How does the AI-powered matching work?',
      answer: 'Our proprietary matching engine analyzes 100+ data signals including founder background, market opportunity, business model, growth trajectory, team composition, investment stage, and investor thesis alignment. Machine learning models assess compatibility probability and surface high-probability matches that would be missed through manual research.',
    },
    {
      question: 'What stage of startups do you work with?',
      answer: 'We serve founders at pre-seed through Series A stages. Whether you\'re validating an idea, have an MVP ready, or are preparing for your next funding round, Launch & Lift provides the matching, profiling, and support services you need to succeed.',
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
      question: 'What makes Launch & Lift different from other platforms?',
      answer: 'We\'re the only platform combining intelligent matching + comprehensive founder profiling + AI-powered pitch optimization + integrated business services. Rather than coordinating separately with lawyers, developers, and marketers, everything you need is available through one platform with data-backed insights.',
    },
    {
      question: 'Do you provide actual funding?',
      answer: 'Launch & Lift connects you with aligned investors—from angel investors to institutional VCs—who are actively deploying capital. We facilitate the matching and provide support services, but the actual investment comes from our network of investors who use our platform to source quality deal flow.',
    },
  ];

  const stats = [
    { value: '3-5x', label: 'Higher Conversion', icon: TrendingUp },
    { value: '70%', label: 'Faster Ready', icon: Clock },
    { value: '100+', label: 'Data Signals', icon: ChartLine },
    { value: '20+', label: 'Services', icon: Briefcase },
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
        {/* Hero Section - Different Layout */}
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 lg:px-8 lg:pt-32 lg:pb-28"
        >
          <div className="text-center space-y-8 mb-16">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f9e4ff] to-[#f0e9ff] px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#8b5cf6] shadow-sm mb-4">
                For Founders
              </span>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl font-semibold text-[#1a1030] sm:text-6xl lg:text-7xl leading-tight">
                Raise Capital Faster with{' '}
                <span className="text-transparent bg-gradient-to-r from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] bg-clip-text">
                  AI-Powered Matching
                </span>
              </h1>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xl leading-relaxed text-[#3b2a57] max-w-3xl mx-auto sm:text-2xl">
                Connect with perfectly aligned investors in days, not months. Get AI-powered pitch optimization, comprehensive founder profiling, and integrated business services—all in one platform.
              </p>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/signup/email?role=founder"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff4fa3] to-[#8b5cf6] px-10 py-5 text-base font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#8b5cf6]/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#8b5cf6]/40"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                to="/resources"
                className="rounded-2xl border-2 border-[#8b5cf6]/30 bg-white/80 px-10 py-5 text-base font-semibold uppercase tracking-wide text-[#8b5cf6] backdrop-blur-sm transition-all duration-300 hover:border-[#ff4fa3]/50 hover:bg-gradient-to-r hover:from-[#ff4fa3]/10 hover:via-[#8b5cf6]/10 hover:to-[#34d399]/10 hover:shadow-lg"
              >
                Watch Demo
              </Link>
            </MotionDiv>
          </div>

          {/* Stats Grid - Horizontal Layout */}
          <MotionDiv
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                delay={idx * 0.1}
              />
            ))}
          </MotionDiv>
        </MotionSection>

        {/* Benefits Section - Alternating Layout */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 space-y-16"
        >
          {benefits.map((benefit, idx) => {
            const isEven = idx % 2 === 0;
            const VariantComponent = isEven ? fadeInLeft : fadeInRight;

            return (
              <MotionDiv
                key={benefit.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={VariantComponent}
                className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}
              >
                <div className={`${isEven ? '' : 'lg:col-start-2'}`}>
                  <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] p-10 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)] h-full min-h-[400px] flex flex-col justify-center">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative z-10 space-y-6">
                      <div className={`inline-flex rounded-2xl bg-white/20 p-4 backdrop-blur-sm`}>
                        <benefit.icon className="h-8 w-8" />
                      </div>
                      <div className="flex items-baseline gap-3">
                        <div className="text-5xl font-bold">{benefit.stat}</div>
                        <div className="text-lg text-white/80">{benefit.statLabel}</div>
                      </div>
                      <h3 className="text-3xl font-semibold">{benefit.title}</h3>
                      <p className="text-lg text-white/90 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
                <div className={`${isEven ? '' : 'lg:col-start-1 lg:row-start-1'} space-y-6`}>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-[#1a1030]">{benefit.title}</h3>
                    <p className="text-lg text-[#3b2a57] leading-relaxed">{benefit.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {['AI-Powered', 'Real-Time', 'Data-Backed'].map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#8b5cf6] border border-[#8b5cf6]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </MotionDiv>
            );
          })}
        </MotionSection>

        {/* Journey Timeline - Vertical Layout */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8"
        >
          <div className="text-center space-y-4 mb-16">
            <span className="inline-flex items-center justify-center rounded-full bg-[#f9e4ff] px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
              Your Journey
            </span>
            <h2 className="text-4xl font-semibold text-[#1a1030] md:text-5xl">
              From Sign Up to Funding in 4 Simple Steps
            </h2>
            <p className="text-lg text-[#3b2a57] max-w-2xl mx-auto">
              Our proven process guides you through every stage of your fundraising journey.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ff4fa3] via-[#8b5cf6] to-[#34d399] hidden lg:block" />

            <div className="space-y-12">
              {journeySteps.map((step, idx) => (
                <MotionDiv
                  key={step.number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInLeft}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex gap-8 items-start"
                >
                  <div className="flex-shrink-0 relative z-10">
                    <div
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                      }}
                    >
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: `${step.color}15` }}
                        >
                          <step.icon className="h-6 w-6" style={{ color: step.color }} />
                        </div>
                        <h3 className="text-2xl font-semibold text-[#1a1030]">{step.title}</h3>
                      </div>
                      <p className="text-[#3b2a57] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* Services Grid - Hexagonal/Modern Layout */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8"
        >
          <div className="text-center space-y-4 mb-16">
            <span className="inline-flex items-center justify-center rounded-full bg-[#f9e4ff] px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#8b5cf6]">
              Integrated Services
            </span>
            <h2 className="text-4xl font-semibold text-[#1a1030] md:text-5xl">
              Everything You Need to Scale
            </h2>
            <p className="text-lg text-[#3b2a57] max-w-2xl mx-auto">
              Access enterprise-grade expertise without enterprise overhead. All critical startup support services in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {services.map((service, idx) => (
              <MotionDiv
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-8 shadow-[0_18px_55px_rgba(139,92,246,0.12)] backdrop-blur transition-all hover:shadow-[0_24px_70px_rgba(139,92,246,0.2)]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <div className="relative">
                  <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${service.gradient} p-4 shadow-lg`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1a1030] mb-4">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center gap-3 text-[#3b2a57]">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#34d399]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        {/* Market Context - Different Style */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#8b5cf6] via-[#ff4fa3] to-[#34d399] p-12 lg:p-16 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <Globe className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">Market Opportunity</p>
                </div>
                <h3 className="text-4xl font-bold leading-tight">Stop Wasting Time on Cold Outreach</h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  Founders spend 30-40 hours/month on unfocused outreach with &lt;10% response rates. You coordinate separately with lawyers, developers, and marketers—wasting time and creating friction.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex-1 min-w-[140px]">
                    <div className="text-3xl font-bold mb-1">$412B+</div>
                    <div className="text-sm text-white/80">Global VC Market</div>
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <div className="text-3xl font-bold mb-1">&lt;10%</div>
                    <div className="text-sm text-white/80">Cold Response Rate</div>
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <div className="text-3xl font-bold mb-1">3-5x</div>
                    <div className="text-sm text-white/80">Our Improvement</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Clock, label: '30-40h/month', desc: 'Wasted on outreach' },
                  { icon: Target, label: '&lt;10%', desc: 'Cold response rate' },
                  { icon: TrendingUp, label: '3-5x', desc: 'Better conversion' },
                  { icon: Rocket, label: 'Days', desc: 'Not months' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <item.icon className="h-6 w-6 mb-3" />
                    <div className="text-2xl font-bold mb-1">{item.label}</div>
                    <div className="text-sm text-white/80">{item.desc}</div>
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
          className="relative mx-auto max-w-7xl space-y-10 px-4 py-20 lg:px-8"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#ff4fa3]/8 to-transparent blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#8b5cf6]/8 to-transparent blur-3xl" />
          </div>

          <div className="relative space-y-4 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f9e4ff] to-[#f0e9ff] px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#8b5cf6] shadow-sm">
              FAQ
            </span>
            <h2 className="text-4xl font-semibold text-[#1a1030] md:text-5xl">
              Got Questions?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#3b2a57] leading-relaxed">
              Everything you need to know about {highlightBrandName('Launch & Lift')}'s platform, services, and how we help founders raise capital faster.
            </p>
          </div>
          <div className="relative">
            <FAQAccordion items={faqItems} initialVisibleCount={6} />
          </div>
        </MotionSection>

        {/* Final CTA - Centered Layout */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#34d399] via-[#8b5cf6] to-[#ff4fa3] p-12 lg:p-16 text-white shadow-[0_28px_90px_rgba(139,92,246,0.28)] text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_68%)] opacity-70" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">Ready to raise capital?</p>
              </div>
              <h3 className="text-4xl font-bold sm:text-5xl leading-tight">
                Join founders using {highlightBrandName('Launch & Lift')}
              </h3>
              <p className="text-xl text-white/90 leading-relaxed">
                Connect with aligned investors in days, not months. Access AI-powered pitch optimization and integrated business services. Start your journey today.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link
                  to="/signup/email?role=founder"
                  className="group relative overflow-hidden rounded-2xl bg-white px-10 py-5 text-base font-semibold uppercase tracking-wide text-[#8b5cf6] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  to="/resources"
                  className="rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-10 py-5 text-base font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-white/20 hover:border-white/50"
                >
                  Schedule Demo
                </Link>
              </div>
            </div>
          </div>
        </MotionSection>
      </div>
    </div>
  );
};

export default Founders;
