import { ObjectType } from '@/features/object-type/types.ts';
import { Card, CardContent, CardTitle } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';

const ObjectTypeCard = ({
  objectType,
  className,
}: {
  objectType: ObjectType;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        `rounded-none relative min-h-24 max-h-32 p-4 gap-y-6 border transition-all
        duration-75 border-l-4 hover:border-l-[6px] max-w-[30rem] cursor-pointer`,
        className,
      )}
      style={{
        borderLeftColor: objectType.color,
        backgroundColor: `${objectType.color}05`,
      }}
    >
      <div className='absolute right-0 top-0 flex flex-col'>
        {objectType.isOnlyGlobal && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className='size-6 flex items-center justify-center cursor-help'
                style={{
                  backgroundColor: `${objectType.color}30`,
                }}
              >
                G
              </div>
            </TooltipTrigger>
            <TooltipContent side='left'>
              This type is marked as global
            </TooltipContent>
          </Tooltip>
        )}
        {objectType.parentId && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className='size-6 flex items-center justify-center cursor-help'
                style={{
                  backgroundColor: `${objectType.color}30`,
                }}
              >
                P
              </div>
            </TooltipTrigger>
            <TooltipContent side='left' className='text-sm'>
              This type is dependent of other type
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className='flex flex-col gap-2'>
        <CardTitle className='text-lg font-semibold'>
          {objectType.title}
        </CardTitle>
        <CardContent className='text-sm text-default-600 p-0 line-clamp-2'>
          {objectType.description ?? ''}
        </CardContent>
      </div>
    </Card>
  );
};

export default ObjectTypeCard;
