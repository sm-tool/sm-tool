import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';
import useDarkMode from '@/hooks/use-dark-mode.tsx';
import EventCardNode from '@/features/event-instance/components/flow-nodes/event-card-node.tsx';
import EventStartCard from '@/features/event-instance/components/event-card/type/event-start.tsx';
import EventEndCard from '@/features/event-instance/components/event-card/type/event-end.tsx';
import EventForkInCard from '@/features/event-instance/components/event-card/type/event-fork-in.tsx';
import EventCardEdge from '@/features/event-instance/components/flow-nodes/event-card-edge.tsx';
import {
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useThreadEvents } from '@/features/event-instance/queries.ts';
import {
  FLOW_UNIT_EVENT_HEIGHT,
  FLOW_UNIT_EVENT_WIDTH,
  FLOW_UNIT_EVENT_WIDTH_PADDING,
} from '@/lib/react-flow/config/scenario-flow-config.ts';
import React from 'react';
import EventPlaceholder from '@/features/event-instance/components/event-card/type/event-placeholder.tsx';
import EventForkOutCard from '@/features/event-instance/components/event-card/type/event-fork-out.tsx';
import EventMergeInCard from '@/features/event-instance/components/event-card/type/event-merge-in.tsx';
import EventMergeOutCard from '@/features/event-instance/components/event-card/type/event-merge-out.tsx';
import EventIdleCard from '@/features/event-instance/components/event-card/type/event-idle.tsx';
import EventTimeline from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/~components/event-timeline';
import EventPhaseTimeline from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/~components/event-phase-timeline';

type EventSettings = {
  nodeType: string;
  nodeWdith: number;
  shapeClassName?: string;
};

export const eventSettingsMap: Record<string, EventSettings> = {
  START: {
    nodeType: 'eventStartNode',
    nodeWdith: FLOW_UNIT_EVENT_WIDTH / 2,
    shapeClassName: '[&_div]:rounded-l-full',
  },
  END: {
    nodeType: 'eventEndNode',
    nodeWdith: FLOW_UNIT_EVENT_WIDTH / 2,
    shapeClassName: '[&_div]:rounded-r-full',
  },
  NORMAL: { nodeType: 'eventNode', nodeWdith: FLOW_UNIT_EVENT_WIDTH },
  GLOBAL: { nodeType: 'eventGlobalNode', nodeWdith: FLOW_UNIT_EVENT_WIDTH },
  IDLE: { nodeType: 'idle', nodeWdith: FLOW_UNIT_EVENT_WIDTH },
  FORK_IN: {
    nodeType: 'eventForkInNode',
    nodeWdith: FLOW_UNIT_EVENT_WIDTH / 4,
  },
  FORK_OUT: {
    nodeType: 'eventForkOutNode',
    nodeWdith: FLOW_UNIT_EVENT_WIDTH / 4,
  },
  JOIN_IN: {
    nodeType: 'eventJoinInNode',
    nodeWdith: FLOW_UNIT_EVENT_WIDTH / 4,
  },
  JOIN_OUT: {
    nodeType: 'eventJoinOutNode',
    nodeWdith: FLOW_UNIT_EVENT_WIDTH / 4,
  },
};

const nodeTypes = {
  eventNode: EventCardNode,
  eventStartNode: EventStartCard,
  eventEndNode: EventEndCard,
  eventGlobalNode: EventCardNode,
  eventForkInNode: EventForkInCard,
  eventForkOutNode: EventForkOutCard,
  eventJoinInNode: EventMergeInCard,
  eventJoinOutNode: EventMergeOutCard,
  eventPlaceholder: EventPlaceholder,
  idle: EventIdleCard,
};

const edgeTypes = {
  eventEdge: EventCardEdge,
};

