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
            className="rounded-2xl border border-white/50 bg-white/90 shadow-[0_20px_60px_rgba(139,92,246,0.16)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_28px_80px_rgba(255,79,163,0.24)]"
          >
            <button
              type="button"
              onClick={() => setExpandedIndex(expanded ? null : index)}
              className="flex w-full items-center justify-between px-4 py-4 text-left text-[#1a1030] hover:text-[#ff4fa3] sm:px-6"
            >
              <span className="text-sm font-semibold">{item.question}</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fce3f3] text-[#ff4fa3]">
                {expanded ? '-' : '+'}
              </span>
            </button>
            {expanded && (
              <div className="border-t border-white/50 px-4 py-4 text-sm text-[#3b2a57] sm:px-6">
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
