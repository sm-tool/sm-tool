import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { cn } from '@nextui-org/theme';
import React, { PropsWithChildren } from 'react';
import { useParams } from '@tanstack/react-router';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import { motion } from 'framer-motion';
import EventBadges from '@/features/event-instance/components/event-badges';

const BaseEventCard = ({
  children,
  ...properties
}: PropsWithChildren<NodeProps<Node<EventCardProperties>>>) => {
  const { eventId } = useParams({
    strict: false,
  });
  const { navigateWithParametersBetweenEvents } = useScenarioCommonNavigation();
  const isActive = !!eventId && Number(eventId) === properties.data.event!.id;

  return (
    <motion.div
      layout
      className='relative cursor-pointer border-default-400 border-1 transition-all duration-300
        ease-in-out'
      onClick={() =>
        navigateWithParametersBetweenEvents(properties.data.event!.id)
      }
      style={{ width: properties.width, height: properties.height }}
    >
      <Handle
        type='target'
        position={Position.Left}
        id='target'
        className='invisible'
      />
      {children}
      <div
        className={cn(
          `absolute inset-0 pointer-events-none transition-all duration-200 cursor-pointer
          z-20`,
          isActive && 'ring-1 ring-primary shadow-lg bg-primary/3',
        )}
      />
      <EventBadges
        eventId={properties.data.event!.id}
        className={'absolute bottom-1 right-1 z-30'}
      />
      <Handle
        type='source'
        position={Position.Right}
        id='source'
        className='invisible'
      />
    </motion.div>
  );
};

export default React.memo(BaseEventCard);
