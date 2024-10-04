import { Slot } from '@radix-ui/react-slot';
import { cn } from '@nextui-org/theme';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
  'shadow-md shadow-foreground/[0.025] inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/80',
        primary: 'bg-primary-600 text-background hover:bg-primary-700',
        secondary: 'bg-secondary-600 text-background hover:bg-secondary-700',
        outline:
          'border bg-background hover:bg-default-200 hover:text-foreground',
        highlight:
          'bg-default-200 text-secondary-foreground hover:bg-default-200/80 !shadow-none',
        ghost: 'hover:bg-default-200 hover:text-foreground !shadow-none',
        link: 'text-foreground underline-offset-4 hover:underline !shadow-none',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-2xl px-3',
        lg: 'h-11 rounded-2xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProperties
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProperties>(
  ({ className, variant, size, asChild = false, ...properties }, reference) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={reference}
        {...properties}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
