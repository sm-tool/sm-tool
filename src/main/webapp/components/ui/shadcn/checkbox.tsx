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
      `focus-visible:ring-ring peer h-4 w-4 shrink-0 rounded-sm border border-primary
      shadow focus-visible:outline-none focus-visible:ring-1
      disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary
      data-[state=checked]:text-primary-foreground`,
      className,
    )}
    {...properties}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <CheckIcon className='h-4 w-4' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
