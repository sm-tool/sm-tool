import React, { ComponentPropsWithoutRef } from 'react';
import { cn } from '@nextui-org/theme';

const EmptyComponentDashed = React.forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'> & { text: React.ReactNode }
>(({ text, className, ...properties }, reference) => (
  <div
    ref={reference}
    className={cn(
      `flex items-center justify-center p-4 bg-content2 rounded-md border-2
      border-dashed border-divider`,
      className,
    )}
    {...properties}
  >
    <div className='text-default-600'>{text}</div>
  </div>
));

EmptyComponentDashed.displayName = 'EmptyComponentDashed';
export default EmptyComponentDashed;
