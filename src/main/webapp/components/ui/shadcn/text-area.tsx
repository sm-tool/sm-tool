import { cn } from '@nextui-org/theme';
import * as React from 'react';

export type TextareaProperties =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProperties>(
  ({ className, ...properties }, reference) => {
    return (
      <textarea
        className={cn(
          `border-input focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border
          bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-content4-foreground
          focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed
          disabled:opacity-50`,
          className,
        )}
        ref={reference}
        {...properties}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
