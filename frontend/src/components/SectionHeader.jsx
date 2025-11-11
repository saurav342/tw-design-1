import PropTypes from 'prop-types';
import { highlightBrandName } from '../lib/brandHighlight';

const SectionHeader = ({ eyebrow, title, description, align }) => {
  // If title is a string, highlight brand name; otherwise use as-is
  const titleContent = typeof title === 'string' ? highlightBrandName(title) : title;
  // If description is a string, highlight brand name; otherwise use as-is
  const descriptionContent = typeof description === 'string' ? highlightBrandName(description) : description;
  
  return (
    <div
      className={`mx-auto max-w-3xl ${align === 'left' ? 'text-left' : 'text-center'}`}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sprout">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-semibold text-night sm:text-4xl">
        {titleContent}
      </h2>
      {description && <p className="mt-4 text-base text-slate-600">{descriptionContent}</p>}
    </div>
  );
};

SectionHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  align: PropTypes.oneOf(['left', 'center']),
};

SectionHeader.defaultProps = {
  eyebrow: undefined,
  description: undefined,
  align: 'center',
};

export default SectionHeader;
