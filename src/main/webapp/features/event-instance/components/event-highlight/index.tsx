import { EventInstance } from '@/features/event-instance/types.ts';
import NormalEventHighlight from '@/features/event-instance/components/event-highlight/event-highlights/normal-event-highlight.tsx';
import EndEventHighlight from '@/features/event-instance/components/event-highlight/event-highlights/end-event-highlight.tsx';
import StartEventHighlight from '@/features/event-instance/components/event-highlight/event-highlights/start-event-highlight.tsx';
import GlobalEventHighlight from '@/features/event-instance/components/event-highlight/event-highlights/global-event-highlight.tsx';
import IdleEventHighlight from '@/features/event-instance/components/event-highlight/event-highlights/idle-event-highlight.tsx';

const EventHighlight = ({ event }: { event: EventInstance }) => {
  if (event.eventType === 'END') {
    return <EndEventHighlight event={event} />;
  }

  if (event.eventType === 'START') {
    return <StartEventHighlight event={event} />;
  }

  if (event.eventType === 'GLOBAL') {
    return <GlobalEventHighlight event={event} />;
  }

  if (event.eventType === 'IDLE') {
    return <IdleEventHighlight event={event} />;
  }

  return <NormalEventHighlight event={event} />;
};

export default EventHighlight;
