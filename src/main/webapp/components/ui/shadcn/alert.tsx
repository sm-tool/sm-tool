import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@nextui-org/theme';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute 4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-content2 border-content3 text-foreground',
        danger: `bg-danger/10 border-danger/30 text-danger 
                [&>svg]:text-danger`,
        warning: `bg-warning/10 border-warning/30 text-warning 
                 [&>svg]:text-warning`,
        success: `bg-success/10 border-success/30 text-success 
                 [&>svg]:text-success`,
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
    className={cn('text-sm [&_p]:leading-relaxed opacity-90', className)}
    {...properties}
  />
));
AlertDescription.displayName = 'AlertDescription';
export { Alert, AlertTitle, AlertDescription };
