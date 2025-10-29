import PropTypes from 'prop-types';

const Testimonials = ({ items }) => (
  <div className="grid gap-6 lg:grid-cols-3">
    {items.map((testimonial) => (
      <div
        key={testimonial.name}
        className="flex h-full flex-col rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg shadow-[#FFBC58]/25 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#FF9966]/45"
      >
        <span className="text-5xl text-solstice">&ldquo;</span>
        <p className="mt-4 flex-1 text-sm text-midnight/75">{testimonial.quote}</p>
        <div className="mt-6">
          <p className="text-sm font-semibold text-midnight">{testimonial.name}</p>
          <p className="text-xs uppercase tracking-wide text-midnight/50">{testimonial.role}</p>
        </div>
      </div>
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
