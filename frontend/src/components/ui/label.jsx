import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Label = forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('text-sm font-medium text-midnight', className)} {...props} />
));
Label.displayName = 'Label';

export { Label };
