import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-[120px] w-full rounded-xl border border-night/15 bg-white/75 px-4 py-3 text-sm text-night placeholder:text-night/40 shadow-inner shadow-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blossom focus-visible:ring-offset-2 focus-visible:ring-offset-white',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
