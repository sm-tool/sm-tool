import { Card } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';
import { AssociationType } from '@/features/association-type/types.ts';
import ObjectTypeLink from '@/features/object-type/components/object-type-link';

export const AssociationConnectionLine = ({
  associationType,
  orientation = 'horizontal',
}: {
  associationType: AssociationType;
  orientation?: 'horizontal' | 'vertical';
}) => {
  return (
    <div
      className={cn(
        'flex w-full relative',
        orientation === 'horizontal'
          ? 'items-center justify-between'
          : 'flex-col items-center h-full',
      )}
    >
      <div className='absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-default-300' />

      <div className='w-[70px] shrink-0'>
        <ObjectTypeLink objectTypeId={associationType.firstObjectTypeId} />
      </div>

      <div
        className={cn(
          'flex flex-1',
          orientation === 'horizontal'
            ? 'mx-2 items-center justify-center'
            : 'my-2 flex-col items-center',
        )}
      >
        <div
          className={cn(
            `border border-default-300 rounded text-xs truncate transition-all duration-75
            relative z-10 bg-background @xs:block hidden`,
            orientation === 'horizontal'
              ? 'mx-2 px-2 group-hover/card:px-4 group-hover/card:max-w-[270px] max-w-[260px]'
              : 'my-2 py-2 group-hover/card:py-4 group-hover/card:max-h-[270px] max-h-[260px]',
          )}
        >
          {associationType.description}
        </div>
      </div>

      <div className='w-[7 0px] shrink-0'>
        <ObjectTypeLink
          justify='right'
          objectTypeId={associationType.secondObjectTypeId}
        />
      </div>
    </div>
  );
};

const AssociationTypeCard = ({
  associationType,
  className,
  onClick,
}: {
  associationType: AssociationType;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Card
      className={cn(
        `rounded-none relative min-h-24 max-h-32 flex items-center p-4 border
        cursor-pointer group/card @container`,
        className,
      )}
      onClick={onClick}
    >
      <AssociationConnectionLine associationType={associationType} />
    </Card>
  );
};

export default AssociationTypeCard;
