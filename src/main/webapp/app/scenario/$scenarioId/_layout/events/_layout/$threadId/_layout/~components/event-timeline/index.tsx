import { Node, Panel, useStore } from '@xyflow/react';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import { useActiveScenario } from '@/features/scenario/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import {
  formatTimeRelativeToEventIndex,
  isSupportedTimeUnit,
  TimeReferenceMode,
} from '@/lib/react-flow/components/threads-context-menu/format-time-relative-to-event-index.ts';
import { useLocalStorage } from '@/hooks/use-local-storage.ts';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/shadcn/context-menu.tsx';
import { Check } from 'lucide-react';

const EventTimeline = ({ nodes }: { nodes: Node<EventCardProperties>[] }) => {
  const { transform } = useStore(state => ({
    transform: state.transform,
  }));
  const [timeMode, setTimeMode] = useLocalStorage<TimeReferenceMode>(
    'timeMode',
    'absolute',
  );

  const activeScenario = useActiveScenario();

  return (
    <StatusComponent useQuery={activeScenario}>
      {scenario => (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Panel
              position='top-center'
              className='w-full h-8 bg-content1 !p-0 !m-0'
            >
              <div className='relative w-full'>
                <div className='absolute w-full bottom-0 border-b border-content3' />
                {nodes.map(node => {
                  const time = node.data.event?.time;
                  const transformedX =
                    node.position.x * transform[2] + transform[0];
                  const formattedTime = formatTimeRelativeToEventIndex(
                    Number(time),
                    timeMode,
                    scenario,
                  );
                  return (
                    <div
                      key={`timeline-${node.id}`}
                      className='absolute flex flex-col items-center'
                      style={{
                        left: `${transformedX}px`,
                      }}
                    >
                      <div className='flex items-center mb-2'>
                        <div className='w-px h-8 bg-default-500 mr-2' />
                        <span className='text-sm text-default-500'>
                          {formattedTime}
                        </span>
                      </div>
                      <div className='h-full w-0.5 bg-default-500' />
                    </div>
                  );
                })}
              </div>
            </Panel>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => setTimeMode('absolute')}
              disabled={!isSupportedTimeUnit(scenario!.eventUnit || '')}
            >
              <span className='flex items-center'>
                {timeMode === 'absolute' && <Check className='mr-2 h-4 w-4' />}
                Absolute Time
              </span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => setTimeMode('startRelative')}
              disabled={!isSupportedTimeUnit(scenario!.eventUnit || '')}
            >
              <span className='flex items-center'>
                {timeMode === 'startRelative' && (
                  <Check className='mr-2 h-4 w-4' />
                )}
                Relative to Start
              </span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => setTimeMode('endRelative')}
              disabled={!isSupportedTimeUnit(scenario!.eventUnit || '')}
            >
              <span className='flex items-center'>
                {timeMode === 'endRelative' && (
                  <Check className='mr-2 h-4 w-4' />
                )}
                Relative to End
              </span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </StatusComponent>
  );
};

export default EventTimeline;
