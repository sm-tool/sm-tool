import { Node, NodeProps } from '@xyflow/react';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import { memo } from 'react';
import EventHighlight from '@/features/event-instance/components/event-highlight';

const EventHighlightNode = ({ data }: NodeProps<Node<EventCardProperties>>) => (
  <div>
    {/*@ts-expect-error -- changeing this type for specific usage is against business logic*/}
    <EventHighlight event={data.event} />
  </div>
);

export default memo(EventHighlightNode);
