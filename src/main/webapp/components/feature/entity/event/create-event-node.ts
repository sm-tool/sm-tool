import { QdsEvent } from '@/features/event/entity.ts';
import { Node } from '@xyflow/react';
import {
  calculateFlowXPosition,
  calculateFlowYPosition,
  FLOW_UNIT_HEIGHT,
} from '@/components/feature/page/scenario/scenarioFlow/config/scenario-flow-config.ts';

export const getEventNodeId = (qdsEvent: QdsEvent) =>
  `${qdsEvent.threadId}-${qdsEvent.id}`;
const getEventNodeDescriptionId = (qdsEvent: QdsEvent) =>
  `${qdsEvent.threadId}-${qdsEvent.id}-description`;
const getEventNodeActionsId = (qdsEvent: QdsEvent) =>
  `${qdsEvent.threadId}-${qdsEvent.id}-actions`;

const createEventNode = ({
  qdsEvent,
  threadYIndex,
}: {
  qdsEvent: QdsEvent;
  threadYIndex: number;
}) => {
  const xPosition = calculateFlowXPosition(qdsEvent.deltaTime);
  const baseYPosition = calculateFlowYPosition(threadYIndex);

  const nodes: Node[] = [
    // Description node
    {
      id: getEventNodeDescriptionId(qdsEvent),
      type: 'eventNodeDescription',
      position: {
        x: xPosition,
        y: baseYPosition,
      },
      data: { qdsEvent },
    },
    // Actions group node
    {
      id: getEventNodeActionsId(qdsEvent),
      type: 'eventNodeActions',
      position: {
        x: xPosition,
        y: baseYPosition + FLOW_UNIT_HEIGHT / 2,
      },
      data: { qdsEvent },
    },
  ];

  return nodes;
};

export default createEventNode;
