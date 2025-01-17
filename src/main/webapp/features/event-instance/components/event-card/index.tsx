import { EventInstance } from '@/features/event-instance/types.ts';
import { Card } from '@/components/ui/shadcn/card.tsx';
import {
  FLOW_UNIT_EVENT_HEIGHT,
  FLOW_UNIT_EVENT_WIDTH,
} from '@/lib/react-flow/config/scenario-flow-config.ts';
import { cn } from '@nextui-org/theme';

export type EventCardProperties = {
  event?: EventInstance;
};

const EventCard = ({ event }: EventCardProperties) => {
  return (
    <Card
      className={cn(
        `w-full flex flex-col h-full overflow-hidden items-center text-center
        !rounded-none `,
      )}
      style={{
        height: FLOW_UNIT_EVENT_HEIGHT,
        width: FLOW_UNIT_EVENT_WIDTH,
      }}
    >
      <div className='w-full px-4 py-2 border-b flex-shrink-0'>
        <span className='text-2xl font-semibold line-clamp-2 block'>
          {event!.title}
        </span>
      </div>
      <div className='flex-1 overflow-y-auto px-4 py-2 min-h-0'>
        <p className='w-full'>{event!.description}</p>
      </div>
    </Card>
  );
};

export default EventCard;
