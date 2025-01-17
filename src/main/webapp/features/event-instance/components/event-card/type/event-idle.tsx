import React from 'react';
import { Node, NodeProps } from '@xyflow/react';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import BaseEventCard from '@/features/event-instance/components/event-card/type/event-default.tsx';
import { Label } from '@/components/ui/shadcn/label.tsx';

const EventIdleCard = ({
  ...properties
}: NodeProps<Node<EventCardProperties>>) => (
  <BaseEventCard {...properties}>
    <div
      className='absolute bg-content2 border-content3 inset-0 border-dashed border-5 flex
        items-center justify-center'
    >
      <Label
        variant='uppercased'
        size='3xl'
        weight='bold'
        className='text-content3'
      >
        idle
      </Label>
    </div>
  </BaseEventCard>
);

export default React.memo(EventIdleCard);
