import { useBranchingData } from '@/features/branching/queries.ts';
import { useBranchedEventPanelActions } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/branched-events/branched-event-panel-actions.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import RudButtonGroup from '@/lib/actions/components/rud-button-group.tsx';
import { Branching } from '@/features/branching/types.ts';

const BranchingRud = ({
  branchingDirection,
}: {
  branchingDirection: 'incoming' | 'outgoing';
}) => {
  const branchingQuery = useBranchingData(branchingDirection);
  const branchingActions = useBranchedEventPanelActions();

  return (
    <StatusComponent
      useQuery={branchingQuery}
      className='w-full mt-4 mx-auto items-center justify-center flex'
    >
      {branching => (
        <RudButtonGroup<Branching>
          actions={branchingActions}
          item={branching!}
        />
      )}
    </StatusComponent>
  );
};

export default BranchingRud;
