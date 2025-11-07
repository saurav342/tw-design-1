import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  DollarSign,
  LineChart,
  PieChart,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';

const FinancialProjections = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/20 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-24">
        <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-amber-200/40 blur-[120px]" />
        <div className="absolute right-[-80px] top-[100px] h-[350px] w-[350px] rounded-full bg-orange-200/30 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 shadow-sm backdrop-blur-sm">
              <LineChart className="h-4 w-4" />
              Financial Projections
            </div>
            
            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-night md:text-6xl lg:text-7xl">
              Financial models that
              <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 bg-clip-text text-transparent"> survive diligence and tell your growth story</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-night/70 md:text-xl">
              Build investor-grade operating models with scenario planning, unit economics, and dashboards that give VCs confidence to wire faster.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full px-8 text-base shadow-[0_20px_60px_rgba(245,158,11,0.4)]"
              >
                <Link to="/signup/founder">
                  Book a modeling sprint
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-14 rounded-full px-8 text-base"
              >
                <Link to="#examples">See model examples</Link>
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-amber-400 to-orange-400"
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
                    <span className="font-semibold text-night">175+</span> models delivered
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">36 mo</p>
                <p className="text-sm text-night/70">Cash runway view</p>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">6</p>
                <p className="text-sm text-night/70">Scenario branches</p>
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
              Investors don't fund hope. They fund models.
            </h2>
            <p className="mt-4 text-lg text-night/70">
              A back-of-napkin projection won't survive the first IC. You need numbers that tell a story.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Calculator,
                title: 'Assumptions unclear',
                description: 'Generic growth rates without cohort data or market validation make VCs nervous.',
                color: 'from-amber-500 to-orange-600',
              },
              {
                icon: PieChart,
                title: 'Unit economics missing',
                description: 'Without CAC, LTV, payback periods, and margin analysis, you\'re just guessing.',
                color: 'from-orange-500 to-rose-600',
              },
              {
                icon: BarChart3,
                title: 'No scenario planning',
                description: 'Single forecast = blind spots. Investors want to see best, base, and conservative cases.',
                color: 'from-rose-500 to-pink-600',
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
              Model Components
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              A complete financial system, not just a spreadsheet
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
              Built by analysts who've been on both sides of the diligence table.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: 'Integrated financial statements',
                description: 'P&L, cash flow, and balance sheet that auto-sync with driver logic and assumptions.',
                features: [
                  'Revenue build-up by channel & cohort',
                  'Cost structure with headcount planning',
                  'Working capital & cash bridge',
                  'Monthly granularity for 36 months',
                ],
              },
              {
                title: 'Unit economics deep-dive',
                description: 'CAC, LTV, payback period, and margin analysis that prove your business model works.',
                features: [
                  'Channel-specific CAC breakdown',
                  'Cohort retention & LTV curves',
                  'Payback period & Rule of 40',
                  'Contribution margin by customer segment',
                ],
              },
              {
                title: 'Scenario modeling',
                description: 'Best, base, and conservative cases with sensitivity analysis for key drivers.',
                features: [
                  '3 fully-modeled scenarios',
                  'Sensitivity tables for growth & burn',
                  'Funding requirement by scenario',
                  'Break-even & profitability paths',
                ],
              },
              {
                title: 'Investor reporting suite',
                description: 'Board-ready dashboards and monthly investor update templates that auto-populate.',
                features: [
                  'KPI dashboard with trend analysis',
                  'Monthly investor update template',
                  'Variance analysis (actual vs. plan)',
                  'Cap table integration & dilution modeling',
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
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
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

      {/* Example Models */}
      <section id="examples" className="py-20">
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
              Model Library
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              Built for your business model
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                type: 'SaaS / Subscription',
                metrics: ['MRR, ARR, Churn', 'CAC Payback', 'Net Revenue Retention', 'Magic Number'],
                scenarios: 'PLG vs. Sales-led growth paths',
              },
              {
                type: 'Marketplace / Platform',
                metrics: ['GMV, Take Rate', 'Supply & Demand Economics', 'Network Effects', 'Cohort Contribution'],
                scenarios: 'Subsidy models & liquidity paths',
              },
              {
                type: 'Consumer / D2C',
                metrics: ['CAC, LTV by Channel', 'Repeat Purchase Rate', 'Gross Margin', 'Inventory Turns'],
                scenarios: 'Channel mix & retention curves',
              },
            ].map((model, index) => (
              <motion.div
                key={model.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-white/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-night">{model.type}</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-night/50">Key Metrics</p>
                        <ul className="mt-2 space-y-1">
                          {model.metrics.map((metric) => (
                            <li key={metric} className="flex items-start gap-2 text-sm text-night/70">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                              <span>{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-night/50">Scenarios</p>
                        <p className="mt-2 text-sm text-night/70">{model.scenarios}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              <Zap className="h-4 w-4" />
              The Process
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              Diligence-ready in 2 weeks
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Data collection',
                description: 'Historical financials, cohorts, and market benchmarks',
                duration: '2-3 days',
              },
              {
                step: '02',
                title: 'Model architecture',
                description: 'Driver identification, assumption validation, and structure design',
                duration: '3-4 days',
              },
              {
                step: '03',
                title: 'Build & scenarios',
                description: 'Full P&L, cash flow, and scenario modeling with sensitivities',
                duration: '4-5 days',
              },
              {
                step: '04',
                title: 'Review & delivery',
                description: 'Walkthrough with your team + investor-ready documentation',
                duration: '2 days',
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
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-xl font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-night">{item.title}</h3>
                    <p className="mt-2 text-sm text-night/70">{item.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-amber-600">
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
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-amber-600 via-orange-500 to-rose-500 p-12 text-center text-white shadow-[0_30px_100px_rgba(245,158,11,0.4)]"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <DollarSign className="mx-auto mb-6 h-16 w-16" />
              <h2 className="text-3xl font-bold md:text-4xl">
                Build a financial model that closes rounds
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Stop guessing. Start modeling with analysts who've seen both sides of the table.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-full bg-white px-8 text-base text-night hover:bg-white/90"
                >
                  <Link to="/signup/founder">
                    Start your model sprint
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-14 rounded-full border border-white/30 px-8 text-base text-white hover:bg-white/10"
                >
                  <Link to="/resources">
                    Download templates
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/75">
                2-week delivery • Scenario planning included • Board-ready dashboards
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FinancialProjections;

