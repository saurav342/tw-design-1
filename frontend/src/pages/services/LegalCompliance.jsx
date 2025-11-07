import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  FileText,
  Gavel,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';

const LegalCompliance = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-24">
        <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-blue-200/40 blur-[120px]" />
        <div className="absolute right-[-80px] top-[100px] h-[350px] w-[350px] rounded-full bg-indigo-200/30 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 shadow-sm backdrop-blur-sm">
              <Scale className="h-4 w-4" />
              Legal & Compliance
            </div>
            
            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-night md:text-6xl lg:text-7xl">
              Close your round with
              <span className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> paperwork and protections handled proactively</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-night/70 md:text-xl">
              Streamline diligence, refresh ESOPs, and secure cross-border compliance with specialist partners who keep you deal-ready.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full px-8 text-base shadow-[0_20px_60px_rgba(59,130,246,0.4)]"
              >
                <Link to="/signup/founder">
                  Secure your legal pod
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-14 rounded-full px-8 text-base"
              >
                <Link to="#checklist">Get compliance checklist</Link>
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-indigo-400"
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
                    <span className="font-semibold text-night">210+</span> term sheets reviewed
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">72h</p>
                <p className="text-sm text-night/70">Avg. turnaround</p>
              </div>
              <div className="h-8 w-px bg-night/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-night">10</p>
                <p className="text-sm text-night/70">Geographies covered</p>
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
              Legal friction kills momentum
            </h2>
            <p className="mt-4 text-lg text-night/70">
              Don't let paperwork stall your round. Most deals fall apart in diligence, not pitch meetings.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: FileText,
                title: 'Messy cap tables',
                description: 'Unclear ownership, missing SAFEs, or stale shareholder agreements that investors won\'t touch.',
                color: 'from-blue-500 to-indigo-600',
              },
              {
                icon: Gavel,
                title: 'Compliance gaps',
                description: 'Missing regulatory filings, IP issues, or cross-border structure problems that delay wires.',
                color: 'from-indigo-500 to-purple-600',
              },
              {
                icon: Shield,
                title: 'Founder exposure',
                description: 'Unfavorable terms that dilute too much or give up control without understanding the trade-offs.',
                color: 'from-purple-500 to-pink-600',
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              <Sparkles className="h-4 w-4" />
              Legal Services
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              End-to-end legal orchestration
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
              We partner with vetted specialists and ride shotgun so you stay focused on closing.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: 'Deal room preparation',
                description: 'Comprehensive audit and organization of all documents investors will request during diligence.',
                features: [
                  'Cap table reconciliation & cleanup',
                  'Contract & IP review',
                  'Statutory compliance checklist',
                  'Data room organization & indexing',
                ],
              },
              {
                title: 'Fundraise documentation',
                description: 'Expert review and negotiation support for term sheets, SAFEs, and shareholder agreements.',
                features: [
                  'Term sheet analysis & redlining',
                  'SAFE / Convertible note drafting',
                  'Board resolution & filings',
                  'Post-close cap table updates',
                ],
              },
              {
                title: 'Cross-border compliance',
                description: 'Navigate FEMA, ODI, and international structure requirements for global fundraising.',
                features: [
                  'FEMA & RBI compliance (India)',
                  'ODI structuring for overseas capital',
                  'Multi-jurisdiction entity setup',
                  'Tax treaty optimization',
                ],
              },
              {
                title: 'Founder protections',
                description: 'Negotiation scripts and guidance to protect governance, ESOP pools, and liquidation preferences.',
                features: [
                  'Board composition guidance',
                  'ESOP pool sizing & refresh strategy',
                  'Liquidation preference analysis',
                  'Drag-along & anti-dilution review',
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
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
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

      {/* Compliance Checklist Preview */}
      <section id="checklist" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              <FileCheck className="h-4 w-4" />
              Due Diligence Checklist
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              What investors will ask for
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
              Be proactive. Have these ready before your data room opens.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                category: 'Corporate Documents',
                items: [
                  'Certificate of incorporation',
                  'Articles of association',
                  'Cap table (fully diluted)',
                  'Board resolutions',
                  'Shareholder agreements',
                ],
              },
              {
                category: 'Financial & Tax',
                items: [
                  'Audited financials (3 years)',
                  'Management accounts (current)',
                  'Tax returns & compliance',
                  'Bank statements',
                  'Outstanding liabilities',
                ],
              },
              {
                category: 'IP & Contracts',
                items: [
                  'IP ownership & assignments',
                  'Customer contracts (top 10)',
                  'Vendor agreements',
                  'Employment contracts',
                  'NDAs & confidentiality',
                ],
              },
            ].map((section, index) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-white/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-night">{section.category}</h3>
                    <ul className="mt-4 space-y-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-night/70">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                          <span>{item}</span>
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
              <Zap className="h-4 w-4" />
              The Process
            </div>
            <h2 className="text-3xl font-bold text-night md:text-4xl">
              Deal-ready in 72 hours
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Compliance triage',
                description: 'Audit existing docs, flag gaps, and map regulatory requirements by geography',
                duration: '24 hours',
              },
              {
                step: '02',
                title: 'Specialist engagement',
                description: 'Connect with vetted legal partners while we project-manage the workstream',
                duration: '48 hours',
              },
              {
                step: '03',
                title: 'Close with confidence',
                description: 'Finalized docs, board resolutions, and investor communications ready',
                duration: '72 hours',
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
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xl font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-night">{item.title}</h3>
                    <p className="mt-2 text-sm text-night/70">{item.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
                      {item.duration}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/60 bg-gradient-to-br from-blue-50 to-indigo-50 p-12"
          >
            <div className="text-center">
              <ShieldCheck className="mx-auto mb-6 h-16 w-16 text-blue-600" />
              <h2 className="text-3xl font-bold text-night md:text-4xl">Vetted legal partners</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-night/70">
                We work exclusively with specialists who understand startup fundraising dynamics
              </p>
              <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
                {[
                  { metric: '210+', label: 'Deals closed' },
                  { metric: '10', label: 'Geographies' },
                  { metric: '72h', label: 'Avg. response' },
                  { metric: '100%', label: 'Founder-friendly' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl font-bold text-night">{stat.metric}</p>
                    <p className="mt-2 text-sm text-night/70">{stat.label}</p>
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
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 p-12 text-center text-white shadow-[0_30px_100px_rgba(59,130,246,0.4)]"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <Scale className="mx-auto mb-6 h-16 w-16" />
              <h2 className="text-3xl font-bold md:text-4xl">
                Don't let legal slow down your round
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Get deal-ready with specialists who understand startup dynamics.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-full bg-white px-8 text-base text-night hover:bg-white/90"
                >
                  <Link to="/signup/founder">
                    Get your legal pod
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
                    Download checklist
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/75">
                72-hour turnaround • 10 geographies • Founder-friendly partners
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LegalCompliance;

