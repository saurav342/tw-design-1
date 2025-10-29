import { forwardRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/80 p-1 text-midnight/60 backdrop-blur',
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
      'inline-flex min-w-[120px] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-midnight/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solstice focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-aurora/80 data-[state=active]:via-solstice/80 data-[state=active]:to-[#FF7A45]/80 data-[state=active]:text-midnight data-[state=active]:shadow-[0_18px_45px_-25px_rgba(255,146,90,0.65)]',
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
      'rounded-2xl border border-white/60 bg-white/85 p-6 text-midnight shadow-lg shadow-white/40 backdrop-blur',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
