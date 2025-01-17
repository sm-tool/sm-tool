import React from 'react';
import { AutoFormFieldProps } from '@autoform/react';
import { Label } from '../../label';
import { Checkbox } from '@/components/ui/shadcn/checkbox.tsx';
import { parseAutoFormDescription } from '@/components/ui/shadcn/auto-form/util/parse-auto-form-description.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import { HelpCircle } from 'lucide-react';

export const BooleanField: React.FC<AutoFormFieldProps> = ({
  field,
  label,
  id,
  inputProps,
  value,
}) => {
  const [localValue, setLocalValue] = React.useState(value || false);

  React.useEffect(() => {
    setLocalValue(value || false);
  }, [value]);
  const { label: parsedLabel, description } = parseAutoFormDescription(
    label as string,
  );

  return (
    <div className='flex items-center space-x-2'>
      <Checkbox
        id={id}
        onCheckedChange={checked => {
          setLocalValue(checked);
          const event = {
            target: {
              name: field.key,
              value: checked,
            },
          };
          inputProps.onChange(event);
        }}
        checked={localValue}
      />
      <Label htmlFor={id} className='text-default-600 text-md'>
        {parsedLabel}
        {field.required && <span className='text-destructive'> *</span>}
      </Label>
      {description && (
        <div className='@[500px]:hidden'>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <HelpCircle className='h-4 w-4 text-default-500 mb-1 cursor-help' />
            </TooltipTrigger>
            <TooltipContent className='w-64'>{description}</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
