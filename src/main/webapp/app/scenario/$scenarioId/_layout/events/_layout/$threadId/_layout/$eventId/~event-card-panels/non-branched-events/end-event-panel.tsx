import { Label } from '@/components/ui/shadcn/label.tsx';
import { RudButtonGroupCard } from '@/lib/actions/components/rud-button-group.tsx';
import { useEventForm } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import { Undo2 } from 'lucide-react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';
import UppercasedDescriptorTooltip from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/uppercased-descriptor-tooltip.tsx';
import ForkEventButton from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/fork-event-button.tsx';
import { useEventState } from '@/features/event-instance/queries.ts';
import React from 'react';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs.tsx';
import AttributeChangeCard from '@/features/attribute-changes/components/attribute-change-card';
import AttribiuteUnChangedCard from '@/features/attribute-changes/components/attribiute-un-changed-card';
import AssociationChangesOverview from '@/features/association-change/components/association-changes-overview';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/shadcn/command';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';

const EndEventPanel = {
  Left: () => {
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
                  End event
                </Label>
              </div>
            </div>
            <div className='w-full mt-4 mx-auto items-center justify-center flex'>
              <RudButtonGroupCard>
                {/* FIXME: Coś tu jest nie tak */}
                <ForkEventButton event={event} />
              </RudButtonGroupCard>
            </div>
          </div>
          <EmptyComponentDashed text='End event cannot have description' />
        </div>
        <UppercasedDescriptorTooltip labelText={'end'}>
          <>
            <h3 className='text-lg font-bold mb-2'>Thread End Event</h3>
            <p className='mb-4'>
              An End Event marks the final point in a thread execution timeline.
              It serves as a definitive termination point where all non-global
              object modifications are finalized and locked. After this event,
              no further changes can be made to the thread-specific objects used
              within this execution path.
            </p>
            <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
              <li>● Finalizes all thread-specific object states</li>
              <li>
                ● Prevents any further modifications to non-global objects
              </li>
              <li>● Marks the completion of the execution thread</li>
            </ul>
          </>
        </UppercasedDescriptorTooltip>
      </>
    );
  },

  Right: () => {
    const { event, updateAttribute, deleteAttribute } = useEventForm();
    const eventStateQuery = useEventState(event.id);
    const missingAttributes = React.useMemo(() => {
      if (!eventStateQuery.data?.attributesState) return [];
      const existingAttributeIds = new Set(
        event.attributeChanges.map(change => change.attributeId),
      );
      return eventStateQuery.data.attributesState.filter(
        state => !existingAttributeIds.has(state.attributeId),
      );
    }, [event.attributeChanges, eventStateQuery.data?.attributesState]);

    const { dirtyAssociationsCount, dirtyAttributesCount } = useEventForm();

    return (
      <StatusComponent useQuery={eventStateQuery} showIfEmpty>
        {_ => (
          <div className='w-full h-full border-content1 border-2 rounded-xl rounded-tl-none relative my-6'>
            <Tabs
              defaultValue='attributes'
              className='absolute -top-[38px] -left-1.5 size-full'
            >
              <TabsList className='bg-transparent'>
                <TabsTrigger
                  value='attributes'
                  className='rounded-none rounded-tl-xl rounded-tr-none border-2 border-content1 border-b-0
                    flex flex-row items-center gap-x-2'
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs
                    ${dirtyAttributesCount > 0 ? 'bg-primary' : 'bg-content3'}`}
                  >
                    {dirtyAttributesCount > 9 ? '9+' : dirtyAttributesCount}
                  </div>
                  Attribute Changes
                </TabsTrigger>
                <TabsTrigger
                  value='associations'
                  className='rounded-none rounded-tr-xl border-2 border-content1 border-b-0 border-l-0 flex
                    flex-row items-center gap-x-2'
                >
                  Association Changes
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs
                    ${dirtyAssociationsCount > 0 ? 'bg-primary' : 'bg-content3'}`}
                  >
                    {dirtyAssociationsCount > 9 ? '9+' : dirtyAssociationsCount}
                  </div>
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value='attributes'
                className='relative -top-2.5 left-1.5 h-full rounded-xl rounded-tl-none'
              >
                <Command className='rounded-lg border bg-content2'>
                  <div className='flex items-center gap-4 my-2 border-b-2 border-content3'>
                    <CommandInput
                      placeholder='Search attributes...'
                      className='max-w-xs'
                    />
                  </div>

                  <CommandList>
                    <ScrollArea className='h-full w-full'>
                      <CommandEmpty>No attributes found.</CommandEmpty>

                      {event.attributeChanges.length > 0 && (
                        <CommandGroup heading='Changed Attributes'>
                          {event.attributeChanges.map((change, index) => (
                            <AttributeChangeCard
                              key={index}
                              editDisabled
                              deleteDisabled={event.eventType === 'START'}
                              attributeChange={change}
                              onChange={updateAttribute}
                              onDelete={deleteAttribute}
                            />
                          ))}
                        </CommandGroup>
                      )}

                      {missingAttributes.length > 0 && (
                        <CommandGroup heading='Unchanged Attributes'>
                          {missingAttributes.map((state, index) => (
                            <AttribiuteUnChangedCard
                              disabled
                              state={state}
                              key={index}
                            />
                          ))}
                        </CommandGroup>
                      )}
                    </ScrollArea>
                  </CommandList>
                </Command>
              </TabsContent>
              <TabsContent
                value='associations'
                className='left-1.5 relative -top-2.5 h-full rounded-xl rounded-tl-none'
              >
                <AssociationChangesOverview disabled />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </StatusComponent>
    );
  },
};

export default EndEventPanel;
