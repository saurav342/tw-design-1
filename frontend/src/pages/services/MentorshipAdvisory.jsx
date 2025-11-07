import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Brain,
  CheckCircle2,
  Clock,
  Handshake,
  Network,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';

const MentorshipAdvisory = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/20 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-24">
        <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-emerald-200/40 blur-[120px]" />
        <div className="absolute right-[-80px] top-[100px] h-[350px] w-[350px] rounded-full bg-teal-200/30 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 shadow-sm backdrop-blur-sm">
              <UserCheck className="h-4 w-4" />
              Mentorship & Advisory
            </div>
            
            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-night md:text-6xl lg:text-7xl">
              Tap into operators who've
              <span className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent"> scaled exactly where you are</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-night/70 md:text-xl">
              Get matched with battle-tested founders and investors who provide strategic guidance, warm intros, and accountability to accelerate your fundraising journey.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full px-8 text-base shadow-[0_20px_60px_rgba(16,185,129,0.4)]"
              >
                <Link to="/signup/founder">
                  Meet your advisory pod
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-14 rounded-full px-8 text-base"
              >
                <Link to="#advisors">Browse advisors</Link>
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-teal-400"
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
                    <span className="font-semibold text-night">4.9/5</span> founder satisfaction
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">48</p>
                <p className="text-sm text-night/70">Expert advisors</p>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">16 wks</p>
                <p className="text-sm text-night/70">Avg. engagement</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Advisory Matters */}
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
              Fundraising is lonely. It doesn't have to be.
            </h2>
            <p className="mt-4 text-lg text-night/70">
              The founders who close rounds fastest have a secret weapon: advisors who've been there before.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Brain,
                title: 'Pattern recognition',
                description: 'Advisors spot red flags and opportunities you can\'t see from inside the building.',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                icon: Network,
                title: 'Network activation',
                description: 'Warm intros to the right investors, talent, and partners at exactly the right time.',
                color: 'from-teal-500 to-cyan-600',
              },
              {
                icon: Target,
                title: 'Decision velocity',
                description: 'Move faster with confidence on cap tables, pricing, hiring, and product roadmap.',
                color: 'from-cyan-500 to-blue-600',
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">
              <Sparkles className="h-4 w-4" />
              Advisory Services
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              A personalized pod built around your goals
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
              We match you with 2-3 advisors based on your stage, sector, and specific gaps.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: 'Sector-matched advisors',
                description: 'Work with operators who have scaled companies in your specific market and understand your investor landscape.',
                features: [
                  'Former founders at your stage',
                  'Fund partners & angels from target firms',
                  'Functional experts (GTM, product, finance)',
                  'Geography-specific network access',
                ],
              },
              {
                title: 'Structured cadence',
                description: 'Bi-weekly 1:1s, async check-ins, and on-demand access during critical moments like IC prep.',
                features: [
                  'Fortnightly strategic sessions',
                  'Async Slack/WhatsApp access',
                  'Deal room & pitch rehearsals',
                  'Board prep & cap table modeling',
                ],
              },
              {
                title: 'Warm introductions',
                description: 'High-signal intros to investors, customers, talent, and ecosystem partners mapped to your KPIs.',
                features: [
                  'Curated investor intros',
                  'Customer & partnership connections',
                  'Key hire referrals',
                  'Ecosystem ally mapping',
                ],
              },
              {
                title: 'Playbook access',
                description: 'Templates, frameworks, and resources from advisors who\'ve built successful fundraising systems.',
                features: [
                  'Fundraising playbooks & timelines',
                  'Due diligence checklists',
                  'Term sheet negotiation scripts',
                  'Investor update templates',
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
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
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

      {/* Advisor Profiles */}
      <section id="advisors" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <Users className="h-4 w-4" />
              Meet the Advisors
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              Operators who've raised $2B+ combined
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Priya Sharma',
                role: 'Former VP Growth, Unicorn SaaS',
                expertise: 'GTM, Product-Led Growth',
                raised: '$120M Series B',
                badge: 'SaaS Expert',
              },
              {
                name: 'Rajesh Kumar',
                role: 'Ex-Partner, Tier-1 VC',
                expertise: 'Cap Tables, Term Sheets',
                raised: 'Backed 40+ companies',
                badge: 'Investor View',
              },
              {
                name: 'Ananya Desai',
                role: 'Founder & CEO, Exited Startup',
                expertise: 'Early-Stage Fundraising',
                raised: '$15M Seed → Acquisition',
                badge: 'Founder Journey',
              },
            ].map((advisor, index) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-white/60 bg-white/80 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl font-bold text-white">
                        {advisor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        {advisor.badge}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-night">{advisor.name}</h3>
                    <p className="mt-1 text-sm text-night/60">{advisor.role}</p>
                    <div className="mt-4 space-y-2 text-sm text-night/70">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-emerald-600" />
                        <span>{advisor.expertise}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span>{advisor.raised}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
              <Clock className="h-4 w-4" />
              The Process
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              From matching to momentum in 48 hours
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Diagnostic call',
                description: 'We map your stage, goals, gaps, and ideal advisor profile in a 30-minute sync.',
                duration: '30 min',
              },
              {
                step: '02',
                title: 'Pod matching',
                description: 'Get matched with 2-3 advisors and schedule intro calls to find the right chemistry.',
                duration: '48 hours',
              },
              {
                step: '03',
                title: 'Engagement kickoff',
                description: 'Set cadence, KPIs, and first sprints. Your pod is active and ready to support.',
                duration: '1 week',
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
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xl font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-night">{item.title}</h3>
                    <p className="mt-2 text-sm text-night/70">{item.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-emerald-600">
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
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 p-12 text-center text-white shadow-[0_30px_100px_rgba(16,185,129,0.4)]"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <Handshake className="mx-auto mb-6 h-16 w-16" />
              <h2 className="text-3xl font-bold md:text-4xl">
                Get matched with your advisory pod today
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Join founders who are moving faster and closing rounds with expert guidance.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-full bg-white px-8 text-base text-night hover:bg-white/90"
                >
                  <Link to="/signup/founder">
                    Start advisory engagement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-14 rounded-full border border-white/30 px-8 text-base text-white hover:bg-white/10"
                >
                  <Link to="/dashboard/founder/services">
                    View all services
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/75">
                Flexible engagements • Bi-weekly cadence • Success-based pricing
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MentorshipAdvisory;

