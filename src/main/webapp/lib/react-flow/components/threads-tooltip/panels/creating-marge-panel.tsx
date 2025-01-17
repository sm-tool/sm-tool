import { Panel } from '@xyflow/react';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';

const CreatingMargePanel = () => {
  const { scenarioManipulation } = useThreadsFlow();

  if (!scenarioManipulation.isCreatingMerge) return;

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
            Entered merge mode
            <TriangleAlert className='size-5' />
          </span>
          <span className='text-sm text-default-600'>
            use right mouse button to select position for merge thread on
            possible position
          </span>
          <Button
            variant='outline'
            onClick={() => {
              scenarioManipulation.clearSelected();
            }}
          >
            Exit
          </Button>
        </Card>
      </div>
    </Panel>
  );
};

export default CreatingMargePanel;
