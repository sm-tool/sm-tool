import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';
import { Panel } from '@xyflow/react';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { useUpdateJoinCreateRequest } from '@/features/branching/join/queries.ts';

const EditingMargePanel = () => {
  const { scenarioManipulation } = useThreadsFlow();
  const { mutateAsync } = useUpdateJoinCreateRequest();

  if (!scenarioManipulation.isEditingMergeOnBranching) return;

  return (
    <Panel position={'bottom-center'} className='!mb-24'>
      <div className='relative'>
        <div
          className='absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary-400/30
            via-primary-400/50 to-primary-400/30 animate-pulse duration-[3000ms]'
        />
        <Card className='relative py-2 px-6 rounded-xl bg-content1 flex flex-col gap-y-2 z-10'>
          <span
            className='text-xl font-semibold w-full text-center flex flex-row gap-x-2 items-center
              justify-center'
          >
            <TriangleAlert className='size-5' />
            Entered EDITING merge mode
            <TriangleAlert className='size-5' />
          </span>
          <div className='text-sm text-default-600 text-center'>
            <span>
              select or unselect valid thread to edit currently selected merge
            </span>
            <br />
            <span className='underline'>
              {' '}
              Remember that at least ONE merge must remain{' '}
            </span>
          </div>

          <Button
            variant='outline'
            onClick={() => {
              const branching = scenarioManipulation.isEditingMergeOnBranching;
              if (!branching) return;
              void mutateAsync({
                branchingId: scenarioManipulation.isEditingMergeOnBranching!.id,
                joinUpdateRequest: {
                  joinTitle: branching?.title,
                  joinDescription: branching?.description,
                  threadIdsToJoin: scenarioManipulation.selectedThreadsForMerge,
                },
              });
              scenarioManipulation.clearSelectedMergeEdit();
            }}
          >
            Submit
          </Button>

          <Button
            variant='outline'
            onClick={() => {
              scenarioManipulation.clearSelectedMergeEdit();
            }}
          >
            Exit
          </Button>
        </Card>
      </div>
    </Panel>
  );
};

export default EditingMargePanel;
