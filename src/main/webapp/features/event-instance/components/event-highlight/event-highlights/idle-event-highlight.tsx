import BaseEventHighlight from '@/features/event-instance/components/event-highlight/base-event-highlight.tsx';
import { Timer } from 'lucide-react';
import { EventInstance } from '@/features/event-instance/types.ts';

const IdleEventHighlight = ({ event }: { event: EventInstance }) => (
  <BaseEventHighlight
    event={event}
    icon={
      <div
        className='size-8 rotate-45 bg-content2 border-dashed flex items-center justify-center
          border-default-300 border-1 -z-20'
      >
        <Timer className='-rotate-45' />
      </div>
    }
    label='Idle event'
    contentComponent={
      <div className='text-center'>
        <h3 className='text-xl font-bold text-default-600'>Idle Period</h3>
        <p className='text-sm text-default-500 mt-2'>
          No changes during this event
        </p>
        <div className='mt-4 text-sm text-default-400'>
          {event.title && <p className='font-semibold'>{event.title}</p>}
          {event.description && <p className='mt-1'>{event.description}</p>}
        </div>
      </div>
    }
  />
);

export default IdleEventHighlight;
