import BaseEventCard from '@/features/event-instance/components/event-card/type/event-default.tsx';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import { Node, NodeProps } from '@xyflow/react';
import React from 'react';
import { GitFork } from 'lucide-react';

const EventForkInCard = ({
  ...properties
}: NodeProps<Node<EventCardProperties>>) => (
  <BaseEventCard {...properties}>
    <div className='absolute bg-content1 inset-0'>
      <div className='absolute inset-0 flex items-center justify-center left-8'>
        <GitFork className='text-default-600 size-12 rotate-90' />
      </div>
      <div className='absolute -left-3 top-0 h-full flex items-center'>
        <span className='text-lg -rotate-90 transform origin-center uppercase'>
          Fork in
        </span>
      </div>
    </div>
  </BaseEventCard>
);

export default React.memo(EventForkInCard);
