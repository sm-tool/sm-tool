import { cn } from '@nextui-org/theme';
import * as React from 'react';

export type TextareaProperties =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProperties>(
  ({ className, ...properties }, reference) => {
    return (
      <textarea
        className={cn(
          `flex min-h-[60px] w-full rounded-md border border-content3 bg-content2 px-3 py-2
          text-sm text-foreground shadow-sm transition-colors duration-200
          ring-offset-content1 placeholder:text-content4 hover:border-content4
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-content4/30
          focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
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
