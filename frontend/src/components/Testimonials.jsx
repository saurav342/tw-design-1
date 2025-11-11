import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { highlightBrandName } from '../lib/brandHighlight';

const MotionCard = motion.div;

const gradientConfigs = [
  {
    quoteGradient: 'from-[#ff4fa3] to-[#ff6bb3]',
    accentGradient: 'from-[#ff4fa3]/20 to-[#ff6bb3]/10',
    borderGradient: 'from-[#ff4fa3]/30 to-[#ff6bb3]/20',
  },
  {
    quoteGradient: 'from-[#8b5cf6] to-[#a78bfa]',
    accentGradient: 'from-[#8b5cf6]/20 to-[#a78bfa]/10',
    borderGradient: 'from-[#8b5cf6]/30 to-[#a78bfa]/20',
  },
  {
    quoteGradient: 'from-[#34d399] to-[#6ee7b7]',
    accentGradient: 'from-[#34d399]/20 to-[#6ee7b7]/10',
    borderGradient: 'from-[#34d399]/30 to-[#6ee7b7]/20',
  },
];

const Testimonials = ({ items }) => (
  <div className="relative">
    {/* Background decorative elements */}
    <div className="pointer-events-none absolute -inset-4 overflow-hidden lg:-inset-8">
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#ff4fa3]/10 to-transparent blur-3xl" />
      <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-transparent blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#34d399]/8 to-transparent blur-3xl" />
    </div>

    <div className="relative grid gap-6 lg:gap-8 lg:grid-cols-3">
      {items.map((testimonial, index) => {
        const gradients = gradientConfigs[index % gradientConfigs.length];
        return (
          <MotionCard
            key={testimonial.name}
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/98 p-8 text-[#1a1030] shadow-[0_8px_32px_rgba(139,92,246,0.08)] backdrop-blur-sm transition-all duration-500 hover:border-white hover:shadow-[0_24px_72px_rgba(139,92,246,0.2)]"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              layout: { duration: 0.3 }
            }}
          >
            {/* Animated gradient border on hover */}
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradients.borderGradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100 -z-0`}
            />

            {/* Decorative gradient orbs */}
            <div
              className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${gradients.accentGradient} blur-3xl opacity-40 transition-all duration-700 group-hover:opacity-60 group-hover:scale-110`}
            />
            <div
              className={`absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradients.accentGradient} blur-2xl opacity-30 transition-all duration-700 group-hover:opacity-50`}
            />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col">
              {/* Large stylized quotation mark with enhanced styling */}
              <div className="relative mb-6 -ml-2">
                <div className="relative inline-block">
                  <span
                    className={`block text-8xl font-serif leading-none bg-gradient-to-br ${gradients.quoteGradient} bg-clip-text text-transparent drop-shadow-sm`}
                    style={{ fontFamily: 'Georgia, serif', lineHeight: '0.8' }}
                  >
                    &ldquo;
                  </span>
                  {/* Glow effect behind quote */}
                  <div
                    className={`absolute left-0 top-0 h-16 w-16 rounded-full bg-gradient-to-br ${gradients.accentGradient} blur-2xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity duration-500`}
                  />
                </div>
              </div>

              {/* Quote text with better typography */}
              <p className="mb-8 flex-1 text-[15px] leading-[1.75] text-[#3b2a57] lg:text-base font-medium">
                {highlightBrandName(testimonial.quote)}
              </p>

              {/* Author info with enhanced design */}
              <div className="relative pt-6 mt-auto">
                {/* Gradient divider line */}
                <div className="absolute left-0 top-0 h-[2px] w-20 bg-gradient-to-r from-transparent via-current to-transparent">
                  <div
                    className={`h-full w-full bg-gradient-to-r ${gradients.quoteGradient} opacity-60`}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <p className="text-base font-bold text-[#1a1030] group-hover:text-[#1a1030] transition-colors">
                    {testimonial.name}
                  </p>
                  <p className={`text-xs font-semibold uppercase tracking-[0.12em] bg-gradient-to-r ${gradients.quoteGradient} bg-clip-text text-transparent`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Corner accent */}
            <div
              className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${gradients.quoteGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-bl-full`}
            />
          </MotionCard>
        );
      })}
    </div>
  </div>
);

Testimonials.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      quote: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Testimonials;
