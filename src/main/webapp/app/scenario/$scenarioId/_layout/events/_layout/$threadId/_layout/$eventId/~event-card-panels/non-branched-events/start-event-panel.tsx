import { Label } from '@/components/ui/shadcn/label.tsx';
import { Undo2 } from 'lucide-react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';
import UppercasedDescriptorTooltip from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~event-card-panels/non-branched-events/uppercased-descriptor-tooltip.tsx';
import { Card } from '@/components/ui/shadcn/card.tsx';

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
};

export default StartEventPanel;
