import { EventInstance } from '@/features/event-instance/types.ts';
import { Label } from '@/components/ui/shadcn/label.tsx';
import RudButtonGroup from '@/lib/actions/components/rud-button-group.tsx';
import { useEventPanelActions } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/event-panel-actions.ts';
import { useEventForm } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import { Undo2 } from 'lucide-react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';
import UppercasedDescriptorTooltip from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/uppercased-descriptor-tooltip.tsx';

const GlobalEventPanel = {
  Left: () => {
    const eventActions = useEventPanelActions();
    const { event } = useEventForm();
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
                <Label
                  variant='uppercased'
                  size='3xl'
                  className='pl-12 text-default-500 tracking-tight'
                  weight='bold'
                >
                  Idle event
                </Label>
              </div>
            </div>
            <div className='w-full mt-4 mx-auto items-center justify-center flex'>
              <RudButtonGroup<EventInstance>
                actions={eventActions}
                item={event}
              />
            </div>
          </div>
          <EmptyComponentDashed text='Idle event cannot have description' />
        </div>
        <UppercasedDescriptorTooltip labelText='global'>
          <>
            <h3 className='text-lg font-bold mb-2'>Global Event</h3>
            <p className='mb-4'>
              A Global event is specialized type of event that operates
              exclusively on objects accessible globally across all threads. Its
              primary purpose is to establish and manage states that need to be
              visible to all threads, transcending the usual limitation where
              threads are only aware of their own changes.
            </p>
            <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
              <li>
                ● Manipulates only globally accessible objects that can be
                viewed by all threads
              </li>
              <li>
                ● Establishes shared states and conditions visible across the
                entire thread ecosystem
              </li>
              <li>
                ● Breaks the thread isolation pattern by creating system-wide
                visible changes
              </li>
            </ul>
          </>
        </UppercasedDescriptorTooltip>
      </>
    );
  },
};

export default GlobalEventPanel;
