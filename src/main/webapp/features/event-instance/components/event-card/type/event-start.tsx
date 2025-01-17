import { Node, NodeProps } from '@xyflow/react';
import { PlusCircle } from 'lucide-react';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import BaseEventCard from '@/features/event-instance/components/event-card/type/event-default.tsx';
import { cn } from '@nextui-org/theme';
import React from 'react';

const EventStartCard = ({
  ...properties
}: NodeProps<Node<EventCardProperties>>) => {
  return (
    <BaseEventCard {...properties}>
      <div className='absolute bg-content1 inset-0'>
        <div
          className={cn(
            'absolute left-4 inset-y-1/4 size-24 rounded-full bg-content2',
          )}
        >
          <PlusCircle className='text-default-600 size-full' />
        </div>
        <div className='absolute right-0 top-0 h-full flex items-center pr-4'>
          <span className='text-lg rotate-90 transform origin-center'>
            START
          </span>
        </div>
      </div>
    </BaseEventCard>
  );
};

export default React.memo(EventStartCard);
