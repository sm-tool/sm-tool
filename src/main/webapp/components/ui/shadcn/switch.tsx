'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@nextui-org/theme';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...properties }, reference) => (
  <SwitchPrimitives.Root
    className={cn(
      `peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full
      border-2 border-transparent shadow-sm transition-colors duration-200
      outline-none ring-offset-content1 disabled:cursor-not-allowed
      disabled:opacity-50 data-[state=checked]:bg-secondary
      data-[state=unchecked]:bg-content3 hover:data-[state=unchecked]:bg-content4
      focus-visible:ring-2 focus-visible:ring-content4 focus-visible:ring-offset-2`,
      className,
    )}
    {...properties}
    ref={reference}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        `pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm ring-0
        transition-transform duration-200 data-[state=checked]:translate-x-4
        data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-background
        data-[state=unchecked]:bg-background`,
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
