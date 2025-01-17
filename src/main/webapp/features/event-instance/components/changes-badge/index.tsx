import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import { cn } from '@nextui-org/theme';

const ChangesBadge = ({
  count,
  type,
}: {
  count: number;
  type: 'attribute' | 'association';
}) => {
  if (count === 0) return null;
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <div
          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
            transition-all duration-200 ease-in-out hover:ring-2 hover:ring-offset-1
            border-content2 border-1 ${
            type === 'attribute'
                ? 'bg-primary-200 hover:ring-content2'
                : 'bg-secondary-200 hover:ring-content2'
            } `}
        >
          {count > 9 ? '9+' : count}
        </div>
      </TooltipTrigger>
      <TooltipContent
        className={cn(
          type === 'attribute'
            ? 'bg-content3 border-content3'
            : 'bg-content4 border-content3',
          '!rounded-md',
        )}
      >
        Event has made changes to {count}{' '}
        {type === 'attribute' ? 'attribute' : 'association'}
        {count > 1 && 's'}
      </TooltipContent>
    </Tooltip>
  );
};

export default ChangesBadge;
