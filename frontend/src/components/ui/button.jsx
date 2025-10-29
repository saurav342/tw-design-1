import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solstice focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-aurora via-solstice to-[#FF6F3C] text-midnight shadow-[0_18px_45px_-20px_rgba(255,146,90,0.65)] transition-transform hover:-translate-y-[1px] hover:shadow-[0_25px_60px_-20px_rgba(255,146,90,0.55)]',
        secondary:
          'border border-midnight/15 bg-white/70 text-midnight shadow-sm shadow-white/50 hover:bg-white',
        outline:
          'border border-midnight/15 bg-transparent text-midnight hover:bg-white/60 hover:text-midnight',
        ghost: 'text-midnight/70 hover:bg-white/60 hover:text-midnight',
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
