import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';
import { Merge } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import ThreadsDeleteButton from '@/lib/react-flow/components/threads-tooltip/threads-delete-button';
import TooltipThreadCard from '@/lib/react-flow/components/threads-tooltip/tooltip-thread-card.tsx';
import { Panel } from '@xyflow/react';

const ThreadManipulationActionPanel = () => {
  const { scenarioManipulation } = useThreadsFlow();

  if (scenarioManipulation.selectedThreads.length === 0) return null;

  return (
    <Panel position={'bottom-center'} className='!translate-x-16'>
      <TooltipThreadCard className='bg-primary-400/10 border-content1 border-1'>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              className='hover:bg-content3 bg-content2'
              onClick={() => scenarioManipulation.setIsCreatingMerge(true)}
            >
              <Merge className='size-4 flex-shrink-0 rotate-90' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Merge selected threads</TooltipContent>
        </Tooltip>
        <ThreadsDeleteButton />
      </TooltipThreadCard>
    </Panel>
  );
};

export default ThreadManipulationActionPanel;
