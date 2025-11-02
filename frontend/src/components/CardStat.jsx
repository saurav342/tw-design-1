import { cn } from '../lib/utils.js';

const accentMap = {
  indigo: 'from-royal to-[#6D28D9]',
  emerald: 'from-sprout to-[#0EA5E9]',
  fuchsia: 'from-blossom to-[#9333EA]',
};

export const CardStat = ({ label, value, accent = 'indigo' }) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-5 text-night shadow-[0_24px_70px_-48px_rgba(147,112,219,0.45)] backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white/70 to-white/30 opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.18em] text-night/50">{label}</span>
        <span className="text-sm text-night/60">{clamped}/100</span>
      </div>
      <div className="relative z-10 mt-3 text-3xl font-semibold text-night">{clamped}</div>
      <div className="relative z-10 mt-4 h-2 rounded-full bg-night/10">
        <div
          className={cn(
            'h-2 rounded-full bg-gradient-to-r shadow-[0_0_18px_rgba(91,33,209,0.25)] transition-all',
            accentMap[accent],
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
