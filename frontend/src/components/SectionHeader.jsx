import PropTypes from 'prop-types';

const SectionHeader = ({ eyebrow, title, description, align }) => (
  <div
    className={`mx-auto max-w-3xl ${align === 'left' ? 'text-left' : 'text-center'}`}
  >
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sprout">
        {eyebrow}
      </p>
    )}
    <h2 className="mt-3 text-3xl font-semibold text-night sm:text-4xl">
      {title}
    </h2>
    {description && <p className="mt-4 text-base text-slate-600">{description}</p>}
  </div>
);

SectionHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center']),
};

SectionHeader.defaultProps = {
  eyebrow: undefined,
  description: undefined,
  align: 'center',
};

export default SectionHeader;
