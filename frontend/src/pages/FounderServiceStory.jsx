import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { FOUNDER_SERVICE_DETAILS, FOUNDER_SERVICE_STORIES } from '../data/founderExtras.js';

const gradientTokens = {
  'pitch-deck': 'from-[#ff4fa3]/70 via-[#8b5cf6]/35 to-[#34d399]/70',
  mentorship: 'from-[#8b5cf6]/70 via-[#34d399]/35 to-[#ffdd57]/70',
  financials: 'from-[#ffdd57]/70 via-[#8b5cf6]/35 to-[#ff4fa3]/70',
  legal: 'from-[#0ea5e9]/60 via-[#8b5cf6]/30 to-[#34d399]/60',
  tech: 'from-[#6366f1]/70 via-[#3b82f6]/40 to-[#34d399]/70',
  growth: 'from-[#fb7185]/70 via-[#8b5cf6]/35 to-[#22d3ee]/70',
};

const glassBorderTokens = {
  'pitch-deck': 'border-[#ff4fa3]/50',
  mentorship: 'border-[#34d399]/45',
  financials: 'border-[#ffdd57]/45',
  legal: 'border-[#0ea5e9]/45',
  tech: 'border-[#6366f1]/45',
  growth: 'border-[#fb7185]/45',
};

const blurSlug = {
  'pitch-deck': 'bg-[radial-gradient(circle_at_top,_rgba(255,79,163,0.28),transparent_65%)]',
  mentorship: 'bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.26),transparent_65%)]',
  financials: 'bg-[radial-gradient(circle_at_top,_rgba(255,221,87,0.26),transparent_65%)]',
  legal: 'bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.26),transparent_65%)]',
  tech: 'bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.3),transparent_65%)]',
  growth: 'bg-[radial-gradient(circle_at_top,_rgba(251,113,133,0.26),transparent_65%)]',
};

const MotionSection = motion.section;
const MotionDiv = motion.div;

const fadeIn = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
};

