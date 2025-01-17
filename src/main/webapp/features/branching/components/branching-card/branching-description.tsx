import { useBranchingData } from '@/features/branching/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import LabeledSection from '@/app/scenario/$scenarioId/_layout/~components/left-content/description/labeled-section.tsx';

const BranchingDescription = ({
  branchingDirection,
}: {
  branchingDirection: 'incoming' | 'outgoing';
}) => {
  const branchingQuery = useBranchingData(branchingDirection);

  return (
    <StatusComponent useQuery={branchingQuery}>
      {branching => (
        <>
          <LabeledSection
            subtitle={'Description'}
            content={branching!.description || 'No description provided'}
          />
        </>
      )}
    </StatusComponent>
  );
};

export default BranchingDescription;
