import { cn } from '../lib/utils.js';

const accentMap = {
  indigo: 'from-indigo-400 to-indigo-600',
  emerald: 'from-emerald-400 to-teal-500',
  fuchsia: 'from-fuchsia-400 to-purple-500',
};

export const CardStat = ({ label, value, accent = 'indigo' }) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</span>
        <span className="text-sm text-slate-300">{clamped}/100</span>
      </div>
      <div className="mt-3 text-3xl font-semibold text-white">{clamped}</div>
      <div className="mt-4 h-2 rounded-full bg-white/10">
        <div
          className={cn('h-2 rounded-full bg-gradient-to-r transition-all', accentMap[accent])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
