import BaseEventHighlight from '@/features/event-instance/components/event-highlight/base-event-highlight.tsx';
import { EventInstance } from '@/features/event-instance/types.ts';
import { CircleOff } from 'lucide-react';

const EndEventHighlight = ({ event }: { event: EventInstance }) => (
  <BaseEventHighlight
    event={event}
    label='End event'
    icon={
      <div
        className='size-8 rotate-45 bg-content3 flex items-center justify-center border-1
          border-content1 -z-20'
      >
        <CircleOff className='-rotate-45 text-white' />
      </div>
    }
    contentComponent={
      <div className='text-center'>
        <h3 className='text-xl font-bold'>Thread End</h3>
        <p className='text-sm text-default-600 mt-2'>
          This event marks the end of the thread.
        </p>
      </div>
    }
  />
);

export default EndEventHighlight;
