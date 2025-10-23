import PropTypes from 'prop-types';

const StatsPanel = ({ items }) => (
  <div className="grid gap-4 rounded-3xl bg-brand-muted p-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
    {items.map((item) => (
      <div key={item.label} className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {item.label}
        </p>
        <p className="mt-3 text-3xl font-semibold text-burnt">{item.value}</p>
        <p className="mt-2 text-sm text-slate-600">{item.caption}</p>
      </div>
    ))}
  </div>
);

StatsPanel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default StatsPanel;
