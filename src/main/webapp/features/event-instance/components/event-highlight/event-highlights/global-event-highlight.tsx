import BaseEventHighlight from '@/features/event-instance/components/event-highlight/base-event-highlight.tsx';
import { EventInstance } from '@/features/event-instance/types.ts';
import { Globe2 } from 'lucide-react';
import { useViewport } from '@xyflow/react';
import { FLOW_UNIT_WIDTH } from '@/lib/react-flow/config/scenario-flow-config.ts';
import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';

const GlobalEventHighlight = ({ event }: { event: EventInstance }) => {
  const { zoom } = useViewport();
  const { scenarioManipulation } = useThreadsFlow();

  return (
    <div
      style={{
        width: FLOW_UNIT_WIDTH,
      }}
      className='grid place-items-center'
    >
      {scenarioManipulation.threadViewMode === 'description' ? (
        <span className='pointer-events-none select-none animate-appearance-in transition-all'>
          {event.title}
        </span>
      ) : (
        <BaseEventHighlight
          style={{
            transform: `scale(${1 / zoom})`,
          }}
          event={event}
          icon={
            <div
              className='rotate-45 bg-content3 flex items-center justify-center border-warning-500
                border-1 -z-20'
            >
              <Globe2 className='-rotate-45 text-white' />
            </div>
          }
          label='Global event'
        />
      )}
    </div>
  );
};

export default GlobalEventHighlight;
