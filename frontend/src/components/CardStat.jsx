import { cn } from '../lib/utils.js';

const accentMap = {
  indigo: 'from-indigo-400 to-indigo-600',
  emerald: 'from-emerald-400 to-teal-500',
  fuchsia: 'from-fuchsia-400 to-purple-500',
};

export const CardStat = ({ label, value, accent = 'indigo' }) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-5 text-slate-100 shadow-[0_24px_80px_-48px_rgba(91,33,209,0.9)] backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-80" />
      <div className="relative flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.18em] text-slate-300">{label}</span>
        <span className="text-sm text-slate-200">{clamped}/100</span>
      </div>
      <div className="relative z-10 mt-3 text-3xl font-semibold text-white">{clamped}</div>
      <div className="relative z-10 mt-4 h-2 rounded-full bg-white/20">
        <div
          className={cn(
            'h-2 rounded-full bg-gradient-to-r shadow-[0_0_18px_rgba(255,255,255,0.35)] transition-all',
            accentMap[accent],
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
