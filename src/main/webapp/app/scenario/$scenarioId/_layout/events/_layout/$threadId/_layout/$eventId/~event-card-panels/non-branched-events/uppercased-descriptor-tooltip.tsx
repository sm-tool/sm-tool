import PopoverDelayed from '@/components/ui/common/display/popover-delayed';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover.tsx';
import { Label } from '@/components/ui/shadcn/label.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { X } from 'lucide-react';
import React from 'react';

const UppercasedDescriptorTooltip = ({
  labelText,
  children,
}: {
  labelText: string;
  children: React.ReactNode;
}) => (
  <PopoverDelayed>
    {({ isHovered, setIsHovered, hoverHandlers }) => (
      <Popover open={isHovered} onOpenChange={setIsHovered}>
        <PopoverTrigger asChild {...hoverHandlers} className='mb-2'>
          <Label
            variant='uppercased'
            weight='bold'
            className='text-[64px] text-content3 absolute -bottom-1 hover:text-default-500
              data-[state=open]:text-default-500 hover:cursor-help group'
          >
            {labelText}
            <span
              className='absolute top-3 -right-3 text-sm text-content3 group-hover:text-default-500
                group-data-[state=open]:text-default-500'
            >
              ?
            </span>
          </Label>
        </PopoverTrigger>
        <PopoverContent
          className='w-[350px] relative p-5 mb-24'
          side='right'
          align='center'
          sideOffset={-(labelText.length * 64 * 0.5)}
        >
          <Button
            variant='ghost'
            onClick={() => setIsHovered(false)}
            className='absolute right-2 top-2'
          >
            <X className='h-4 w-4' />
          </Button>
          {children}
        </PopoverContent>
      </Popover>
    )}
  </PopoverDelayed>
);

export default UppercasedDescriptorTooltip;
