import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-11 w-full rounded-xl border border-midnight/15 bg-white/75 px-4 text-sm text-midnight placeholder:text-midnight/40 shadow-inner shadow-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solstice focus-visible:ring-offset-2 focus-visible:ring-offset-white',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
