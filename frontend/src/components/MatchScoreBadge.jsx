import { Badge } from './ui/badge.jsx';

export const MatchScoreBadge = ({ score }) => {
  const display = Math.round(score);
  const variant = display >= 80 ? 'success' : display >= 65 ? 'default' : 'warning';

  return (
    <Badge
      variant={variant}
      className={
        variant === 'success'
          ? 'bg-gradient-to-r from-indigo-500/80 to-brand/80 text-white'
          : variant === 'default'
            ? 'bg-white/10 text-slate-100'
            : undefined
      }
    >
      {display}% Match
    </Badge>
  );
};
