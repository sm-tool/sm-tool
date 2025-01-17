import React from 'react';
import { FieldWrapperProps } from '@autoform/react';
import { Label } from '@/components/ui/shadcn/label.tsx';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert.tsx';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { parseAutoFormDescription } from '@/components/ui/shadcn/auto-form/util/parse-auto-form-description.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import Separator from '@/components/ui/shadcn/separator.tsx';

const DISABLED_LABELS = ['boolean', 'object', 'array'];

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  children,
  id,
  field,
  error,
}) => {
  const isDisabled = DISABLED_LABELS.includes(field.type);
  const parsedLabel = field.description
    ? parseAutoFormDescription(field.description)
    : { label, description: null };

  return (
    <div className='space-y-2 flex flex-row gap-8 justify-end'>
      {parsedLabel.description && (
        <div className='hidden @[700px]:block basis-[262px] shrink-0 grow-0'>
          <div className='text-sm font-medium text-default-600 uppercase sticky top-0'>
            {parsedLabel.label}
          </div>
          <Separator className='my-[3px]' />
          <p className='text-xs text-default-500'>{parsedLabel.description}</p>
        </div>
      )}
      <div className='flex flex-col w-[442px] shrink-0'>
        {!isDisabled && (
          <div>
            <div className='flex items-center gap-2'>
              <Label htmlFor={id} className='mb-[4px]'>
                {parsedLabel.label}
                {field.required && <span className='text-primary'> *</span>}
              </Label>
              {parsedLabel.description && (
                <div className='@[500px]:hidden'>
                  <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                      <HelpCircle className='h-4 w-4 text-default-500 mb-1 cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent className='w-64'>
                      {parsedLabel.description}
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        )}
        <div>{children}</div>
        {error && (
          <Alert variant='danger'>
            <AlertTriangle className='size-4 flex-shrink-0' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
