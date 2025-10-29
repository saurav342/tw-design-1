import { forwardRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/80 p-1 text-night/60 backdrop-blur',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex min-w-[120px] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-night/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blossom focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-royal/85 data-[state=active]:via-blossom/80 data-[state=active]:to-sunbeam/80 data-[state=active]:text-white data-[state=active]:shadow-[0_20px_55px_-25px_rgba(91,33,209,0.55)]',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'rounded-2xl border border-white/60 bg-white/85 p-6 text-night shadow-lg shadow-white/40 backdrop-blur',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
