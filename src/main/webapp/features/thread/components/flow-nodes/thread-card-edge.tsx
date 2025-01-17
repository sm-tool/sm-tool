import { Edge, EdgeProps, getBezierPath } from '@xyflow/react';
import {
  FLOW_UNIT_HEIGHT,
  FLOW_UNIT_WIDTH,
} from '@/lib/react-flow/config/scenario-flow-config.ts';
import React from 'react';
import useDarkMode from '@/hooks/use-dark-mode.tsx';
import { branchingType } from '@/features/branching/types.ts';
import { z } from '@/lib/zod-types/hiden-field.types.ts';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover.tsx';
import { Badge } from '@/components/ui/shadcn/badge.tsx';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import { GLOBAL_THREAD_HEIGHT } from '@/features/thread/components/global-thread-card';
import { cn } from '@nextui-org/theme';
import { ArrowRight } from 'lucide-react';

type BranchingData = {
  type: z.infer<typeof branchingType>;
  isCorrect: boolean | null;
  title: string;
  description: string;
  transfer: number;
};

const BranchingTransferBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger>
        <div
          className='w-5 h-5 rounded-full bg-default-600 text-background border-1 border-content2
            flex items-center justify-center text-xs font-semibold hover:ring-2
            ring-content2 transition-all duration-200 hover:ring-offset-1'
        >
          {count > 9 ? '9+' : count}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {count} object{count === 1 ? '' : 's'} transfer
      </TooltipContent>
    </Tooltip>
  );
};

const getBranchingCorrectness = (data: BranchingData) => {
  if (data.type === 'JOIN') return true;
  return data.isCorrect;
};

const ThreadCardEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<Edge<BranchingData>>) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  if (!data) return;

  const { theme } = useDarkMode();
  const isCorrect = getBranchingCorrectness(data);

  const positionX = data.type === 'JOIN' ? sourceX : targetX;
  const positionY = data.type === 'JOIN' ? sourceY : targetY;
  const angle =
    Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);

  return (
    <>
      <path
        style={{
          ...style,
          strokeWidth: FLOW_UNIT_HEIGHT,
          stroke: theme === 'dark' ? '#334155' : '#cbd5e1',
          fillOpacity: 1,
        }}
        className='react-flow__edge-path transition-colors duration-300'
        d={edgePath}
      />
      <path
        style={{
          ...style,
          strokeWidth: FLOW_UNIT_HEIGHT - 2,
          stroke:
            theme === 'dark'
              ? 'var(--edge-color, #0f172a)'
              : 'var(--edge-color, #e2e8f0)',
          fillOpacity: 1,
        }}
        className='react-flow__edge-path transition-colors duration-300'
        d={edgePath}
        markerEnd={markerEnd}
      />

      <foreignObject
        x={positionX - FLOW_UNIT_WIDTH / 2 + (data.type === 'JOIN' ? 30 : -30)}
        y={positionY - GLOBAL_THREAD_HEIGHT / 2 - 20}
        width={FLOW_UNIT_WIDTH}
        height={GLOBAL_THREAD_HEIGHT + 40}
      >
        <Popover>
          <PopoverTrigger asChild>
            <div className='flex flex-row items-center justify-center select-none'>
              <div className='flex relative items-center pt-5'>
                <div
                  className={cn(
                    'size-8 flex items-center justify-center border-1 border-content1 rotate-45',
                    isCorrect === true ? 'bg-content3' : 'bg-danger',
                  )}
                >
                  <ArrowRight
                    className='text-foreground'
                    style={{
                      transform:
                        data.type === 'JOIN'
                          ? `rotate(${angle - 45}deg)`
                          : `rotate(-45deg)`,
                    }}
                  />
                </div>
              </div>
              <div className='absolute -top-0.5'>
                <BranchingTransferBadge count={data.transfer} />
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className='p-2 px-4 pb-7 flex flex-col gap-y-2'
            onOpenAutoFocus={event => event.preventDefault()}
          >
            <div className='border-b pb-2'>
              <span className='text-2xl font-semibold line-clamp-2'>
                {data.title}
              </span>
            </div>
            <ScrollArea className='max-h-[15rem] flex flex-col'>
              <p className='w-full pr-4 break-words'>{data.description}</p>
              <ScrollBar />
            </ScrollArea>
            <div className='absolute bottom-1 left-2 flex justify-between w-full'>
              <div className='flex flex-row gap-2'>
                {isCorrect !== null && !isCorrect && (
                  <Badge variant={'destructive'}>Incorrect</Badge>
                )}
                <BranchingTransferBadge count={data.transfer} />
              </div>
            </div>
            <span
              className='absolute text-default-400 uppercase font-bold tracking-widest text-xs right-1
                bottom-1'
            >
              {data.type}
            </span>
          </PopoverContent>
        </Popover>
      </foreignObject>
    </>
  );
};

export default React.memo(ThreadCardEdge);
