'use client';

import { cn } from '@nextui-org/theme';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...properties }, reference) => (
  <AccordionPrimitive.Item
    ref={reference}
    className={cn('border-b border-content3', className)}
    {...properties}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...properties }, reference) => (
  <AccordionPrimitive.Header className='flex'>
    <AccordionPrimitive.Trigger
      ref={reference}
      className={cn(
        `flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all
        text-foreground hover:text-content4 hover:bg-content2/50 rounded-sm
        [&[data-state=open]>svg]:rotate-180`,
        className,
      )}
      {...properties}
    >
      {children}
      <ChevronDown className='h-4 w-4 shrink-0 text-content4 transition-transform duration-200' />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...properties }, reference) => (
  <AccordionPrimitive.Content
    ref={reference}
    className={cn(
      `data-[state=closed]:animate-accordion-up
      data-[state=open]:animate-accordion-down overflow-hidden text-sm text-content4
      bg-content2/25 rounded-sm`,
      className,
    )}
    {...properties}
  >
    <div className={cn('pb-4 pt-0 px-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
