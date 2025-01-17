import { EventInstance } from '@/features/event-instance/types.ts';
import { Label } from '@/components/ui/shadcn/label.tsx';
import RudButtonGroup from '@/lib/actions/components/rud-button-group.tsx';
import { useEventForm } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import { Undo2 } from 'lucide-react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';
import UppercasedDescriptorTooltip from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/uppercased-descriptor-tooltip.tsx';
import { useEventPanelIdleActions } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/event-panel-idle-actions.tsx';
import ForkEventButton from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/fork-event-button.tsx';

const IdleEventPanel = {
  Left: () => {
    const eventIdleActions = useEventPanelIdleActions();
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
                actions={eventIdleActions}
                item={event}
              >
                <ForkEventButton event={event} />
              </RudButtonGroup>
            </div>
          </div>
          <EmptyComponentDashed text='Idle event cannot have description' />
        </div>
        <UppercasedDescriptorTooltip labelText={'idle'}>
          <>
            <h3 className='text-lg font-bold mb-2'>Idle Thread</h3>
            <p className='mb-4'>
              An Idle event in a scenario timeline represents a deliberate
              period where no changes or actions are being performed on the
              objects. It acts as a specific marker indicating that the system
              maintains its current state without any modifications or
              interventions.
            </p>
            <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
              <li>
                ● Serves as an explicit indicator that no changes are intended
                during this timeframe
              </li>
              <li>
                ● Can represent a conscious decision to maintain the current
                state of all objects
              </li>
              <li>
                ● Important for scenario planning to mark periods of intentional
                inactivity
              </li>
            </ul>
          </>
        </UppercasedDescriptorTooltip>
      </>
    );
  },
};

export default IdleEventPanel;
