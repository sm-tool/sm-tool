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
      `bg-muted text-muted-foreground inline-flex h-9 items-center justify-center
      rounded-lg p-1`,
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
      `focus-visible:ring-ring inline-flex items-center justify-center
      whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium
      ring-offset-background transition-all focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none
      disabled:opacity-50 data-[state=active]:bg-background
      data-[state=active]:text-foreground data-[state=active]:shadow`,
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
      `focus-visible:ring-ring mt-2 ring-offset-background focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-offset-2`,
      className,
    )}
    {...properties}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };