import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart,
  CheckCircle2,
  Code2,
  Cpu,
  Monitor,
  MousePointer,
  Play,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';

const TechEnhancementSupport = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-violet-50/20 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-24">
        <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-violet-200/40 blur-[120px]" />
        <div className="absolute right-[-80px] top-[100px] h-[350px] w-[350px] rounded-full bg-purple-200/30 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 shadow-sm backdrop-blur-sm">
              <Cpu className="h-4 w-4" />
              Tech Enhancement Support
            </div>
            
            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-night md:text-6xl lg:text-7xl">
              Ship product polish
              <span className="bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent"> that turns demos into term sheets</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-night/70 md:text-xl">
              Prioritize design debt, instrument analytics, and craft demo storytelling so investors see momentum in every click.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full px-8 text-base shadow-[0_20px_60px_rgba(139,92,246,0.4)]"
              >
                <Link to="/signup/founder">
                  Plan your polish sprint
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-14 rounded-full px-8 text-base"
              >
                <Link to="#process">See the process</Link>
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-violet-400 to-purple-400"
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
                    <span className="font-semibold text-night">120</span> feature sprints completed
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">+34%</p>
                <p className="text-sm text-night/70">Demo conversion lift</p>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">3 wks</p>
                <p className="text-sm text-night/70">Avg. sprint length</p>
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
              Your product is your pitch
            </h2>
            <p className="mt-4 text-lg text-night/70">
              Investors judge velocity, not promises. Show them a product that looks and feels like it's moving fast.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Monitor,
                title: 'UX friction',
                description: 'Rough onboarding, slow load times, or clunky flows that make investors question your execution.',
                color: 'from-violet-500 to-purple-600',
              },
              {
                icon: BarChart,
                title: 'Missing instrumentation',
                description: 'No analytics, heat maps, or funnel data to back up your traction claims with real signals.',
                color: 'from-purple-500 to-fuchsia-600',
              },
              {
                icon: Play,
                title: 'Underwhelming demos',
                description: 'Live demos that crash, pre-recorded videos that bore, or no demo strategy at all.',
                color: 'from-fuchsia-500 to-pink-600',
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
              <Sparkles className="h-4 w-4" />
              Sprint Deliverables
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              A product that showcases momentum
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
              We work with your team to identify quick wins and ship polish that investors notice.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: 'Experience audit',
                description: 'Deep UX teardown of onboarding, core loops, and performance to identify friction that dims your story.',
                features: [
                  'User flow analysis & heuristic review',
                  'Performance benchmarking',
                  'Accessibility & mobile optimization',
                  'Competitive UX comparison',
                ],
              },
              {
                title: 'Quick-win roadmap',
                description: 'Prioritized backlog of polish items that can ship in 2-3 weeks and have high investor visibility.',
                features: [
                  'Impact vs. effort prioritization',
                  'Sprint planning & design specs',
                  'QA checklist & acceptance criteria',
                  'Engineering resource mapping',
                ],
              },
              {
                title: 'Analytics instrumentation',
                description: 'Wire up event tracking, session replay, and funnels that prove adoption and engagement.',
                features: [
                  'Event taxonomy & tracking plan',
                  'Mixpanel / Amplitude setup',
                  'Session replay (Hotjar / FullStory)',
                  'Funnel dashboards for investor updates',
                ],
              },
              {
                title: 'Demo theatre',
                description: 'Craft narrative demos with motion design, voiceover scripts, and recorded assets for investor follow-ups.',
                features: [
                  'Demo script with storytelling arc',
                  'Screen recording with annotations',
                  'Motion design & video editing',
                  'Demo environment setup & seed data',
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
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
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

      {/* Before / After Examples */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">
              <Wrench className="h-4 w-4" />
              Polish Impact
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              Small changes, big investor perception
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                metric: '+42%',
                label: 'Demo completion',
                description: 'More investors finish the product walkthrough',
              },
              {
                metric: '3.2x',
                label: 'Session time',
                description: 'Investors spend more time exploring features',
              },
              {
                metric: '+58%',
                label: 'Follow-up rate',
                description: 'Higher conversion from demo to next meeting',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-white/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <p className="text-4xl font-bold text-violet-600">{stat.metric}</p>
                    <p className="mt-2 text-lg font-semibold text-night">{stat.label}</p>
                    <p className="mt-2 text-sm text-night/70">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
              <Zap className="h-4 w-4" />
              Sprint Framework
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              From audit to showtime in 3 weeks
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                week: 'Week 1',
                title: 'Product triage',
                description: 'UX audit, roadmap prioritization, and investor demo strategy workshop',
                deliverable: 'Prioritized sprint backlog',
              },
              {
                week: 'Week 2',
                title: 'Lightning build',
                description: 'Co-build features, polish UI, and wire up analytics with your engineering team',
                deliverable: 'Shipped improvements',
              },
              {
                week: 'Week 3',
                title: 'Demo production',
                description: 'Create demo assets, walkthrough scripts, and metrics dashboards',
                deliverable: 'Investor-ready demo kit',
              },
            ].map((item, index) => (
              <motion.div
                key={item.week}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-white/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-600">
                      {item.week}
                    </div>
                    <h3 className="text-xl font-semibold text-night">{item.title}</h3>
                    <p className="mt-2 text-sm text-night/70">{item.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-violet-600" />
                      <span className="font-semibold text-night/80">{item.deliverable}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Model */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/60 bg-gradient-to-br from-violet-50 to-purple-50 p-12"
          >
            <div className="text-center">
              <Code2 className="mx-auto mb-6 h-16 w-16 text-violet-600" />
              <h2 className="text-3xl font-bold text-night md:text-4xl">We embed with your team</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
                Not outsourced. Not consulting. We work directly in your codebase, tools, and workflows.
              </p>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {[
                  { icon: Code2, label: 'GitHub / GitLab access', description: 'Direct commits & PRs' },
                  { icon: Monitor, label: 'Figma / Design tools', description: 'Real-time collaboration' },
                  { icon: MousePointer, label: 'Analytics platforms', description: 'Instrumentation setup' },
                ].map((tool) => (
                  <Card key={tool.label} className="border-white/60 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <tool.icon className="mx-auto mb-3 h-10 w-10 text-violet-600" />
                      <h3 className="font-semibold text-night">{tool.label}</h3>
                      <p className="mt-1 text-sm text-night/70">{tool.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
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
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 p-12 text-center text-white shadow-[0_30px_100px_rgba(139,92,246,0.4)]"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <Cpu className="mx-auto mb-6 h-16 w-16" />
              <h2 className="text-3xl font-bold md:text-4xl">
                Ship product polish before your next demo
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                3-week sprints that make investors see momentum in every click.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-full bg-white px-8 text-base text-night hover:bg-white/90"
                >
                  <Link to="/signup/founder">
                    Start your polish sprint
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-14 rounded-full border border-white/30 px-8 text-base text-white hover:bg-white/10"
                >
                  <Link to="/dashboard/founder/marketplace">
                    Find tech partners
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/75">
                3-week sprints • Embedded team • +34% demo conversion
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TechEnhancementSupport;

