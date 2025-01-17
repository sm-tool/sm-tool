import { EventInstance } from '@/features/event-instance/types.ts';
import BaseEventHighlight from '@/features/event-instance/components/event-highlight/base-event-highlight.tsx';
import { ScrollText } from 'lucide-react';

const NormalEventHighlight = ({ event }: { event: EventInstance }) => (
  <BaseEventHighlight
    event={event}
    icon={
      <div
        className='size-8 rotate-45 bg-content3 flex items-center justify-center border-content2
          border-1 -z-20'
      >
        <ScrollText className='-rotate-45' />
      </div>
    }
  />
);

export default NormalEventHighlight;
