import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@nextui-org/theme';

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...properties },
    reference,
  ) => (
    <SeparatorPrimitive.Root
      ref={reference}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-content4 shrink-0',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...properties}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export default Separator;
