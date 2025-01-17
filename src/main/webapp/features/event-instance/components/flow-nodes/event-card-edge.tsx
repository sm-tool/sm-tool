import { BaseEdge, Edge, EdgeProps, getStraightPath } from '@xyflow/react';
import React from 'react';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { useThreadOffset } from '@/features/thread/queries.ts';
import { useParams } from '@tanstack/react-router';

const EventCardEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}: EdgeProps<Edge<{ time: number }>>) => {
  const { threadId } = useParams({
    strict: false,
  });
  const { mutateAsync } = useThreadOffset();
  // const { navigateWithParametersBetweenEvents } = UseScenarioCommonNavigation();
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  const handleClick = async () => {
    await mutateAsync({
      data: {
        time: data!.time - 1,
        threadId: Number(threadId!),
        shift: 1,
      },
    });
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <foreignObject
        width={72}
        height={72}
        x={centerX - 36}
        y={centerY - 36}
        className='overflow-visible'
        style={{ pointerEvents: 'all' }}
      >
        <div className='group relative flex items-center justify-center'>
          <Button
            variant='ghost'
            onClick={handleClick}
            className='relative flex h-[72px] w-[72px] items-center justify-center rounded-xl border-2
              border-dashed border-content4 bg-content1/30 backdrop-blur-sm hover:border-solid
              hover:bg-content3 hover:shadow-lg transition-all duration-300
              ease-[cubic-bezier(0.34,1.56,0.64,1)]'
          >
            <div
              className='absolute inset-0 flex items-center justify-center text-default-400
                group-hover:text-white transition-colors duration-300'
            >
              <Plus
                size={32}
                className='transform transition-transform duration-300
                  ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110'
              />
            </div>
          </Button>

          <div
            className='absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full invisible
              group-hover:visible opacity-0 group-hover:opacity-100 transition-all delay-100
              duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50 overflow-hidden
              rounded-md border border-content4 bg-content3 px-3 py-1.5 text-sm
              text-foreground shadow-sm w-[180px]'
          >
            Create new event here
          </div>
        </div>
      </foreignObject>
    </>
  );
};

export default React.memo(EventCardEdge);
