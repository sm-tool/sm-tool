import { Undo2 } from 'lucide-react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import UppercasedDescriptorTooltip from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/uppercased-descriptor-tooltip.tsx';
import BranchingDescription from '@/features/branching/components/branching-card/branching-description.tsx';
import BranchingTitle from '@/features/branching/components/branching-card/branching-title.tsx';
import BranchingRud from '@/features/branching/components/branching-card/branching-rud.tsx';

const MergeOutEventPanel = {
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
        <UppercasedDescriptorTooltip labelText='merge out'>
          <>
            <h3 className='text-lg font-bold mb-2'>Merge Out Event</h3>
            <p className='mb-4'>
              A Merge Out event represents the resulting thread state after a
              merge operation has completed. This event marks the beginning of a
              unified thread that contains all objects from previously merged
              threads. It serves as the first event in the consolidated timeline
              after thread convergence.
            </p>
            <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
              <li>
                ● Represents the outcome of a merge operation, containing the
                combined state of all merged threads
              </li>
              <li>
                ● Maintains a read-only state where attribute and association
                modifications are restricted
              </li>
              <li>
                ● Serves as the starting point for the unified thread after
                multiple threads have been consolidated
              </li>
            </ul>
          </>
        </UppercasedDescriptorTooltip>
      </>
    );
  },
};

export default MergeOutEventPanel;
