import { cn } from '@nextui-org/theme';
import * as React from 'react';

export type InputProperties = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProperties>(
  ({ className, type, ...properties }, reference) => {
    return (
      <input
        type={type}
        className={cn(
          `focus-visible:ring-ring flex h-10 w-full rounded-2xl border bg-transparent px-3
          py-2 text-sm shadow-md shadow-foreground/[0.025] ring-offset-background
          file:border-0 file:bg-transparent file:text-sm file:font-medium
          placeholder:text-default-600 focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          className,
        )}
        ref={reference}
        {...properties}
      />
    );
  },
);
Input.displayName = 'Input';

const InputIconized = React.forwardRef<HTMLInputElement, InputProperties>(
  ({ children, className, type = 'text', ...properties }, reference) => {
    return (
      <div
        className={cn(
          `border-input focus-within:ring-ring flex h-10 items-center rounded-md border
          bg-background pl-3 text-sm text-foreground ring-offset-background
          focus-within:ring-1 focus-within:ring-offset-2`,
          className,
        )}
      >
        {children}
        <input
          type={type}
          className='flex-1 bg-transparent p-2 outline-none'
          ref={reference}
          {...properties}
        />
      </div>
    );
  },
);

InputIconized.displayName = 'InputIconized';

export { Input, InputIconized };