const scalePop = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const FounderServiceStory = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const story = FOUNDER_SERVICE_STORIES[serviceId];
  const base = useMemo(
    () => FOUNDER_SERVICE_DETAILS.find((item) => item.id === serviceId),
    [serviceId],
  );

  if (!story || !base) {
    return (
      <section className="relative min-h-[70vh] overflow-hidden bg-[#0b0618] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c0f3f] via-[#120826] to-[#040109]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.28),transparent_65%)] blur-3xl" />
        <div className="relative mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 text-center">
          <p className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
            Founder services
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            This service story is still brewing in the studio
          </h1>
          <p className="max-w-2xl text-sm text-white/75">
            Head back to the catalogue to pick another pod or drop us a line so we can prioritise the one
            you need.
          </p>
          <Button
            variant="ghost"
            className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
            onClick={() => navigate('/dashboard/founder/services')}
          >
            Return to services
          </Button>
        </div>
      </section>
    );
  }

  const gradient = gradientTokens[serviceId] ?? 'from-[#ff4fa3]/60 via-[#8b5cf6]/35 to-[#34d399]/60';
  const borderTint = glassBorderTokens[serviceId] ?? 'border-white/50';
  const blurTexture = blurSlug[serviceId] ?? 'bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.26),transparent_65%)]';

  return (
    <section className="relative overflow-hidden bg-[#060313] pb-24 pt-28 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#120826] via-[#070312] to-[#020107]" />
      <div className={clsx('pointer-events-none absolute inset-0 opacity-80', blurTexture)} />
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#ff4fa3]/30 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-120px] top-40 h-[520px] w-[520px] rounded-full bg-[#34d399]/25 blur-[180px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        <MotionSection
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/5 px-8 py-12 shadow-[0_30px_120px_rgba(18,8,38,0.45)] backdrop-blur-3xl sm:px-12"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14),rgba(255,255,255,0))]" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <Button
                variant="ghost"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/5 text-xs uppercase tracking-[0.35em] text-white/80 hover:bg-white/15"
                onClick={() => navigate('/dashboard/founder/services')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to services
              </Button>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-white/70">
                <Sparkles className="h-3.5 w-3.5" />
                {story.hero.eyebrow}
              </p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                {story.hero.headline}
              </h1>
              <p className="text-base text-white/80 md:text-lg">{story.hero.subcopy}</p>
            </div>
            <MotionDiv
              custom={0.12}
              variants={scalePop}
              initial="hidden"
              animate="visible"
              className={clsx(
                'grid w-full max-w-md grid-cols-1 gap-4 rounded-3xl border bg-white/10 p-4 text-left backdrop-blur-2xl sm:grid-cols-3 sm:gap-5 sm:p-5',
                borderTint,
              )}
            >
              {story.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/15 px-4 py-3 text-center">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </MotionDiv>
          </div>
        </MotionSection>

        <MotionSection
          custom={0.05}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.25, once: true }}
          variants={fadeIn}
          className="grid gap-6 lg:grid-cols-[1.2fr_1fr]"
        >
          <MotionDiv
            custom={0.08}
            variants={fadeIn}
            className={clsx(
              'relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl',
              blurTexture,
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />
            <div className="absolute -right-24 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[120px]" />
            <div className="relative space-y-6">
              <h2 className="text-3xl font-semibold text-white">What this pod unlocks</h2>
              <p className="max-w-2xl text-base text-white/75">{base.description}</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {story.highlights.map((highlight) => (
                  <MotionDiv
                    key={highlight.title}
                    custom={0.1}
                    variants={scalePop}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2, once: true }}
                    className="group rounded-3xl border border-white/10 bg-white/10 p-5 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-1"
                  >
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.55rem] uppercase tracking-[0.35em] text-white/60">
                      <Sparkles className="h-3 w-3" />
                      Spotlight
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{highlight.title}</h3>
                    <p className="mt-2 text-sm text-white/75">{highlight.description}</p>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            custom={0.12}
            variants={fadeIn}
            className="flex flex-col justify-between gap-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-3xl"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Outcomes you walk away with</h2>
              <ul className="space-y-3 text-sm text-white/75">
                {base.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-white/70" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border border-white/10 bg-white/10 text-white/80 backdrop-blur-2xl">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-[0.35em] text-white/60">
                  Operator tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-white/75">
                  We ship drafts in collaborative canvases so your team and investors can react in
                  real-time. Expect layered versions, comment rituals, and fast decision loops.
                </p>
              </CardContent>
            </Card>
          </MotionDiv>
        </MotionSection>

        <MotionSection
          custom={0.08}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3, once: true }}
          variants={fadeIn}
          className="space-y-8 rounded-[2.75rem] border border-white/10 bg-white/5 p-8 backdrop-blur-3xl sm:p-12"
        >
          <header className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-white/60">
              <Sparkles className="h-3.5 w-3.5" />
              Playbook arc
            </p>
            <h2 className="text-3xl font-semibold text-white">How the sprint unfolds</h2>
            <p className="max-w-3xl text-base text-white/75">
              We blend async collaboration with high-energy workshops so you can keep shipping product
              while the pod advances your fundraising assets.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {story.process.map((stage, index) => (
              <MotionDiv
                key={stage.step}
                custom={index * 0.06}
                variants={scalePop}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.3, once: true }}
                className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 text-white/80 backdrop-blur-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
                <div className="relative space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                    {stage.step}
                  </span>
                  <h3 className="text-xl font-semibold text-white">{stage.title}</h3>
                  <p className="text-sm leading-6 text-white/75">{stage.copy}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          custom={0.1}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3, once: true }}
          variants={fadeIn}
          className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/5 px-8 py-12 backdrop-blur-3xl sm:px-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-white">
                Ready to drop into the {base.title.toLowerCase()} pod?
              </h2>
              <p className="max-w-2xl text-base text-white/75">
                Every engagement starts with a discovery jam to map outcomes, bandwidth, and timelines.
                Give us five minutes of context and we will spin up the right operators.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/80 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#120826] transition hover:bg-white"
                asChild
              >
                <Link to={story.cta.to}>
                  {story.cta.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Link
                to={story.cta.supportTo}
                className="text-sm font-semibold uppercase tracking-[0.3em] text-white/65 transition hover:text-white"
              >
                {story.cta.support}
              </Link>
            </div>
          </div>
        </MotionSection>
      </div>
    </section>
  );
};

export default FounderServiceStory;