const ThreadBottomContent = () => {
  const { theme } = useDarkMode();
  const { threadId } = Route.useParams();
  const { nodes, edges } = useEventsFlow(Number(threadId));

  return (
    <div className='size-full border-b-2 border-divider'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        className='size-full'
        proOptions={{ hideAttribution: true }}
        onlyRenderVisibleElements
        colorMode={theme}
        fitView
        translateExtent={[
          [-100, 200],
          [Infinity, 0],
        ]}
        maxZoom={1}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Background className='!bg-content2' gap={10} id={'thread'} />
        <EventTimeline nodes={nodes} />
        <EventPhaseTimeline nodes={nodes} />
      </ReactFlow>
    </div>
  );
};

const useEventsFlow = (threadId: number) => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const events = useThreadEvents(threadId);
  // @ts-expect-error -- a string, hovewer tanstack router does not allow for bowh layouting and parametrized path (i know)
  const { time } = useParams({ strict: false });

  React.useEffect(() => {
    if (events.data) {
      let eventNodes = events.data.map((event, id) => ({
        id: `event-${event.id}`,
        type: eventSettingsMap[event.eventType].nodeType,
        position: {
          x:
            id * FLOW_UNIT_EVENT_WIDTH_PADDING +
            (event.eventType === 'END' ||
            event.eventType === 'FORK_IN' ||
            event.eventType === 'JOIN_IN'
              ? 0
              : FLOW_UNIT_EVENT_WIDTH -
                eventSettingsMap[event.eventType].nodeWdith),
          y: 0,
        },
        data: {
          event: event,
        },
        width: eventSettingsMap[event.eventType].nodeWdith,
        height: FLOW_UNIT_EVENT_HEIGHT,
        className: eventSettingsMap[event.eventType].shapeClassName,
      }));

      if (time) {
        const timeNumber = Number(time);

        // TODO: dowiedzieć się jak idle działajką żeby to wywalkić
        let eventAfterIndex = events.data.findIndex(
          event => event.time === timeNumber,
        );

        if (eventAfterIndex === -1) {
          eventAfterIndex = events.data.findIndex(
            event => event.time > timeNumber,
          );
        }

        if (eventAfterIndex > 0) {
          const placeholderNode = {
            id: 'placeholder-node',
            type: 'eventPlaceholder',
            position: {
              x: eventAfterIndex * FLOW_UNIT_EVENT_WIDTH_PADDING,
              y: 0,
            },
            data: {
              time: timeNumber,
            },
            width: FLOW_UNIT_EVENT_WIDTH,
            height: FLOW_UNIT_EVENT_HEIGHT,
          };

          // eghhh co ja bym dał za immera
          eventNodes = eventNodes.map((node, index) => {
            if (index >= eventAfterIndex) {
              return {
                ...node,
                position: {
                  ...node.position,
                  x:
                    (index + 1) * FLOW_UNIT_EVENT_WIDTH_PADDING +
                    (node.data.event.eventType === 'END' ||
                    node.data.event.eventType === 'FORK_IN' ||
                    node.data.event.eventType === 'JOIN_IN'
                      ? 0
                      : FLOW_UNIT_EVENT_WIDTH -
                        eventSettingsMap[node.data.event.eventType].nodeWdith),
                },
              };
            }
            return node;
          });

          // @ts-expect-error -- ts intercepts type from first object
          eventNodes.splice(eventAfterIndex, 0, placeholderNode);
        }
      }

      // @ts-expect-error --  ts intercepts type from first object
      setNodes(eventNodes);

      if (events.data.length > 1) {
        const eventEdges = events.data.slice(0, -1).map((event, index) => ({
          id: `edge-${event.id}-${events.data[index + 1].id}`,
          source: `event-${event.id}`,
          target: `event-${events.data[index + 1].id}`,
          type: 'eventEdge',
          data: {
            time: event.time + 1,
          },
        }));

        // @ts-expect-error --  ts intercepts type from first object
        setEdges(eventEdges);
      }
    }
  }, [events.data, time, setNodes, setEdges]);

  return {
    nodes,
    edges,
  };
};

const EventContent = () => {
  return (
    <div className='flex flex-col h-full'>
      <div className='h-[24%] flex-shrink-0'>
        <ThreadBottomContent />
      </div>
      <div className='flex-1 min-h-0'>
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute(
  '/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout',
)({
  component: EventContent,
});
