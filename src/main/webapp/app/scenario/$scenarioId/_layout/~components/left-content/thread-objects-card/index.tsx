import { ObjectStylizedWithActions } from '@/features/object-instance/components/object-card';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useThread } from '@/features/thread/queries.ts';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import EmptyComponent from '@/components/ui/common/data-load-states/empty-component';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';

const ThreadObjectsCard = ({ threadId }: { threadId: number }) => {
  return (
    <Card className='@container'>
      <StatusComponent
        useQuery={useThread(threadId)}
        loadingComponent={<Skeleton className='w-full h-16' />}
      >
        {thread => (
          <>
            {thread!.objectIds.length > 0 ? (
              <ScrollArea>
                <div className='grid @lg:grid-cols-2 grid-cols-1 gap-4 p-4'>
                  {thread!.objectIds.map((objectId, id) => (
                    <ObjectStylizedWithActions objectId={objectId} key={id} />
                  ))}
                </div>
                <ScrollBar />
              </ScrollArea>
            ) : (
              <EmptyComponent
                text='No objects have been added to this thread yet'
                className='mx-auto w-full'
              />
            )}
          </>
        )}
      </StatusComponent>
    </Card>
  );
};

export default ThreadObjectsCard;
