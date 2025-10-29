import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const colors = ['bg-sunbeam', 'bg-blossom', 'bg-blossom', 'bg-sprout', 'bg-mint'];
const MotionCard = motion.div;

const PortfolioGrid = ({ items, condensed }) => (
  <div className={`grid gap-6 ${condensed ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
    {items.map((company, index) => (
      <MotionCard
        key={company.id}
        className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200 transition hover:shadow-lg hover:shadow-slate-200/60"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        whileHover={{ y: -12, scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      >
        <div className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${colors[index % colors.length]}`}>
          {company.sector}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-night">{company.name}</h3>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Founders: {company.founders.join(', ')}
        </p>
        <p className="mt-4 flex-1 text-sm text-slate-600">{company.summary}</p>
        <div className="mt-4 rounded-2xl bg-night-soft p-4 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wide text-sunbeam">Milestone</span>
          <p className="mt-2">{company.milestone}</p>
        </div>
        <a
          href={company.link}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sprout hover:text-mint"
        >
          Visit site
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 12h13.5m0 0-5.25-5.25M18.75 12l-5.25 5.25" />
          </svg>
        </a>
      </MotionCard>
    ))}
  </div>
);

PortfolioGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sector: PropTypes.string.isRequired,
      founders: PropTypes.arrayOf(PropTypes.string).isRequired,
      milestone: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
  condensed: PropTypes.bool,
};

PortfolioGrid.defaultProps = {
  condensed: false,
};

export default PortfolioGrid;
