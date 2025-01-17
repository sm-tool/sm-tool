/* eslint-disable -- I DONT UNDERSTAND THIS LIBRARY AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA */
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import * as React from 'react';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { cn } from '@nextui-org/theme';
import { Calendar } from '@/components/ui/shadcn/calendar.tsx';
import {
  OTPGroup,
  OTPInput,
  OTPSeparator,
  OTPSlot,
} from '@/components/ui/common/input/otp/otp.tsx';
import { AutoFormFieldProps } from '@autoform/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover.tsx';

export const DateTimePicker = ({
  field,
  id,
  inputProps,
  value,
  disabled,
}: AutoFormFieldProps & { disabled: boolean }) => {
  const [localValue, setLocalValue] = React.useState(() =>
    value ? new Date(value as string) : undefined,
  );

  React.useEffect(() => {
    setLocalValue(value ? new Date(value as string) : undefined);
  }, [value]);

  const [open, setOpen] = React.useState(false);

  const formattedTime = React.useMemo(() => {
    if (!localValue) return '000000';
    return (
      localValue.getHours().toString().padStart(2, '0') +
      localValue.getMinutes().toString().padStart(2, '0') +
      localValue.getSeconds().toString().padStart(2, '0')
    );
  }, [localValue]);

  const handleTimeChange = (timeString: string) => {
    if (!localValue) return;
    const newDateTime = new Date(localValue);
    newDateTime.setHours(Number.parseInt(timeString.slice(0, 2), 10));
    newDateTime.setMinutes(Number.parseInt(timeString.slice(2, 4), 10));
    newDateTime.setSeconds(Number.parseInt(timeString.slice(4, 6), 10));
    setLocalValue(newDateTime);

    inputProps.onChange({
      target: {
        name: field.key,
        value: newDateTime.toISOString(),
      },
    });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    const newDateTime = new Date(newDate);
    if (localValue) {
      newDateTime.setHours(localValue.getHours());
      newDateTime.setMinutes(localValue.getMinutes());
      newDateTime.setSeconds(localValue.getSeconds());
    }
    setLocalValue(newDateTime);

    inputProps.onChange({
      target: {
        name: field.key,
        value: newDateTime.toISOString(),
      },
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          disabled={disabled}
          variant='outline'
          className={cn('w-full justify-start text-left font-normal')}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {localValue ? (
            format(localValue, 'PPp')
          ) : (
            <span>Pick date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='p-4 space-y-4'>
          <Calendar
            defaultMonth={localValue}
            mode='single'
            selected={localValue}
            onSelect={handleDateChange}
          />
          <div className='border-t pt-4'>
            <div className='flex items-center justify-center'>
              <Clock className='h-4 w-4 mr-2' />
              <OTPInput value={formattedTime} onChange={handleTimeChange}>
                <OTPGroup>
                  <OTPSlot index={0} />
                  <OTPSlot index={1} />
                </OTPGroup>
                <OTPSeparator>:</OTPSeparator>
                <OTPGroup>
                  <OTPSlot index={2} />
                  <OTPSlot index={3} />
                </OTPGroup>
                <OTPSeparator>:</OTPSeparator>
                <OTPGroup>
                  <OTPSlot index={4} />
                  <OTPSlot index={5} />
                </OTPGroup>
              </OTPInput>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
