'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@nextui-org/theme';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...properties }, reference) => (
  <TabsPrimitive.List
    ref={reference}
    className={cn(
      `inline-flex h-10 items-center justify-center rounded-lg p-1 bg-content2
      shadow-sm transition-colors duration-200`,
      className,
    )}
    {...properties}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...properties }, reference) => (
  <TabsPrimitive.Trigger
    ref={reference}
    className={cn(
      `inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5
      text-sm font-medium text-content4 transition-all duration-200
      hover:text-foreground hover:bg-content3/40 ring-offset-content1
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-content4
      focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      data-[state=active]:bg-content1 data-[state=active]:text-foreground
      data-[state=active]:shadow-sm`,
      className,
    )}
    {...properties}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...properties }, reference) => (
  <TabsPrimitive.Content
    ref={reference}
    className={cn(
      `mt-2 ring-offset-content1 transition-all duration-200 focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-content4 focus-visible:ring-offset-2`,
      className,
    )}
    {...properties}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
