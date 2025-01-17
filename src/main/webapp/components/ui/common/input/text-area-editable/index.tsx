import React from 'react';
import {
  Textarea,
  TextareaProperties,
} from '@/components/ui/shadcn/text-area.tsx';
import { cn } from '@nextui-org/theme';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Check, Pencil, X } from 'lucide-react';
import { Label } from '@/components/ui/shadcn/label.tsx';

const TextareaEditable = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProperties
>(({ className, value, onChange, placeholder, ...properties }, reference) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [temporaryValue, setTemporaryValue] = React.useState(value as string);

  if (isEditing) {
    return (
      <div className='space-y-2'>
        <Textarea
          ref={reference}
          value={temporaryValue}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setTemporaryValue(event.target.value)
          }
          className={cn(className)}
          autoFocus
          {...properties}
        />
        <div className='flex gap-2 justify-end animate-appear-from-top'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              setIsEditing(false);
              setTemporaryValue(value as string);
            }}
          >
            <X className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              if (onChange) {
                const event = {
                  target: { value: temporaryValue },
                } as React.ChangeEvent<HTMLTextAreaElement>;
                onChange(event);
              }
              setIsEditing(false);
            }}
          >
            <Check className='h-4 w-4' />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='group flex items-start w-fit'>
      <div
        onClick={() => setIsEditing(true)}
        className={cn(
          `rounded px-2 py-1 hover:bg-content3 cursor-text min-h-[2px] transition-colors
          duration-100 whitespace-pre-wrap`,
          className,
        )}
      >
        {value ? (
          <pre className='font-sans whitespace-pre-wrap break-words'>
            {value}
          </pre>
        ) : (
          <Label variant='uppercased' weight='bold' className='text-content4'>
            {placeholder}
          </Label>
        )}
      </div>
      <div className='flex-shrink-0 ml-2 mt-px'>
        <Pencil
          className='h-4 w-4 opacity-0 group-hover:opacity-100 text-default-600 cursor-pointer
            transition-opacity duration-100'
          onClick={() => setIsEditing(true)}
        />
      </div>
    </div>
  );
});

TextareaEditable.displayName = 'TextareaEditable';
export default TextareaEditable;
