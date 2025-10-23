import { useState } from 'react';
import PropTypes from 'prop-types';

const FAQAccordion = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const expanded = expandedIndex === index;
        return (
          <div key={item.question} className="rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200">
            <button
              type="button"
              onClick={() => setExpandedIndex(expanded ? null : index)}
              className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-6"
            >
              <span className="text-sm font-semibold text-brand-dark">{item.question}</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-muted text-lagoon">
                {expanded ? '-' : '+'}
              </span>
            </button>
            {expanded && (
              <div className="border-t border-slate-100 px-4 py-4 text-sm text-slate-600 sm:px-6">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

FAQAccordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default FAQAccordion;
