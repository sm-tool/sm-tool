import { MinusCircle } from 'lucide-react';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import BaseEventCard from '@/features/event-instance/components/event-card/type/event-default.tsx';
import { Node, NodeProps } from '@xyflow/react';
import React from 'react';

const EventEndCard = ({
  ...properties
}: NodeProps<Node<EventCardProperties>>) => {
  return (
    <BaseEventCard {...properties}>
      <div className='absolute bg-content1 inset-0'>
        <div className='absolute right-4 inset-y-1/4 size-24 rounded-full bg-content2'>
          <MinusCircle className='text-default-600 size-full' />
        </div>
        <div className='absolute left-0 top-0 h-full flex items-center pl-4'>
          <span className='text-lg -rotate-90 transform origin-center'>
            END
          </span>
        </div>
      </div>
    </BaseEventCard>
  );
};

export default React.memo(EventEndCard);
