import { EventInstance } from '@/features/event-instance/types.ts';
import { Card } from '@/components/ui/shadcn/card.tsx';
import {
  FLOW_UNIT_EVENT_HEIGHT,
  FLOW_UNIT_EVENT_WIDTH,
} from '@/lib/react-flow/config/scenario-flow-config.ts';
import { cn } from '@nextui-org/theme';
import { Label } from '@/components/ui/shadcn/label.tsx';

export type EventCardProperties = {
  event?: EventInstance;
};

const EventCard = ({ event }: EventCardProperties) => {
  const isTitleless = event!.title?.length === 0;
  const isDescriptionless = event!.description?.length === 0;

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
        <Label
          variant={isTitleless ? 'default' : 'foreground'}
          className='text-2xl font-semibold line-clamp-2 block'
        >
          {isTitleless ? 'Titleless event' : event!.title}
        </Label>
      </div>
      <div className='flex-1 overflow-y-auto px-4 py-2 min-h-0'>
        <Label
          variant={isDescriptionless ? 'default' : 'foreground'}
          className='w-full'
        >
          {isDescriptionless
            ? 'This event has no description'
            : event!.description}
        </Label>
      </div>
    </Card>
  );
};

export default EventCard;
