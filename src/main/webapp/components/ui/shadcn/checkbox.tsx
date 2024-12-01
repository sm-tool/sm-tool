'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { cn } from '@nextui-org/theme';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...properties }, reference) => (
  <CheckboxPrimitive.Root
    ref={reference}
    className={cn(
      `peer h-4 w-4 shrink-0 rounded-sm border border-content3 bg-content2 shadow-sm
      transition-colors duration-200 hover:border-content4 focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-content4 focus-visible:ring-offset-2
      focus-visible:ring-offset-content1 disabled:cursor-not-allowed
      disabled:opacity-50 data-[state=checked]:bg-secondary
      data-[state=checked]:border-secondary data-[state=checked]:text-background`,
      className,
    )}
    {...properties}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <CheckIcon className='h-3.5 w-3.5' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
