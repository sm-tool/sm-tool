'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@nextui-org/theme';

const labelVariants = cva(
  `leading-none 
  transition-colors
  duration-200
  peer-disabled:cursor-not-allowed 
  peer-disabled:opacity-50`,
  {
    variants: {
      variant: {
        foreground: 'text-foreground',
        entity: 'border-l-3 border-primary-500 pl-2',
        default: 'text-default-500',
        primary: 'text-primary',
        success: 'text-success-600',
        warning: 'text-warning-600',
        danger: 'text-danger-600',
        info: 'text-info-600',
        uppercased:
          'text-default-600 uppercase tracking-widest whitespace-nowrap',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-xl',
        xs: 'text-xs',
        '3xl': 'text-3xl',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      underline: {
        true: 'underline underline-offset-2',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
      weight: 'normal',
      underline: false,
    },
  },
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(
  (
    { className, variant, size, weight, underline, ...properties },
    reference,
  ) => (
    <LabelPrimitive.Root
      ref={reference}
      className={cn(
        labelVariants({ variant, size, weight, underline }),
        className,
      )}
      {...properties}
    />
  ),
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
