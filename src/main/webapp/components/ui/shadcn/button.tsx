import { Slot } from '@radix-ui/react-slot';
import { cn } from '@nextui-org/theme';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
  `inline-flex items-center justify-center
   whitespace-nowrap rounded-md text-sm 
   font-medium ring-offset-background 
   transition-colors duration-200
   focus-visible:outline-none 
   focus-visible:ring-2 
   focus-visible:ring-content4
   focus-visible:ring-offset-2 
   disabled:pointer-events-none 
   disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/90',
        primary: 'bg-primary text-background hover:bg-primary/90',
        secondary: 'bg-secondary text-foreground hover:bg-secondary/90',
        outline: `border border-content3 
                 bg-background 
                 text-foreground 
                 hover:bg-content2`,
        ghost: `text-foreground 
               hover:bg-content2`,
        destructive: 'bg-danger text-background hover:bg-danger/90',
        success: 'bg-success text-background hover:bg-success/90',
        link: 'text-foreground underline-offset-4 hover:underline !shadow-none',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
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
