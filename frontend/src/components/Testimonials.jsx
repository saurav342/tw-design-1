import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const MotionCard = motion.div;

const Testimonials = ({ items }) => (
  <div className="grid gap-6 lg:grid-cols-3">
    {items.map((testimonial) => (
      <MotionCard
        key={testimonial.name}
        className="flex h-full flex-col rounded-3xl border border-white/50 bg-white/90 p-6 text-[#1a1030] shadow-[0_22px_60px_rgba(139,92,246,0.18)] backdrop-blur transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_32px_90px_rgba(255,79,163,0.28)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{ y: -12, scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <span className="text-5xl text-[#ff4fa3]">&ldquo;</span>
        <p className="mt-4 flex-1 text-sm text-[#3b2a57]">{testimonial.quote}</p>
        <div className="mt-6">
          <p className="text-sm font-semibold text-[#1a1030]">{testimonial.name}</p>
          <p className="text-xs uppercase tracking-wide text-[#8b5cf6]">{testimonial.role}</p>
        </div>
      </MotionCard>
    ))}
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
