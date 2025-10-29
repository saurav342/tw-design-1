import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide shadow-sm backdrop-blur',
  {
    variants: {
      variant: {
        default: 'bg-white/10 text-slate-100',
        success:
          'border-transparent bg-gradient-to-r from-emerald-400/80 to-cyan-500/80 text-emerald-950',
        warning: 'border-amber-300/40 bg-amber-400/20 text-amber-200 backdrop-blur',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

const Badge = ({ className, variant, ...props }) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);

export { Badge };
