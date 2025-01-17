import { Node, NodeProps } from '@xyflow/react';
import EventCard, {
  EventCardProperties,
} from '@/features/event-instance/components/event-card';
import { memo } from 'react';
import BaseEventCard from '@/features/event-instance/components/event-card/type/event-default.tsx';

const EventCardNode = ({
  ...properties
}: NodeProps<Node<EventCardProperties>>) => (
  <BaseEventCard {...properties}>
    <EventCard event={properties.data.event} />
  </BaseEventCard>
);

export default memo(EventCardNode);
