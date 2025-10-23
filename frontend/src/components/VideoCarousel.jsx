import { useState } from 'react';
import PropTypes from 'prop-types';

const arrowButtonClasses =
  'inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur transition hover:bg-white/40';

const VideoCarousel = ({ items }) => {
  const [index, setIndex] = useState(0);
  const activeItem = items[index];

  const handleNext = () => setIndex((prev) => (prev + 1) % items.length);
  const handlePrevious = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="overflow-hidden rounded-3xl bg-brand-dark text-white shadow-2xl shadow-brand-dark/40">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative">
          <iframe
            className="h-full w-full min-h-[280px] rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
            src={`https://www.youtube.com/embed/${activeItem.youtubeId}`}
            title={activeItem.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div className="absolute bottom-4 left-4 flex gap-3">
            <button type="button" className={arrowButtonClasses} onClick={handlePrevious} aria-label="Previous video">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button type="button" className={arrowButtonClasses} onClick={handleNext} aria-label="Next video">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon">
              Multimedia Briefings
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-white">{activeItem.title}</h3>
            <p className="mt-3 text-sm text-slate-200">{activeItem.description}</p>
          </div>

          <div className="grid gap-3 text-xs uppercase tracking-wide text-slate-400">
            {items.map((item, itemIndex) => (
              <button
                type="button"
                key={item.youtubeId}
                onClick={() => setIndex(itemIndex)}
                className={`flex justify-between rounded-xl border border-white/10 px-4 py-3 transition ${
                  itemIndex === index ? 'bg-white/20 text-white' : 'hover:bg-white/10'
                }`}
              >
                <span>{item.title}</span>
                <span>{itemIndex + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

VideoCarousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      youtubeId: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default VideoCarousel;
