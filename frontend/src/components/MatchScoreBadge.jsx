import { Badge } from './ui/badge.jsx';
import { cn } from '../lib/utils.js';

export const MatchScoreBadge = ({ score }) => {
  const display = Math.round(score);
  const variant = display >= 80 ? 'success' : display >= 65 ? 'default' : 'warning';

  return (
    <Badge
      variant={variant}
      className={cn(
        'font-semibold shadow-sm',
        variant === 'success'
          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-300'
          : variant === 'default'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-300'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300'
      )}
    >
      {display}% Match
    </Badge>
  );
};
