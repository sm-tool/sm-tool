import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@nextui-org/theme';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        danger:
          'border-danger/50 text-danger dark:border-danger [&>svg]:text-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...properties }, reference) => (
  <div
    ref={reference}
    role='alert'
    className={cn(alertVariants({ variant }), className)}
    {...properties}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...properties }, reference) => (
  <h5
    ref={reference}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...properties}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...properties }, reference) => (
  <div
    ref={reference}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...properties}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };