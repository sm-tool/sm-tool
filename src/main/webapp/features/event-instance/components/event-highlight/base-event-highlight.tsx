import { EventInstance } from '@/features/event-instance/types.ts';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover.tsx';
import ChangesBadge from '@/features/event-instance/components/changes-badge';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';

interface BaseEventHighlightProperties {
  event: EventInstance;
  icon: React.ReactNode;
  label?: string;
  contentComponent?: React.ReactNode;
  style?: React.CSSProperties;
}

const BaseEventHighlight = ({
  event,
  icon,
  label,
  contentComponent,
  style,
}: BaseEventHighlightProperties) => {
  return (
    <Popover>
      <PopoverTrigger asChild style={style}>
        <div
          className='top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center
            pointer-events-auto'
        >
          <div className='absolute -left-5'>
            <ChangesBadge
              count={event.attributeChanges.length}
              type='attribute'
            />
          </div>
          {icon}
          <div className='absolute -right-5'>
            <ChangesBadge
              count={event.associationChanges.length}
              type='association'
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className='p-2 px-4 pb-7 flex flex-col gap-y-2'
        onOpenAutoFocus={event => event.preventDefault()}
      >
        {contentComponent || (
          <>
            <div className='border-b pb-2'>
              <span className='text-2xl font-semibold line-clamp-2'>
                {event.title}
              </span>
            </div>
            <ScrollArea className='max-h-[15rem] flex flex-col'>
              <p className='w-full pr-4 break-words'>{event.description}</p>
              <ScrollBar />
            </ScrollArea>
          </>
        )}
        <div className='absolute bottom-1 left-2 flex justify-between w-full'>
          <div className='flex flex-row gap-2'>
            <ChangesBadge
              count={event.attributeChanges.length}
              type='attribute'
            />
            <ChangesBadge
              count={event.associationChanges.length}
              type='association'
            />
          </div>
        </div>
        <span
          className='absolute text-default-400 uppercase font-bold tracking-widest text-xs right-1
            bottom-1'
        >
          {label}
        </span>
      </PopoverContent>
    </Popover>
  );
};

export default BaseEventHighlight;
