import { AssociationChange } from '@/features/association-change/types.ts';
import { Card } from '@/components/ui/shadcn/card.tsx';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useAssociationType } from '@/features/association-type/queries.ts';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import { cn } from '@nextui-org/theme';
import { useObjectInstance } from '@/features/object-instance/queries.ts';

const ObjectTypeText = ({
  objectInstanceId,
  justify = 'left',
}: {
  objectInstanceId: number;
  justify?: 'left' | 'right';
}) => {
  return (
    <StatusComponent
      useQuery={useObjectInstance(objectInstanceId)}
      loadingComponent={<Skeleton className='h-6 w-16' />}
    >
      {data => (
        <div
          className={cn(
            'relative z-10',
            justify === 'right' ? 'text-right' : 'text-left',
          )}
        >
          <div className='absolute inset-0 -inset-x-3 bg-content1' />

          <div
            className={cn(
              'text-sm relative z-10 min-w-0 max-w-[120px]',
              'line-clamp-3 break-words whitespace-pre-wrap',
            )}
          >
            {data!.name}
          </div>
        </div>
      )}
    </StatusComponent>
  );
};

const AssociationChangeCard = ({
  associationChange,
}: {
  associationChange: AssociationChange;
}) => {
  return (
    <Card className='rounded-none relative min-h-24 flex items-center p-4 border'>
      <div className='flex w-full relative items-center gap-4'>
        <div className='absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-default-300' />

        <div className='shrink basis-[80px] relative z-10'>
          <ObjectTypeText objectInstanceId={associationChange.object1Id} />
        </div>

        <div className='flex-1 flex items-center justify-center'>
          <StatusComponent
            className='border border-default-300 rounded text-xs truncate relative z-10 bg-background
              flex px-4 w-fit items-center justify-center'
            useQuery={useAssociationType(associationChange.associationTypeId)}
          >
            {associationType => <>{associationType!.description}</>}
          </StatusComponent>
        </div>

        <div className='shrink basis-[80px] relative z-10 flex items-center'>
          <div
            className='absolute top-1/2 -translate-y-1/2 size-2.5 border-t-2 border-r-2 -left-6
              border-default-200 transform rotate-45'
          />
          <div className='w-full'>
            <ObjectTypeText
              objectInstanceId={associationChange.object2Id}
              justify='right'
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AssociationChangeCard;
