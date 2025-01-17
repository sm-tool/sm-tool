import { createFileRoute } from '@tanstack/react-router';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { TextSelect } from 'lucide-react';

const EmptyThread = () => {
  return (
    <div className='size-full grid place-items-center h-[80vh]'>
      <Card className='flex flex-col items-center justify-between size-fit p-16 gap-12'>
        <div className='flex flex-col items-center gap-8 text-center max-w-lg'>
          <div className='space-y-4'>
            <h1 className='text-2xl font-bold'>View Thread Content</h1>
            <p className='text-default-600'>
              Currently nothing is selected. Choose an event from the left panel
              or search using the top search bar to browse and edit thread
              events.
            </p>
          </div>

          <TextSelect className='size-32 text-content4' />

          <p className='text-lg font-semibold'>With threads you can:</p>

          <Card className='w-fit p-4 bg-default-100'>
            <div className='text-default-600 space-y-2 text-left'>
              <p>• Browse through event history</p>
              <p>• Edit event properties and details</p>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};
export const Route = createFileRoute(
  '/scenario/$scenarioId/_layout/events/_layout/',
)({
  component: EmptyThread,
});
