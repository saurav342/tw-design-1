import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Globe,
  Megaphone,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';

const GrowthMarketing = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-red-50/20 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-24">
        <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-red-200/40 blur-[120px]" />
        <div className="absolute right-[-80px] top-[100px] h-[350px] w-[350px] rounded-full bg-orange-200/30 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 shadow-sm backdrop-blur-sm">
              <Rocket className="h-4 w-4" />
              Growth Marketing
            </div>
            
            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-night md:text-6xl lg:text-7xl">
              Turn investor demand into
              <span className="bg-gradient-to-r from-red-500 via-orange-600 to-amber-600 bg-clip-text text-transparent"> measurable customer traction</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-night/70 md:text-xl">
              Launch precision GTM experiments with operators who've scaled SaaS, climate, and consumer brands. Build traction that validates your pitch.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full px-8 text-base shadow-[0_20px_60px_rgba(239,68,68,0.4)]"
              >
                <Link to="/signup/founder">
                  Spin up your GTM pod
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-14 rounded-full px-8 text-base"
              >
                <Link to="#experiments">See experiments</Link>
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-red-400 to-orange-400"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-night/70">
                    <span className="font-semibold text-night">260+</span> experiments launched
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">+41%</p>
                <p className="text-sm text-night/70">Pipeline lift</p>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">6</p>
                <p className="text-sm text-night/70">Channels avg.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              Investors fund traction, not potential
            </h2>
            <p className="mt-4 text-lg text-night/70">
              The best pitch deck can't overcome flat user growth. Show momentum with real customer acquisition.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: 'Spray and pray',
                description: 'Trying every channel without focus leads to burnout and anemic results across the board.',
                color: 'from-red-500 to-orange-600',
              },
              {
                icon: Megaphone,
                title: 'Messaging confusion',
                description: 'Generic positioning that doesn\'t resonate with your ICP or differentiate from competitors.',
                color: 'from-orange-500 to-amber-600',
              },
              {
                icon: BarChart3,
                title: 'Attribution blindness',
                description: 'No measurement framework means you can\'t prove what\'s working or optimize for ROI.',
                color: 'from-amber-500 to-yellow-600',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-white/60 bg-white/80 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 ${item.color}`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-night">{item.title}</h3>
                    <p className="mt-2 text-night/70">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              <Sparkles className="h-4 w-4" />
              GTM Services
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              A complete growth engine, not just tactics
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
              We build repeatable systems with operators who've scaled from zero to exit.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: 'Channel prioritization',
                description: 'Signal-led framework to identify which channels will deliver the fastest traction for your ICP and resources.',
                features: [
                  'Channel fit scoring by ICP',
                  'Resource mapping & budget allocation',
                  'Quick-win vs. long-term channel mix',
                  'Competitive channel analysis',
                ],
              },
              {
                title: 'Messaging & positioning',
                description: 'Nail your value prop, differentiation, and narrative for each audience and channel.',
                features: [
                  'ICP persona development',
                  'Value proposition workshop',
                  'Competitive positioning map',
                  'Channel-specific messaging variants',
                ],
              },
              {
                title: 'Creative operations',
                description: 'Collaborate with copy, design, and performance specialists to ship campaigns that convert.',
                features: [
                  'Landing page optimization',
                  'Ad creative production (paid social, search)',
                  'Email sequences & nurture flows',
                  'Content calendar & editorial planning',
                ],
              },
              {
                title: 'Growth instrumentation',
                description: 'Connected attribution stack with dashboards that sync to investor updates and board reviews.',
                features: [
                  'Multi-touch attribution setup',
                  'CAC, LTV, payback tracking',
                  'Funnel dashboards & cohort analysis',
                  'Weekly investor-ready reporting',
                ],
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-white/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold text-night">{item.title}</h3>
                    <p className="mt-3 text-night/70">{item.description}</p>
                    <ul className="mt-6 space-y-3">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                          <span className="text-night/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiment Examples */}
      <section id="experiments" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              <TrendingUp className="h-4 w-4" />
              Experiment Playbook
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              Weekly experiments that compound
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                channel: 'Paid Acquisition',
                experiments: [
                  'Google Search: Intent-based campaigns',
                  'LinkedIn: ABM for enterprise buyers',
                  'Meta: Lookalike & retargeting',
                  'Reddit/Quora: Community seeding',
                ],
                kpi: 'CAC, ROAS, Payback',
              },
              {
                channel: 'Product-Led Growth',
                experiments: [
                  'Freemium conversion optimization',
                  'Viral loop instrumentation',
                  'Onboarding A/B testing',
                  'Referral program launch',
                ],
                kpi: 'Activation, Viral coefficient',
              },
              {
                channel: 'Content & Community',
                experiments: [
                  'SEO content clusters',
                  'Founder-led LinkedIn content',
                  'Webinar/workshop series',
                  'Slack/Discord community',
                ],
                kpi: 'Organic traffic, Engagement',
              },
            ].map((playbook, index) => (
              <motion.div
                key={playbook.channel}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-white/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-night">{playbook.channel}</h3>
                    <ul className="mt-4 space-y-2">
                      {playbook.experiments.map((experiment) => (
                        <li key={experiment} className="flex items-start gap-2 text-sm text-night/70">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                          <span>{experiment}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/60 bg-gradient-to-br from-red-50 to-orange-50 p-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-night md:text-4xl">Real traction in 90 days</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
                Founders who run structured experiments see measurable growth that investors notice
              </p>
              <div className="mt-12 grid gap-8 md:grid-cols-4">
                {[
                  { metric: '41%', label: 'Avg. pipeline lift' },
                  { metric: '3.2x', label: 'Channel efficiency' },
                  { metric: '60%', label: 'Faster CAC payback' },
                  { metric: '2-4wks', label: 'Experiment velocity' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-4xl font-bold text-red-600">{stat.metric}</p>
                    <p className="mt-2 text-sm text-night/70">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              <Zap className="h-4 w-4" />
              Engagement Model
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              Weekly sprints, measurable wins
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'GTM blueprint',
                description: 'Clarify ICP, narrative, channels, and 90-day traction targets',
                duration: '1 week',
              },
              {
                step: '02',
                title: 'Experiment runway',
                description: 'Design weekly experiment cycles across paid, product, and community',
                duration: '8-12 weeks',
              },
              {
                step: '03',
                title: 'Traction broadcast',
                description: 'Weekly dashboards and investor-ready snapshots of momentum',
                duration: 'Ongoing',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-white/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-xl font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-night">{item.title}</h3>
                    <p className="mt-2 text-sm text-night/70">{item.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-red-600">
                      {item.duration}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 p-12 text-center text-white shadow-[0_30px_100px_rgba(239,68,68,0.4)]"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <Rocket className="mx-auto mb-6 h-16 w-16" />
              <h2 className="text-3xl font-bold md:text-4xl">
                Build traction that validates your pitch
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Launch experiments with operators who've scaled startups from zero to exit.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-full bg-white px-8 text-base text-night hover:bg-white/90"
                >
                  <Link to="/signup/founder">
                    Launch your GTM pod
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-14 rounded-full border border-white/30 px-8 text-base text-white hover:bg-white/10"
                >
                  <Link to="/portfolio">
                    See success stories
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/75">
                Weekly experiments • +41% pipeline lift • Investor-ready dashboards
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GrowthMarketing;

