import { QdsEvent } from '@/features/event/entity.ts';
import { memo } from 'react';
import {
  FLOW_UNIT_HEIGHT,
  FLOW_UNIT_WIDTH,
} from '@/components/feature/page/scenario/scenarioFlow/config/scenario-flow-config.ts';
import { Node, NodeProps } from '@xyflow/react';

const EventDescriptionNode = ({
  data,
}: NodeProps<Node<{ qdsEvent: QdsEvent }>>) => (
  <div
    className='bg-content4 text-content4-foreground'
    style={{ height: FLOW_UNIT_HEIGHT / 2, width: FLOW_UNIT_WIDTH }}
  >
    <div className='h-full flex flex-col items-center p-3 border-t-2 border-x-2 border-default-400'>
      <h3 className='font-bold text-xl text-center min-h-fit'>
        {data.qdsEvent.title}
      </h3>
      <span
        className='flex-grow text-sm flex items-center text-center text-content4-foreground/80
          overflow-hidden'
      >
        {data.qdsEvent.description}
      </span>
    </div>
  </div>
);

export default memo(EventDescriptionNode);
