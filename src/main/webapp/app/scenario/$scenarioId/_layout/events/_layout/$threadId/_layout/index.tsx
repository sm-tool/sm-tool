import { createFileRoute } from '@tanstack/react-router';
import { useThread } from '@/features/thread/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import ThreadDialogs from '@/features/thread/components/thread-catalog-card/thread-dialogs.tsx';
import AddObjectDialog from '@/features/object-instance/components/add-object-dialog';
import { Label } from '@/components/ui/shadcn/label.tsx';
import { Card } from '@/components/ui/shadcn/card.tsx';
import ThreadNavigation from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/~components/thread-navigation';
import BranchingCardPreview from '@/features/branching/components/branching-card-preview';
import UppercasedDescriptorTooltip from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/uppercased-descriptor-tooltip.tsx';
import ThreadObjectsCard from '@/app/scenario/$scenarioId/_layout/~components/left-content/thread-objects-card';
import DialogWrapper from '@/lib/modal-dialog/components/dialog-wrapper.tsx';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';

const ThreadSummary = () => {
  const { threadId } = Route.useParams();
  const threadQuery = useThread(Number(threadId));

  return (
    <DialogWrapper>
      <StatusComponent useQuery={threadQuery}>
        {thread => (
          <ScrollArea className='h-[70svh] w-full'>
            <div className='flex flex-col xl:flex-row gap-8 p-6 relative bg-content2'>
              <div className='w-full xl:w-[20%] flex flex-col space-y-6'>
                <div className='w-full'>
                  <h1 className='text-3xl font-bold border-l-4 border-primary pl-4'>
                    {thread!.title}
                  </h1>
                  <div className='w-full mt-4 mx-auto items-center justify-center flex'>
                    <Card
                      className={
                        'bg-content1 w-fit rounded-lg flex flex-row gap-2 text-default-500'
                      }
                    >
                      <ThreadDialogs data={thread!} isOpenHidden />
                    </Card>
                  </div>
                </div>
                <Label className='text-sm translate-y-5 pl-2'>
                  Description
                </Label>
                <Card>
                  <ScrollArea className='h-[25svh] xl:h-[45svh] p-6'>
                    {thread!.description || 'No description provided'}
                  </ScrollArea>
                </Card>
              </div>
              <div className='w-full xl:w-[60%] justify-center'>
                <div className='bg-card rounded-lg p-6 shadow h-full'>
                  <div className='space-y-4'>
                    <div className='flex flex-col gap-y-6'>
                      <AddObjectDialog
                        threadId={thread!.id}
                        disabled={!!thread!.incomingBranchingId}
                      />
                      <ScrollArea className='xl:h-[57svh] h-[40vh]'>
                        <ThreadObjectsCard threadId={thread!.id} />
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full xl:w-[20%]'>
                <div className='rounded-lg px-6 pb-6 shadow h-full flex flex-col'>
                  <div className='w-full flex flex-col gap-4 mt-4 flex-1'>
                    <Card className='flex-1 relative'>
                      <Label
                        variant='uppercased'
                        className='absolute top-2 text-default-500 text-center w-full'
                      >
                        Thread navigation
                      </Label>
                      <div className='size-full p-4'>
                        <ThreadNavigation thread={thread!} />
                      </div>
                    </Card>
                    {(
                      [
                        [`Incoming operation`, thread!.incomingBranchingId],
                        ['Outgoing operation', thread!.outgoingBranchingId],
                      ] as const
                    ).map(([label, id]) => (
                      <Card
                        key={label}
                        className='flex-[2] p-4 flex flex-col gap-2 @container min-h-[200px]'
                      >
                        <div className='w-full flex justify-end'>
                          <Label
                            variant='uppercased'
                            className='text-default-500 line-clamp-1 @[100px]:line-clamp-none'
                          >
                            {label}
                          </Label>
                        </div>
                        <div className='flex-1 flex items-center justify-center mb-12'>
                          <BranchingCardPreview branchingId={id} />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              <span className='absolute bottom-0 left-4 hidden xl:block'>
                {
                  <Label
                    variant='uppercased'
                    weight='bold'
                    className='text-[64px] text-content3'
                  >
                    {!thread!.incomingBranchingId && Number(threadId) != 0 && (
                      <UppercasedDescriptorTooltip labelText='regular'>
                        <>
                          <h3 className='text-lg font-bold mb-2'>
                            Regular Thread
                          </h3>
                          <p className='mb-4'>
                            A Regular thread is the standard execution path in
                            the scenario that has full operational capabilities.
                            It can create new objects during its start event and
                            freely manipulate them throughout its lifecycle
                            using various events. This type of thread is
                            provided at the beginning of the scenario and serves
                            as the primary means of modeling system behavior.
                          </p>
                          <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
                            <li>
                              ● Has full capability to create new objects during
                              its start event initialization
                            </li>
                            <li>
                              ● Can execute all types of events and manipulate
                              objects within its scope
                            </li>
                            <li>
                              ● Represents the standard thread type provided at
                              scenario start for modeling system behavior
                            </li>
                          </ul>
                        </>
                      </UppercasedDescriptorTooltip>
                    )}
                    {thread!.incomingBranchingId && (
                      <UppercasedDescriptorTooltip labelText='branched'>
                        <>
                          <h3 className='text-lg font-bold mb-2'>
                            Branched Thread
                          </h3>
                          <p className='mb-4'>
                            A Branched thread is created as a result of fork or
                            merge operations in scenario branching. While it
                            operates like a regular thread, it has a key
                            limitation - it cannot create new objects and must
                            work exclusively with objects provided to it during
                            the branching operation.
                          </p>
                          <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
                            <li>
                              ● Functions with the same capabilities as regular
                              threads except for object creation
                            </li>
                            <li>
                              ● Can only manipulate objects that were passed to
                              it during fork or merge operations
                            </li>
                            <li>
                              ● Represents a specialized execution path that
                              works with a predefined set of objects
                            </li>
                          </ul>
                        </>
                      </UppercasedDescriptorTooltip>
                    )}
                    {Number(threadId) == 0 && (
                      <UppercasedDescriptorTooltip labelText='global'>
                        <>
                          <h3 className='text-lg font-bold mb-2'>
                            Global Thread
                          </h3>
                          <p className='mb-4'>
                            The Global thread is a special thread that exists
                            throughout the entire scenario timeline, from start
                            to finish. It operates exclusively on global objects
                            and when a global event occurs within this thread,
                            it blocks all other events from being executed in
                            that time unit, making it a critical coordinator of
                            system-wide states.
                          </p>
                          <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
                            <li>
                              ● Persists for the entire duration of the
                              scenario, being the only thread guaranteed to
                              exist from beginning to end
                            </li>
                            <li>
                              ● Has exclusive access to global objects and can
                              only operate on objects with global visibility
                            </li>
                            <li>
                              ● When active with an event, prevents any other
                              thread from executing events in the same time unit
                            </li>
                          </ul>
                        </>
                      </UppercasedDescriptorTooltip>
                    )}
                  </Label>
                }
              </span>
            </div>
          </ScrollArea>
        )}
      </StatusComponent>
    </DialogWrapper>
  );
};

export const Route = createFileRoute(
  '/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/',
)({
  component: ThreadSummary,
});
