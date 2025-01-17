import { Node, NodeProps } from '@xyflow/react';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import BaseEventCard from '@/features/event-instance/components/event-card/type/event-default.tsx';
import { GitFork } from 'lucide-react';
import React from 'react';

const EventMergeOutCard = ({
  ...properties
}: NodeProps<Node<EventCardProperties>>) => (
  <BaseEventCard {...properties}>
    <div className='absolute bg-content1 inset-0'>
      <div className='absolute inset-0 flex items-center justify-center right-8'>
        <GitFork className='text-default-600 size-12 scale-x-[-1] -rotate-90' />
      </div>
      <div className='absolute -right-0.5 top-0 h-full flex items-center'>
        <span className='text-lg -rotate-90 transform origin-center uppercase'>
          Merge out
        </span>
      </div>
    </div>
  </BaseEventCard>
);

export default React.memo(EventMergeOutCard);