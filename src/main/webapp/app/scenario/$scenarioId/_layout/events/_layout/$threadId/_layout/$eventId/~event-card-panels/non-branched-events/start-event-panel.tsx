import { Label } from '@/components/ui/shadcn/label.tsx';
import { Undo2 } from 'lucide-react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';
import UppercasedDescriptorTooltip from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/uppercased-descriptor-tooltip.tsx';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { useEventForm } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import { useEventState } from '@/features/event-instance/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/shadcn/command.tsx';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';
import AttributeChangeCard from '@/features/attribute-changes/components/attribute-change-card';
import AssociationChangesOverview from '@/features/association-change/components/association-changes-overview';

const StartEventPanel = {
  Left: () => {
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
                  Start event
                </Label>
              </div>
            </div>
            <div className='w-full mt-4 mx-auto items-center justify-center flex'>
              <Card
                className={
                  'bg-content1 w-fit rounded-lg p-4 flex flex-row gap-2 text-default-500'
                }
              >
                Start event cannot be tweaked
              </Card>
            </div>
          </div>
          <EmptyComponentDashed text='Start event cannot have description' />
        </div>
        <UppercasedDescriptorTooltip labelText={'start'}>
          <>
            <h3 className='text-lg font-bold mb-2'>Start Event</h3>
            <p className='mb-4'>
              A Start Thread event represents the initial point of a
              non-branched thread execution. It serves as the foundation for
              establishing the thread&#39;s starting state by allowing the
              configuration of all necessary associations and attribute values.
            </p>
            <ul className='space-y-2 p-2 border-dashed border-2 border-content1 bg-content2 rounded-lg'>
              <li>
                ● Enables setting initial values for all associations by
                overriding default attribute values
              </li>
              <li>
                ● Establishes primary associations required for the thread&#39;s
                execution
              </li>
              <li>
                ● Must be used as the first event to define the initial state of
                the thread
              </li>
              <li>
                ● Acts as a crucial configuration point for non-branched thread
                initialization
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

export default StartEventPanel;
