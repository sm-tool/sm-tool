import { Thread } from '@/features/thread/types.ts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card.tsx';
import LabeledSection from '@/app/scenario/$scenarioId/_layout/~components/left-content/description/labeled-section.tsx';
import Separator from '@/components/ui/shadcn/separator.tsx';
import ThreadDialogs from '@/features/thread/components/thread-catalog-card/thread-dialogs.tsx';

const ThreadOverview = ({ data }: { data: Thread }) => {
  return (
    <div className='w-full h-full'>
      <Card className='h-full'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div className='flex-1'>
            <ThreadHeader data={data} />
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <LabeledSection
              subtitle={'Description'}
              content={data.description || 'No description provided'}
            />
          </div>
          <Separator />
          <ThreadDetails data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

const ThreadHeader = ({ data }: { data: Thread }) => {
  return (
    <div className='grid grid-cols-[1fr_auto] gap-4 items-start w-full'>
      <CardTitle className='text-xl sm:text-2xl flex items-center gap-2 border-l-4 pl-2 truncate'>
        {data.title}
      </CardTitle>
      <ThreadDialogs data={data} />
    </div>
  );
};

const ThreadDetails = ({ data }: { data: Thread }) => {
  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='sm:col-span-2'>
        <h3 className='text-sm font-medium text-default-500'>Status</h3>
        <div className='flex gap-4 mt-1'>
          <div className='flex items-center gap-2'>
            <div
              className={`w-2 h-2 rounded-full ${
                data.objectIds.length > 0 ? 'bg-success' : 'bg-default-200' }`}
            />
            <span>
              {data.objectIds.length > 0
                ? `${data.objectIds.length} objects linked`
                : 'No objects linked'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadOverview;
