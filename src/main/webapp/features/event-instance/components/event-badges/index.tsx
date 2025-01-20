import { useEvent } from '@/features/event-instance/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { cn } from '@nextui-org/theme';
import ChangesBadge from '@/features/event-instance/components/changes-badge';

const EventBadges = ({
  eventId,
  className,
}: {
  eventId: number;
  className?: string;
}) => (
  <StatusComponent useQuery={useEvent(eventId)} loadingComponent={<></>}>
    {event => (
      <div
        className={cn(
          'absolute bottom-1 right-1 flex flex-row z-30',
          className,
        )}
      >
        <ChangesBadge count={event!.attributeChanges.length} type='attribute' />
        <ChangesBadge
          count={event!.associationChanges.length}
          type='association'
        />
      </div>
    )}
  </StatusComponent>
);

export default EventBadges;
