import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageCircle,
  Presentation,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';

const PitchDeckPreparation = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-rose-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-24">
        <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-rose-200/40 blur-[120px]" />
        <div className="absolute right-[-80px] top-[100px] h-[350px] w-[350px] rounded-full bg-purple-200/30 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 shadow-sm backdrop-blur-sm">
              <FileText className="h-4 w-4" />
              Pitch Deck Preparation
            </div>
            
            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-night md:text-6xl lg:text-7xl">
              A deck that gets you from
              <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> first meeting to term sheet</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-night/70 md:text-xl">
              Work with storytelling experts and world-class designers to create a pitch deck that captures attention, builds conviction, and closes rounds.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full px-8 text-base shadow-[0_20px_60px_rgba(255,79,154,0.4)]"
              >
                <Link to="/signup/founder">
                  Start your deck sprint
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-14 rounded-full px-8 text-base"
              >
                <Link to="#how-it-works">See how it works</Link>
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-rose-400"
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
                    <span className="font-semibold text-night">175+ founders</span> funded
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">92%</p>
                <p className="text-sm text-night/70">Got second meetings</p>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">12 days</p>
                <p className="text-sm text-night/70">Avg. turnaround</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
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
              Your story deserves better than a template
            </h2>
            <p className="mt-4 text-lg text-night/70">
              Most founders lose funding not because their idea isn't good, but because their deck doesn't do it justice.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: 'Story gets lost',
                description: 'Templates force you into someone else\'s narrative arc instead of amplifying yours.',
                color: 'from-rose-500 to-pink-600',
              },
              {
                icon: Sparkles,
                title: 'Design feels generic',
                description: 'Investors see hundreds of decks. Yours needs to stand out, not blend in.',
                color: 'from-purple-500 to-indigo-600',
              },
              {
                icon: TrendingUp,
                title: 'Data underwhelms',
                description: 'Great metrics poorly presented = missed opportunities. Context is everything.',
                color: 'from-indigo-500 to-cyan-600',
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
              What's Included
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              A complete pitch transformation
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
              From narrative strategy to final delivery, we handle every aspect of creating a deck that converts.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: 'Story architecture lab',
                description: 'We map your narrative arc, competitive positioning, and data reveals to create a compelling investor journey.',
                features: [
                  'One-on-one narrative workshop',
                  'Competitive landscape analysis',
                  'Investor psychology mapping',
                  'Slide sequencing strategy',
                ],
              },
              {
                title: 'World-class design',
                description: 'Custom visual system that makes your brand memorable and your data crystal clear.',
                features: [
                  'Bespoke design system',
                  'Data visualization mastery',
                  'Motion & animation design',
                  'Multi-format delivery (Pitch, Keynote, PDF)',
                ],
              },
              {
                title: 'Content refinement',
                description: 'Every word, number, and image optimized for investor attention and comprehension.',
                features: [
                  'Copywriting & messaging',
                  'Financial storytelling',
                  'Market sizing validation',
                  'Appendix & data room prep',
                ],
              },
              {
                title: 'Presentation coaching',
                description: 'Practice sessions with former VCs to rehearse delivery, timing, and Q&A handling.',
                features: [
                  'Mock pitch sessions',
                  'Objection handling prep',
                  'Body language & delivery coaching',
                  'Q&A scenario planning',
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

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              <Zap className="h-4 w-4" />
              The Process
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              From first call to pitch-ready in 2 weeks
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'Deep dive into your story, metrics, and investor targets',
                duration: '2 days',
              },
              {
                step: '02',
                title: 'Narrative Design',
                description: 'Story arc, slide sequence, and content strategy',
                duration: '3 days',
              },
              {
                step: '03',
                title: 'Visual Build',
                description: 'Design system, slides, and data visualization',
                duration: '5 days',
              },
              {
                step: '04',
                title: 'Polish & Practice',
                description: 'Refinements, animations, and presentation coaching',
                duration: '2 days',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-gradient-to-b from-purple-300 to-transparent md:left-full md:top-1/2 md:h-px md:w-full md:-translate-y-1/2 md:translate-x-0" />
                <Card className="relative border-white/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-rose-500 text-xl font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-night">{item.title}</h3>
                    <p className="mt-2 text-sm text-night/70">{item.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-purple-600">
                      {item.duration}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Results */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/60 bg-gradient-to-br from-purple-50 to-rose-50 p-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-night md:text-4xl">Trusted by founders at</h2>
              <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                {['YC', 'Sequoia', 'a16z', 'Accel'].map((investor) => (
                  <div
                    key={investor}
                    className="flex items-center justify-center rounded-2xl border border-white/60 bg-white/80 p-6 text-2xl font-bold text-night/60 backdrop-blur-sm"
                  >
                    {investor}
                  </div>
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
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-purple-600 via-rose-500 to-orange-500 p-12 text-center text-white shadow-[0_30px_100px_rgba(139,92,246,0.4)]"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <Presentation className="mx-auto mb-6 h-16 w-16" />
              <h2 className="text-3xl font-bold md:text-4xl">
                Ready to create a deck that closes rounds?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Join 175+ founders who transformed their pitch and secured funding with Launch & Lift.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-full bg-white px-8 text-base text-night hover:bg-white/90"
                >
                  <Link to="/signup/founder">
                    Start your deck sprint
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
                    Browse all services
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/75">
                No upfront fees • Success-based pricing • 12-day turnaround
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PitchDeckPreparation;

