import { Block, createFileRoute, useParams } from '@tanstack/react-router';
import { EventInstance } from '@/features/event-instance/types.ts';
import NormalEventPanel from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/normal-event-panel.tsx';
import React from 'react';
import EventFormProvider, {
  useEventForm,
} from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { cn } from '@nextui-org/theme';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import { TriangleAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog.tsx';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useEvent } from '@/features/event-instance/queries.ts';
import IdleEventPanel from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/idle-event-panel.tsx';
import GlobalEventPanel from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/global-event-panel.tsx';
import StartEventPanel from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/start-event-panel.tsx';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import EndEventPanel from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/end-event-panel.tsx';
import ForkOutEventPanel from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/branched-events/fork-out-event-panel.tsx';
import MergeInEventPanel from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/branched-events/merge-in-event-panel.tsx';
import MergeOutEventPanel from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/branched-events/merge-out-event-panel.tsx';
import ForkInEventPanel from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/branched-events/fork-in-event-panel.tsx';

export const PANELS: {
  left: Record<string, React.ComponentType<{ event: EventInstance }>>;
  right: Record<string, React.ComponentType<{ event: EventInstance }>>;
} = {
  left: {
    NORMAL: NormalEventPanel.Left,
    IDLE: IdleEventPanel.Left,
    GLOBAL: GlobalEventPanel.Left,
    START: StartEventPanel.Left,
    END: EndEventPanel.Left,
    JOIN_OUT: MergeOutEventPanel.Left,
    JOIN_IN: MergeInEventPanel.Left,
    FORK_OUT: ForkOutEventPanel.Left,
    FORK_IN: ForkInEventPanel.Left,
  },
  right: {
    NORMAL: NormalEventPanel.Right,
    IDLE: NormalEventPanel.Right,
    GLOBAL: NormalEventPanel.Right,
    START: NormalEventPanel.Right,
    END: EndEventPanel.Right,
    JOIN_OUT: EndEventPanel.Right,
    JOIN_IN: EndEventPanel.Right,
    FORK_OUT: EndEventPanel.Right,
    FORK_IN: EndEventPanel.Right,
  },
} as const;

const EventLeftPanel = () => {
  const { eventId } = Route.useParams();
  const eventQuery = useEvent(Number(eventId));

  return (
    <StatusComponent
      useQuery={eventQuery}
      className='w-1/5 flex-shrink-0 flex h-[92%]'
    >
      {event => {
        const Panel = PANELS.left[event!.eventType];
        return Panel ? <Panel event={event!} /> : <></>;
      }}
    </StatusComponent>
  );
};

const EventRightPanel = () => {
  const { eventId } = Route.useParams();
  const eventQuery = useEvent(Number(eventId));

  return (
    <StatusComponent useQuery={eventQuery} className='w-4/5 h-[92%]'>
      {event => {
        const Panel = PANELS.right[event!.eventType];
        return Panel ? <Panel event={event!} /> : <></>;
      }}
    </StatusComponent>
  );
};

const SaveButton = () => {
  const { submitChanges, isDirty } = useEventForm();

  return (
    <Block
      enableBeforeUnload={() => isDirty}
      shouldBlockFn={() => isDirty}
      withResolver
    >
      {({ status, proceed, reset }) => (
        <>
          <div className='fixed bottom-4 right-4'>
            <Tooltip open={isDirty} delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  className={cn('w-full', isDirty && 'bg-warning')}
                  onClick={submitChanges}
                  disabled={!isDirty}
                >
                  Save Changes
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side='left'
                className='flex flex-row gap-x-2 justify-center items-center bg-warning text-background
                  border-content1 border-2'
              >
                <TriangleAlert className='text-background' />
                You have unsaved changes, remember to save them after finishing
                the work!
              </TooltipContent>
            </Tooltip>
          </div>
          {status === 'blocked' && (
            <Dialog open={true} onOpenChange={() => reset()}>
              <DialogContent className='bg-content1 border-2 border-danger animate-in'>
                <DialogHeader>
                  <DialogTitle className='text-danger font-semibold'>
                    Unsaved Changes
                  </DialogTitle>
                  <DialogDescription className='text-danger/80'>
                    You have unsaved changes. What would you like to do?
                  </DialogDescription>
                </DialogHeader>
                <div className='flex !flex-row justify-between items-center w-full'>
                  <div>
                    <Button
                      variant='outline'
                      onClick={() => reset()}
                      className='hover:bg-danger/10'
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      className='border-danger text-danger hover:bg-danger/10'
                      onClick={() => proceed()}
                    >
                      Leave without saving
                    </Button>
                    <Button
                      className='bg-warning text-background hover:bg-warning/90'
                      onClick={async () => {
                        await submitChanges();
                        proceed();
                      }}
                    >
                      Save and leave
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </Block>
  );
};

const EventSummary = () => {
  const { eventId, threadId } = useParams({
    strict: false,
  });
  const { navigateWithParameters } = useScenarioCommonNavigation();

  const { isError } = useEvent(Number(eventId));

  React.useEffect(() => {
    if (isError) {
      navigateWithParameters(`events/${threadId}`);
    }
  }, [isError, threadId, navigateWithParameters]);

  if (isError) {
    return null;
  }

  return (
    <EventFormProvider>
      <div className='flex flex-row gap-8 p-6 h-[65svh] bg-content2'>
        <EventLeftPanel />
        <EventRightPanel />
      </div>
      <SaveButton />
    </EventFormProvider>
  );
};

export const Route = createFileRoute(
  '/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/',
)({
  component: EventSummary,
});
