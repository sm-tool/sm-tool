import { Button } from '@/components/ui/shadcn/button.tsx';
import { Input } from '@/components/ui/shadcn/input.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover.tsx';
import getBrightnessLevel from '@/utils/color/get-brightness-level.ts';
import { cn } from '@nextui-org/theme';
import { useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';

type ColorPickerProperties = {
  value?: string;
  onChange?: (color: string | undefined) => void;
};

const ColorPicker = ({ value, onChange }: ColorPickerProperties) => {
  const handleColorChange = (newColor: string) => {
    onChange?.(newColor || undefined);
  };

  const textColor = useMemo(() => {
    if (value === undefined || value === '') return '#000000';
    return getBrightnessLevel(value) < 0.5 ? '#FFFFFF' : '#000000';
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            `w-full h-10 px-3 flex items-center justify-between border-content3
            text-foreground bg-transparent`,
          )}
          style={{
            backgroundColor: value === '' ? 'transparent' : value,
            color: textColor,
            borderWidth: textColor === '#000000' ? '1px' : '0px',
          }}
        >
          <span className='truncate'>
            {value === '' ? 'Select a color' : value}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full bg-content2 flex-col space-y-4'>
        <HexColorPicker
          color={value}
          onChange={handleColorChange}
          className='mx-auto'
        />
        <Input
          placeholder='#000000'
          value={value || ''}
          onChange={event => handleColorChange(event.target.value)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
