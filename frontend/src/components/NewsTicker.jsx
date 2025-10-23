import PropTypes from 'prop-types';

const NewsTicker = ({ items }) => (
  <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200">
    <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
      <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-burnt">
        In the news
      </span>
      <div className="flex-1 space-y-3 sm:space-y-0">
        {items.map((item) => (
          <div key={item.headline} className="sm:flex sm:items-center sm:justify-between sm:gap-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-lagoon">
              {item.outlet}
            </span>
            <p className="text-sm text-slate-600">{item.headline}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

NewsTicker.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      outlet: PropTypes.string.isRequired,
      headline: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default NewsTicker;
