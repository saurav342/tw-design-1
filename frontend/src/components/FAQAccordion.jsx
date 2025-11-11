import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { highlightBrandName } from '../lib/brandHighlight';

const FAQAccordion = ({ items, initialVisibleCount = 6 }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(items[0]?.question || null);
  const [showAll, setShowAll] = useState(false);

  const toggleAccordion = (question) => {
    setExpandedQuestion(expandedQuestion === question ? null : question);
  };

  const visibleItems = showAll ? items : items.slice(0, initialVisibleCount);
  const hasMore = items.length > initialVisibleCount;

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {visibleItems.map((item, index) => {
          const expanded = expandedQuestion === item.question;
          return (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              transition={{ 
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-[0_20px_60px_rgba(139,92,246,0.16)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_28px_80px_rgba(255,79,163,0.24)]"
            >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff4fa3]/0 via-[#8b5cf6]/0 to-[#34d399]/0 group-hover:from-[#ff4fa3]/5 group-hover:via-[#8b5cf6]/5 group-hover:to-[#34d399]/5 transition-all duration-300 pointer-events-none" />
            
            <button
              type="button"
              onClick={() => toggleAccordion(item.question)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleAccordion(item.question);
                }
              }}
              aria-expanded={expanded}
              aria-controls={`faq-answer-${index}`}
              className="relative z-10 flex w-full items-center justify-between px-5 py-5 text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff4fa3]/50 focus:ring-offset-2 rounded-2xl sm:px-6 sm:py-6"
            >
              <span
                id={`faq-question-${index}`}
                className={`flex-1 pr-4 text-base font-semibold leading-relaxed transition-colors duration-200 ${
                  expanded
                    ? 'text-[#ff4fa3]'
                    : 'text-[#1a1030] group-hover:text-[#8b5cf6]'
                } sm:text-lg`}
              >
                {highlightBrandName(item.question)}
              </span>
              <motion.span
                animate={{
                  rotate: expanded ? 45 : 0,
                  backgroundColor: expanded ? '#ff4fa3' : '#fce3f3',
                  color: expanded ? 'white' : '#ff4fa3',
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-all duration-300 group-hover:scale-110 sm:h-11 sm:w-11"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </motion.span>
            </button>
            
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.3, ease: 'easeInOut' },
                    opacity: { duration: 0.2, ease: 'easeInOut' },
                  }}
                  className="overflow-hidden"
                >
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className="border-t border-white/50 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5"
                  >
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                      className="text-sm leading-relaxed text-[#3b2a57] sm:text-base sm:leading-relaxed"
                    >
                      {highlightBrandName(item.answer)}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-4"
        >
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-[#8b5cf6]/30 bg-white/80 px-6 py-3 text-sm font-semibold text-[#8b5cf6] transition-all duration-300 hover:border-[#ff4fa3]/50 hover:bg-gradient-to-r hover:from-[#ff4fa3]/10 hover:via-[#8b5cf6]/10 hover:to-[#34d399]/10 hover:shadow-lg hover:shadow-[#8b5cf6]/20 focus:outline-none focus:ring-2 focus:ring-[#ff4fa3]/50 focus:ring-offset-2"
          >
            <span>{showAll ? 'Show Less' : `Show ${items.length - initialVisibleCount} More Questions`}</span>
            <motion.svg
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
        </motion.div>
      )}
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
  initialVisibleCount: PropTypes.number,
};

export default FAQAccordion;
