import * as Toggle from '@radix-ui/react-toggle';
import React from 'react';
import { cn } from '@nextui-org/theme';

const ToggleButton = React.forwardRef<
  React.ElementRef<typeof Toggle.Root>,
  React.ComponentPropsWithoutRef<typeof Toggle.Root>
>(({ className, ...properties }, reference) => (
  <Toggle.Root
    ref={reference}
    className={cn(
      'inline-flex items-center justify-center rounded-md px-3 py-2',
      'transition-colors duration-200 border-1 border-default-500',
      `data-[state=on]:bg-danger/20 data-[state=on]:text-danger
      data-[state=on]:border-danger`,
      'data-[state=off]:bg-transparent data-[state=off]:text-default-500',
      'hover:data-[state=on]:bg-danger/10',
      `hover:data-[state=off]:bg-danger/10 hover:data-[state=off]:border-danger/20
      hover:data-[state=off]:text-danger/60`,
      className,
    )}
    {...properties}
  />
));

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
