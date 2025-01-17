import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import UppercasedDescriptorTooltip from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/uppercased-descriptor-tooltip.tsx';
import { Undo2 } from 'lucide-react';
import BranchingTitle from '@/features/branching/components/branching-card/branching-title.tsx';
import BranchingRud from '@/features/branching/components/branching-card/branching-rud.tsx';
import BranchingDescription from '@/features/branching/components/branching-card/branching-description.tsx';

const ForkOutEventPanel = {
  Left: () => {
    const direction = 'incoming';

    const { navigateWithParametersBetweenEvents } =
      useScenarioCommonNavigation();

    return (
      <>
        <div className='flex flex-col space-y-6 w-full'>
          <div>
            <div className='flex flex-row justify-between items-start mb-4'>
              <div className='relative flex-grow'>
                <Button
                  variant='ghost'
                  onClick={() => navigateWithParametersBetweenEvents('')}
                  className='absolute -left-3 -top-1'
                >
                  <Undo2 className='size-6' />
                  <span className='w-1 h-[32px] bg-primary absolute right-1' />
                </Button>
                <BranchingTitle branchingDirection={direction} />
              </div>
            </div>
            <div className='w-full mt-4'>
              <BranchingRud branchingDirection={direction} />
            </div>
          </div>
          <BranchingDescription branchingDirection={direction} />
        </div>
        <UppercasedDescriptorTooltip labelText='merge in'>
          <>
            <h3 className='text-lg font-bold mb-2'>Merge In Event</h3>
            <p className='mb-4'>
              A Merge In event indicates that the current thread is
              participating in a branching operation that will result in thread
              consolidation. During this process, all objects from the current
              thread are transferred to a single merged target thread. This
              event type marks the point where multiple threads converge into
              one.
            </p>
            <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
              <li>
                ● Signals thread participation in a merge operation where
                multiple threads combine into one
              </li>
              <li>
                ● Transfers all objects from the current thread to the merged
                target thread
              </li>
              <li>
                ● Maintains a read-only state where attribute and association
                modifications are restricted
              </li>
            </ul>
          </>
        </UppercasedDescriptorTooltip>
      </>
    );
  },
};

export default ForkOutEventPanel;
