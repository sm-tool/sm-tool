import { Card, CardContent, CardHeader } from '@/components/ui/shadcn/card.tsx';
import Separator from '@/components/ui/shadcn/separator.tsx';
import { AssociationType } from '@/features/association-type/types.ts';
import { AssociationConnectionLine } from '@/features/association-type/components/association-type-card.tsx';
import ObjectTypeLink from '@/features/object-type/components/object-type-link';
import AssociationTypeDialogs from '@/features/association-type/components/association-type-overview/association-type-dialogs.tsx';
import { cn } from '@nextui-org/theme';

const AssociationTypeOverview = ({
  data,
  isVertical = false,
}: {
  data: AssociationType;
  isVertical?: boolean;
}) => {
  return (
    <div className='w-full h-full flex flex-col space-y-4 @container'>
      <Card className='h-full'>
        <CardHeader className='gap-y-4'>
          <div className='flex place-content-end'>
            <AssociationTypeDialogs data={data} />
          </div>
          <Card className={cn('p-4 mx-0 @sm:mx-auto w-full @3xl:w-1/2')}>
            <AssociationConnectionLine associationType={data} />
          </Card>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h3 className='text-sm font-medium text-default-500'>
              Description
            </h3>
            <p className='mt-1 truncate'>
              {data.description || 'No description provided'}
            </p>
          </div>
          <Separator />
          <div className='space-y-2'>
            <div
              className={cn(
                'gap-4',
                isVertical ? 'flex flex-col' : 'grid grid-cols-2',
              )}
            >
              <div>
                <p className='text-sm font-medium text-default-500'>
                  First Object Type
                </p>
                <ObjectTypeLink
                  objectTypeId={data.firstObjectTypeId}
                  className='max-w-3xl'
                />
              </div>
              <div>
                <p className='text-sm font-medium text-default-500'>
                  Second Object Type
                </p>
                <ObjectTypeLink
                  objectTypeId={data.secondObjectTypeId}
                  className='max-w-3xl'
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationTypeOverview;
