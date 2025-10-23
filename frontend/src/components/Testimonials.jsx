import PropTypes from 'prop-types';

const Testimonials = ({ items }) => (
  <div className="grid gap-6 lg:grid-cols-3">
    {items.map((testimonial) => (
      <div key={testimonial.name} className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-md shadow-brand-muted/60">
        <span className="text-5xl text-lagoon">&ldquo;</span>
        <p className="mt-4 flex-1 text-sm text-slate-600">{testimonial.quote}</p>
        <div className="mt-6">
          <p className="text-sm font-semibold text-brand-dark">{testimonial.name}</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">{testimonial.role}</p>
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
