import { useState } from 'react';
import PropTypes from 'prop-types';

const FAQAccordion = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const expanded = expandedIndex === index;
        return (
          <div
            key={item.question}
            className="rounded-2xl border border-white/60 bg-white/85 shadow-lg shadow-[#FFBC58]/20 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-2xl hover:shadow-[#FF9966]/35"
          >
            <button
              type="button"
              onClick={() => setExpandedIndex(expanded ? null : index)}
              className="flex w-full items-center justify-between px-4 py-4 text-left text-midnight hover:text-solstice sm:px-6"
            >
              <span className="text-sm font-semibold text-midnight">{item.question}</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-midnight/5 text-solstice">
                {expanded ? '-' : '+'}
              </span>
            </button>
            {expanded && (
              <div className="border-t border-white/60 px-4 py-4 text-sm text-midnight/70 sm:px-6">
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
