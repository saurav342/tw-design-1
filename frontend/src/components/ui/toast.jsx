import { forwardRef } from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-6 right-6 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-3',
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start space-x-3 overflow-hidden rounded-2xl border border-white/60 bg-white/85 p-4 text-midnight shadow-lg shadow-white/40 backdrop-blur transition-all',
  {
    variants: {
      variant: {
        default: 'border-white/60',
        success:
          'border-emerald-300/40 bg-emerald-200/40 text-emerald-900 shadow-emerald-300/20',
        destructive:
          'border-rose-300/50 bg-rose-200/50 text-rose-900 shadow-rose-300/25',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Toast = forwardRef(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
));
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex shrink-0 items-center rounded-lg border border-midnight/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-midnight transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-solstice focus:ring-offset-2 focus:ring-offset-white',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-3 top-3 rounded-full p-1 text-midnight/50 transition hover:bg-white/70 hover:text-midnight focus:outline-none focus:ring-2 focus:ring-solstice focus:ring-offset-2 focus:ring-offset-white',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold text-midnight', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm text-midnight/70', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
