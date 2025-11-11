import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
const MotionDiv = motion.div;
const MotionButton = motion.button;

const parseStatValue = (value) => {
  const match = value.match(/([\d.,]+)/);
  if (!match) {
    return {
      number: null,
      prefix: '',
      suffix: '',
      decimals: 0,
    };
  }

  const numericString = match[1];
  const decimals = numericString.includes('.') ? numericString.split('.')[1].length : 0;
  const number = Number(numericString.replace(/,/g, ''));

  return {
    number: Number.isNaN(number) ? null : number,
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + numericString.length),
    decimals,
  };
};

const AnimatedStat = ({ value, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-120px 0px' });
  const { number, prefix, suffix, decimals } = parseStatValue(value);
  const tracker = useMotionValue(0);
  const spring = useSpring(tracker, { stiffness: 110, damping: 20, mass: 0.6 });

  function formatDisplay(val) {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
    return `${prefix}${formatted}${suffix}`;
  }

  const [display, setDisplay] = useState(number === null ? value : formatDisplay(0));

  useEffect(() => {
    if (number === null) return undefined;

    const unsubscribe = spring.on('change', (latest) => {
      setDisplay(formatDisplay(latest));
    });

    return () => {
      unsubscribe?.();
    };
  }, [spring, number, decimals, prefix, suffix]);

  useEffect(() => {
    if (number === null) return;
    if (isInView) {
      tracker.set(number);
    }
  }, [isInView, number, tracker]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-xl font-semibold text-[#1a1030] sm:text-2xl">{number === null ? value : display}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-[#8b5cf6]">{label}</div>
    </motion.div>
  );
};

const HeroSection = () => {
  const heroRef = useRef(null);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(55);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 30, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 30, mass: 0.6 });

  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${smoothX}% ${smoothY}%, rgba(255, 79, 163, 0.35), transparent 68%)`;
  const gridOffsetX = useTransform(smoothX, (value) => (value - 50) * 0.4);
  const gridOffsetY = useTransform(smoothY, (value) => (value - 50) * 0.3);
  const cardTranslateX = useTransform(smoothX, (value) => (value - 50) * 0.6);
  const cardTranslateY = useTransform(smoothY, (value) => (value - 50) * 0.5);
  const cardRotateX = useTransform(smoothY, (value) => (value - 50) * -0.4);
  const cardRotateY = useTransform(smoothX, (value) => (value - 50) * 0.4);

  const handlePointerMove = (event) => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const relativeX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const relativeY = ((event.clientY - bounds.top) / bounds.height) * 100;
    const clampedX = Math.max(0, Math.min(100, relativeX));
    const clampedY = Math.max(0, Math.min(100, relativeY));
    pointerX.set(clampedX);
    pointerY.set(clampedY);
  };

  const resetPointer = () => {
    pointerX.stop();
    pointerY.stop();
    pointerX.set(50);
    pointerY.set(55);
  };

  useEffect(() => {
    resetPointer();
  }, []);

  const heroCopy = {
    tagline: 'Fundraising energy from HSR Layout, Bengaluru.',
    subheadline:
      'We pair Indian founders with capital, mentors, and vibrant operating pods so every round feels guided, confident, and fast.',
  };

  const barConfig = [
    { height: 80, delay: '0s' },
    { height: 140, delay: '0.2s' },
    { height: 200, delay: '0.4s' },
    { height: 260, delay: '0.6s' },
  ];

  const arrowConfig = [
    { left: '20%', delay: '0s', color: '#ff4fa3' },
    { left: '40%', delay: '1s', color: '#8b5cf6' },
    { left: '60%', delay: '2s', color: '#34d399' },
    { left: '80%', delay: '1.5s', color: '#8b5cf6' },
  ];

  const particleConfig = [
    { left: '15%', delay: '0.5s' },
    { left: '35%', delay: '1.5s' },
    { left: '55%', delay: '2.5s' },
    { left: '75%', delay: '3.5s' },
  ];

  return (
    <section
      ref={heroRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fff0fb] via-[#f5f0ff] to-[#f0fff6] text-[#1a1030]"
      style={{ fontFamily: 'var(--framer-blockquote-font-family, var(--framer-font-family, "Space Grotesk"))' }}
    >
      <MotionDiv
        aria-hidden="true"
        animate={{ rotate: [0, 6, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-44 -left-32 h-[32rem] w-[32rem] rounded-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-[#ff4fa3]/35 via-[#8b5cf6]/20 to-[#34d399]/30 blur-[140px]"
      />
      <MotionDiv
        aria-hidden="true"
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-52 right-[-6rem] h-[36rem] w-[36rem] rounded-full bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-[#34d399]/28 via-[#8b5cf6]/22 to-[#ff4fa3]/28 blur-[160px]"
      />
      <MotionDiv
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90 mix-blend-screen"
        style={{ backgroundImage: spotlight }}
      />
      <MotionDiv
        aria-hidden="true"
        style={{
          x: gridOffsetX,
          y: gridOffsetY,
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,0.35) 0, transparent 58%), linear-gradient(115deg, rgba(255,79,154,0.08) 0%, rgba(46,220,146,0.08) 100%)',
        }}
        className="pointer-events-none absolute inset-0 opacity-40 blur-[60px]"
      />

      <div className="relative z-10 mx-auto grid max-w-screen-xl items-center gap-16 px-4 pb-24 pt-36 text-center sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-32 lg:pt-44">
        <div className="mx-auto w-full max-w-3xl">
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <span
              className="block text-2xl font-semibold uppercase tracking-[0.32em] text-[#8b5cf6] sm:text-3xl"
              style={{ fontFamily: 'var(--hero-display-font)' }}
            >
              Welcome to
            </span>
            <h1
              className="text-[#8b5cf6]"
              style={{
                fontFamily: 'var(--hero-display-font)',
                fontSize: '4.0rem',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              Launch & Lift
            </h1>
          </motion.div>

          <motion.p
            className="mt-8 text-3xl font-medium text-[#1a1030] sm:text-4xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {heroCopy.tagline}
          </motion.p>

          <motion.p
            className="mt-6 mx-auto max-w-2xl text-xl leading-relaxed text-[#3b2a57] sm:text-2xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            {heroCopy.subheadline}
          </motion.p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MotionButton
              type="button"
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex min-w-[170px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff4fa3] to-[#8b5cf6] px-7 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-[0_18px_55px_rgba(255,79,163,0.35)] transition-transform duration-200 hover:-translate-y-1 sm:text-base"
            >
              FOR FOUNDERS
            </MotionButton>
            <MotionButton
              type="button"
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex min-w-[170px] items-center justify-center rounded-2xl border border-transparent bg-[#34d399] px-7 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#034732] shadow-lg shadow-[0_18px_55px_rgba(52,211,153,0.3)] transition-transform duration-200 hover:-translate-y-1 hover:brightness-110 sm:text-base"
            >
              FOR INVESTORS
            </MotionButton>
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          <MotionDiv
            aria-hidden="true"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              x: cardTranslateX,
              y: cardTranslateY,
              rotateX: cardRotateX,
              rotateY: cardRotateY,
            }}
            className="launch-hero-visual-wrapper"
          >
            <div className="launch-hero-visual">
              <div className="launch-hero-growth-line">
                <svg viewBox="0 0 400 300" preserveAspectRatio="none">
                  <path className="launch-hero-growth-path" d="M 0,280 Q 100,200 200,100 T 400,20" />
                </svg>
              </div>

              <div className="launch-hero-bar-chart">
                {barConfig.map((bar, index) => (
                  <div
                    key={`bar-${index}`}
                    className="launch-hero-bar"
                    style={{ height: `${bar.height}px`, animationDelay: bar.delay }}
                  />
                ))}
              </div>

              <div className="launch-hero-rocket-trail" />

              <div className="launch-hero-rocket">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 10 L60 70 L50 65 L40 70 Z" fill="#8b5cf6" />
                  <ellipse cx="50" cy="25" rx="8" ry="12" fill="#a855f7" />
                  <circle cx="50" cy="30" r="5" fill="#fda4d4" opacity="0.85" />
                  <path d="M40 60 L30 85 L40 75 Z" fill="#ff4fa3" />
                  <path d="M60 60 L70 85 L60 75 Z" fill="#ff4fa3" />
                  <path d="M45 70 L50 85 L55 70 L50 78 Z" fill="#34d399">
                    <animate attributeName="opacity" values="1;0.6;1" dur="0.3s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>

              <div className="launch-hero-arrow-layer">
                {arrowConfig.map((arrow, index) => (
                  <div
                    key={`arrow-${index}`}
                    className="launch-hero-arrow"
                    style={{ left: arrow.left, animationDelay: arrow.delay }}
                  >
                    <svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 5 L25 20 L20 20 L20 35 L10 35 L10 20 L5 20 Z" fill={arrow.color} opacity="0.6" />
                    </svg>
                  </div>
                ))}
              </div>

              {particleConfig.map((particle, index) => (
                <div
                  key={`particle-${index}`}
                  className="launch-hero-particle"
                  style={{ left: particle.left, animationDelay: particle.delay }}
                />
              ))}
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
