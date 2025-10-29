import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const MotionCard = motion.div;

const Testimonials = ({ items }) => (
  <div className="grid gap-6 lg:grid-cols-3">
    {items.map((testimonial) => (
      <MotionCard
        key={testimonial.name}
        className="flex h-full flex-col rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg shadow-[0_22px_58px_rgba(247,201,72,0.24)] backdrop-blur-sm transition-transform duration-300 hover:shadow-2xl hover:shadow-[0_32px_80px_rgba(255,79,154,0.3)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{ y: -12, scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <span className="text-5xl text-blossom">&ldquo;</span>
        <p className="mt-4 flex-1 text-sm text-night/75">{testimonial.quote}</p>
        <div className="mt-6">
          <p className="text-sm font-semibold text-night">{testimonial.name}</p>
          <p className="text-xs uppercase tracking-wide text-night/50">{testimonial.role}</p>
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
