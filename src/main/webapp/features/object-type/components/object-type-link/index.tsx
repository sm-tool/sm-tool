import { useObjectType } from '@/features/object-type/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import { cn } from '@nextui-org/theme';

const ObjectTypeLink = ({
  objectTypeId,
  justify = 'left',
  className,
}: {
  objectTypeId: number;
  justify?: 'left' | 'right';
  className?: string;
}) => {
  const classNames = {
    container: justify === 'right' ? 'justify-end text-right' : 'justify-start',
    link: justify === 'right' ? 'pl-2' : 'pr-2',
  };

  return (
    <StatusComponent
      useQuery={useObjectType(objectTypeId)}
      loadingComponent={<Skeleton className='h-6 w-16' />}
    >
      {data => (
        <div
          className={cn(
            'relative z-10 flex max-w-[80px] w-[80px]',
            classNames.container,
          )}
        >
          <div className={`w-full flex ${classNames.container}`}>
            <object>
              <div
                className={cn(
                  'text-sm truncate bg-content1 max-w-[90px] block z-50 ',
                  classNames.link,
                  className,
                )}
              >
                {data!.title}
              </div>
            </object>
          </div>
        </div>
      )}
    </StatusComponent>
  );
};

export default ObjectTypeLink;
