import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useBranching } from '@/features/branching/queries.ts';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';
import { CardDescription } from '@/components/ui/shadcn/card.tsx';
import { Label } from '@/components/ui/shadcn/label.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';

const BranchingCard = ({ branchingId }: { branchingId: number }) => {
  const branchingQuery = useBranching(branchingId);

  return (
    <StatusComponent useQuery={branchingQuery}>
      {branching => (
        <div className='flex flex-col gap-y-4 mt-4'>
          <Label variant='entity' className='truncater' size='lg'>
            {branching!.title}
          </Label>
          <CardDescription className='line-clamp-4'>
            {branching!.description}
          </CardDescription>
          <div className='absolute bottom-2 flex justify-center w-full inset-x-0'>
            <Button variant='outline' disabled>
              Manage branching
            </Button>
          </div>
        </div>
      )}
    </StatusComponent>
  );
};

const BranchingCardPreview = ({
  branchingId,
}: {
  branchingId: number | null | undefined;
}) => {
  if (!branchingId) {
    return (
      <EmptyComponentDashed
        className='text-center'
        text='Does not take part in threading operations'
      />
    );
  }

  return <BranchingCard branchingId={branchingId} />;
};

export default BranchingCardPreview;
