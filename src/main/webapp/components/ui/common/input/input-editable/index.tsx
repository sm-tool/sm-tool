import React from 'react';
import { Input, InputProperties } from '@/components/ui/shadcn/input.tsx';
import { cn } from '@nextui-org/theme';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Check, Pencil, X } from 'lucide-react';

const InputEditable = React.forwardRef<
  HTMLInputElement,
  InputProperties & {
    placeholderChildren: React.ReactNode;
    topTooltip?: React.ReactNode;
  }
>(
  (
    {
      className,
      value,
      onChange,
      placeholderChildren,
      topTooltip,
      ...properties
    },
    reference,
  ) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [temporaryValue, setTemporaryValue] = React.useState(
      (value as string) || '',
    );

    if (isEditing) {
      return (
        <div className='space-y-2 z-50 pt-6'>
          <div className='relative'>
            {topTooltip && (
              <div
                className='absolute -top-6 left-0 right-0 text-center text-sm text-default-500
                  animate-appear-from-bottom rounded-t-xl border-content3 border-1 border-b-0
                  translate-y-px pb-2'
              >
                {topTooltip}
              </div>
            )}
            <Input
              ref={reference}
              value={temporaryValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setTemporaryValue(event.target.value)
              }
              className={cn(topTooltip && 'rounded-t-none', className)}
              autoFocus
              {...properties}
            />
          </div>
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
                  } as React.ChangeEvent<HTMLInputElement>;
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
      <div className='group relative flex items-center w-fit'>
        <div
          onClick={() => setIsEditing(true)}
          className={cn(
            `rounded px-2 py-1 hover:bg-content3 cursor-text min-h-[2rem] flex items-center
            transition-colors duration-100 truncate`,
            className,
          )}
        >
          {value || placeholderChildren}
        </div>
        <Pencil
          className='h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 text-default-400 cursor-pointer
            transition-opacity duration-100'
          onClick={() => setIsEditing(true)}
        />
      </div>
    );
  },
);

InputEditable.displayName = 'InputEditable';

export default InputEditable;
