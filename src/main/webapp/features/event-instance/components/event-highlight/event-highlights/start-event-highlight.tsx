import BaseEventHighlight from '@/features/event-instance/components/event-highlight/base-event-highlight.tsx';
import { EventInstance } from '@/features/event-instance/types.ts';
import { Play } from 'lucide-react';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useThread } from '@/features/thread/queries.ts';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';

const StartEventHighlight = ({ event }: { event: EventInstance }) => {
  return (
    <BaseEventHighlight
      label='Start event'
      event={event}
      icon={
        <div className='size-8 rotate-45 bg-content3 flex items-center justify-center -z-20'>
          <Play className='-rotate-45 text-white' />
        </div>
      }
      contentComponent={
        <StatusComponent
          useQuery={useThread(event.threadId)}
          emptyComponent={
            <EmptyComponentDashed text={'No object has been created'} />
          }
        >
          {thread => (
            <div className='text-center'>
              <h3 className='text-xl font-bold'>Thread Start</h3>
              <p className='text-sm text-default-600 mt-2 text-center'>
                <span className='rounded-full font-bold'>
                  {thread!.objectIds.length}
                </span>{' '}
                {`object${thread!.objectIds.length === 1 ? '' : 's'} has been created`}
              </p>
            </div>
          )}
        </StatusComponent>
      }
    />
  );
};

export default StartEventHighlight;
