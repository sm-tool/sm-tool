import { Button } from '@/components/ui/shadcn/button.tsx';
import { Input } from '@/components/ui/shadcn/input.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover.tsx';
import { cn } from '@nextui-org/theme';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import getBrightnessLevel from '@/utils/color/get-brightness-level.ts';

const ColorPicker = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((properties, reference) => {
  const { value } = properties;
  const [colorValue, setColorValue] = useState(value?.toString() || '');

  useEffect(() => {
    setColorValue(value?.toString() || '');
  }, [value]);

  const textColor = useMemo(() => {
    if (!colorValue) return '#000000';
    return getBrightnessLevel(colorValue) < 0.5 ? '#FFFFFF' : '#000000';
  }, [colorValue]);

  const handleColorChange = (color: string) => {
    setColorValue(color);
    properties.onChange?.({
      target: {
        value: color,
        name: properties.name,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            `w-full h-10 px-3 flex items-center justify-between border-content3
            text-foreground bg-transparent`,
          )}
          style={{
            backgroundColor: colorValue || 'white',
            color: textColor,
            borderWidth: textColor === '#000000' ? '1px' : '0px',
          }}
        >
          <span className='truncate'>{colorValue || 'Select a color'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full bg-content2 flex-col space-y-4'>
        <HexColorPicker
          color={colorValue}
          onChange={handleColorChange}
          className='mx-auto'
        />
        <Input
          ref={reference}
          placeholder='#000000'
          value={colorValue}
          onChange={event => handleColorChange(event.target.value)}
          name={properties.name}
        />
      </PopoverContent>
    </Popover>
  );
});

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
