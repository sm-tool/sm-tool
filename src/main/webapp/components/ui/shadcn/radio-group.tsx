'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@nextui-org/theme';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...properties }, reference) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...properties}
      ref={reference}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...properties }, reference) => {
  return (
    <RadioGroupPrimitive.Item
      ref={reference}
      className={cn(
        `aspect-square h-4 w-4 rounded-full border border-content3 bg-content2
        text-foreground shadow-sm transition-all duration-200 hover:border-content4
        focus:outline-none focus-visible:ring-2 focus-visible:ring-content4
        focus-visible:ring-offset-2 focus-visible:ring-offset-content1
        disabled:cursor-not-allowed disabled:opacity-50
        data-[state=checked]:border-primary data-[state=checked]:bg-primary`,
        className,
      )}
      {...properties}
    >
      <RadioGroupPrimitive.Indicator
        className="flex items-center justify-center after:block after:h-2 after:w-2
          after:rounded-full after:bg-background after:content-['']"
      />
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
