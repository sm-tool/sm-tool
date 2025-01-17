import { Panel } from '@xyflow/react';
import TooltipThreadCard from '@/lib/react-flow/components/threads-tooltip/tooltip-thread-card.tsx';
import TooltipButton from '@/components/ui/common/display/tooltip-button';
import { LetterText, ScrollText } from 'lucide-react';
import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';

const MainPanel = () => {
  const { scenarioManipulation } = useThreadsFlow();

  return (
    <Panel position={'bottom-center'} className='flex gap-x-6'>
      <TooltipThreadCard>
        {scenarioManipulation.threadViewMode === 'description' && (
          <TooltipButton
            variant='outline'
            className='hover:bg-content3 bg-content2'
            onClick={() => scenarioManipulation.setThreadViewMode('event')}
            buttonChildren={<ScrollText className='size-4 flex-shrink-0' />}
          >
            {_ => <>Switch to event view</>}
          </TooltipButton>
        )}
        {scenarioManipulation.threadViewMode === 'event' && (
          <TooltipButton
            variant='outline'
            className='hover:bg-content3 bg-content2'
            onClick={() =>
              scenarioManipulation.setThreadViewMode('description')
            }
            buttonChildren={<LetterText className='size-4 flex-shrink-0' />}
          >
            {_ => <>Switch to event view</>}
          </TooltipButton>
        )}
      </TooltipThreadCard>
    </Panel>
  );
};

export default MainPanel;
