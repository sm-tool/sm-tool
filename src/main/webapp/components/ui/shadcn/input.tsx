import { cn } from '@nextui-org/theme';
import * as React from 'react';

export type InputProperties = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProperties>(
  ({ className, type, ...properties }, reference) => {
    return (
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-md border border-content3 bg-content2 text-foreground
          px-3 py-2 text-sm shadow-sm ring-offset-content1 file:border-0
          file:bg-transparent file:text-sm file:font-medium placeholder:text-content4
          focus-visible:outline-none focus-visible:border-content4 focus-visible:ring-2
          focus-visible:ring-content4/30 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200`,
          className,
        )}
        ref={reference}
        {...properties}
      />
    );
  },
);

Input.displayName = 'Input';

const InputIconized = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<'input'> & {
    children: React.ReactElement;
  }
>(({ className, children, ...properties }, reference) => {
  return (
    <div
      className={cn(
        `flex h-10 items-center rounded-md border border-content3 bg-content2 pl-3
        text-sm shadow-sm ring-offset-content1 transition-colors duration-200
        focus-within:border-content4 focus-within:ring-2 focus-within:ring-content4/30
        focus-within:ring-offset-2`,
        className,
      )}
    >
      {React.cloneElement(children, {
        className: cn(
          'w-4 h-4 text-default-400 transition-colors duration-200',
          'group-focus-within:text-foreground',
        ),
      })}
      <input
        className={cn(
          `flex-1 bg-transparent px-2 py-2 text-foreground placeholder:text-default-400
          outline-none transition-colors duration-200`,
        )}
        ref={reference}
        {...properties}
      />
    </div>
  );
});

InputIconized.displayName = 'InputIconized';

export { Input, InputIconized };
