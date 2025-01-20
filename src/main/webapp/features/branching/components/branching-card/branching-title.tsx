import { useBranchingData } from '@/features/branching/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { Label } from '@/components/ui/shadcn/label.tsx';

const BranchingTitle = ({
  branchingDirection,
}: {
  branchingDirection: 'incoming' | 'outgoing';
}) => {
  const branchingQuery = useBranchingData(branchingDirection);

  return (
    <StatusComponent useQuery={branchingQuery}>
      {branching => (
        <Label variant='foreground' weight='bold' size='3xl' className='pl-12'>
          {branching!.title}
        </Label>
      )}
    </StatusComponent>
  );
};

export default BranchingTitle;
