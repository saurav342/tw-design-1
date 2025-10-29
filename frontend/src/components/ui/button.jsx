import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blossom focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-royal via-blossom to-sunbeam text-white shadow-[0_22px_60px_-20px_rgba(91,33,209,0.6)] transition-transform hover:-translate-y-[1px] hover:shadow-[0_28px_70px_-18px_rgba(255,79,154,0.5)]',
        secondary:
          'border border-night/15 bg-white/70 text-night shadow-sm shadow-white/50 hover:bg-white',
        outline:
          'border border-night/15 bg-transparent text-night hover:bg-white/60 hover:text-night',
        ghost: 'text-night/70 hover:bg-white/60 hover:text-night',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button };
