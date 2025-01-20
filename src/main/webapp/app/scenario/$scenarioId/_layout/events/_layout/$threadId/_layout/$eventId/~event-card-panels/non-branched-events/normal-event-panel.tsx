import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs.tsx';
import { EventInstance } from '@/features/event-instance/types.ts';
import { Label } from '@/components/ui/shadcn/label.tsx';
import LabeledSection from '@/app/scenario/$scenarioId/_layout/~components/left-content/description/labeled-section.tsx';
import RudButtonGroup from '@/lib/actions/components/rud-button-group.tsx';
import { useEventPanelActions } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/event-panel-actions.ts';
import AttributeChangeCard from '@/features/attribute-changes/components/attribute-change-card';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';
import { useEventForm } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import { useEventState } from '@/features/event-instance/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import React from 'react';
import AttribiuteUnChangedCard from '@/features/attribute-changes/components/attribiute-un-changed-card';
import AssociationChangesOverview from '@/features/association-change/components/association-changes-overview';
import { Undo2 } from 'lucide-react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import UppercasedDescriptorTooltip from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/uppercased-descriptor-tooltip.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/shadcn/command.tsx';

const NormalEventPanel = {
  Left: () => {
    const eventActions = useEventPanelActions();
    const { event } = useEventForm();
    const { navigateWithParametersBetweenEvents } =
      useScenarioCommonNavigation();

    const eventTitleFilled = event.title?.length !== 0;

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
                  variant={eventTitleFilled ? 'foreground' : 'default'}
                  size='3xl'
                  weight='semibold'
                  className='pl-12'
                >
                  {eventTitleFilled ? event.title : 'Titleless event'}
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
          <LabeledSection
            subtitle={'Description'}
            content={event.description || 'No description provided'}
          />
        </div>
        <UppercasedDescriptorTooltip labelText='default'>
          <>
            <h3 className='text-lg font-bold mb-2'>Default Event</h3>
            <p className='mb-4'>
              A Default event serves as a general-purpose modification event in
              the object scenario timeline. It enables direct manipulation of
              object states through attribute value changes and relationship
              management between objects. These events are primarily designed
              for implementing state modifications.
            </p>
            <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
              <li>
                ● Allows modification of object attributes and their values
                during scenario execution
              </li>
              <li>
                ● Handles creation and dissolution of associations between
                different objects
              </li>
              <li>
                ● Functions as the primary event type for implementing state
                changes and object manipulations
              </li>
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
                className='left-1.5 relative -top-2.5 h-full rounded-xl rounded-tl-none'
              >
                <Command
                  className='rounded-lg border bg-content2'
                  filter={(value, search) => {
                    const includes = value
                      .toLowerCase()
                      .includes(search.toLowerCase());
                    return includes ? 1 : 0;
                  }}
                >
                  <div className='flex items-center gap-4 my-2 border-b-2 border-content3'>
                    <CommandInput
                      placeholder='Search attributes...'
                      className='max-w-xs'
                    />
                  </div>
                  <ScrollArea className='h-full w-full'>
                    <CommandList>
                      <ScrollArea className='h-full w-full'>
                        <CommandEmpty>No attributes found.</CommandEmpty>

                        {event.attributeChanges.length > 0 && (
                          <CommandGroup heading='Changed Attributes'>
                            {event.attributeChanges.map((change, index) => (
                              <AttributeChangeCard
                                key={index}
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
                                state={state}
                                key={index}
                              />
                            ))}
                          </CommandGroup>
                        )}
                      </ScrollArea>
                    </CommandList>
                  </ScrollArea>
                </Command>
              </TabsContent>
              <TabsContent
                value='associations'
                className='left-1.5 relative -top-2.5 h-full rounded-xl rounded-tl-none'
              >
                <AssociationChangesOverview />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </StatusComponent>
    );
  },
};

export default NormalEventPanel;
