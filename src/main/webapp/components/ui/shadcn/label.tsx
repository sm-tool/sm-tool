'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@nextui-org/theme';

const labelVariants = cva(
  `text-sm 
   font-medium 
   leading-none 
   text-foreground
   transition-colors
   duration-200
   peer-disabled:cursor-not-allowed 
   peer-disabled:opacity-50`,
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...properties }, reference) => (
  <LabelPrimitive.Root
    ref={reference}
    className={cn(labelVariants(), className)}
    {...properties}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
