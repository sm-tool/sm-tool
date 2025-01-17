import { Edge, EdgeProps } from '@xyflow/react';
import React from 'react';
import { AssociationOperation } from '@/features/association-change/types.ts';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { RotateCcw, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import { useAssociationFlow } from '@/features/association-change/components/association-changes-overview/associaiton-changes-context.tsx';
import BaseAssociationEdge from '@/features/association-change/components/flow-components/association-change-edge/base-association-edge.tsx';

const AssociationChangeEdge = (
  properties: EdgeProps<
    Edge<{
      associationId: number;
      changeType: { from: AssociationOperation; to: AssociationOperation };
      isUnsavedEdge: boolean;
    }>
  >,
) => {
  const { onDeleteCurrentChange } = useAssociationFlow();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <g>
          <BaseAssociationEdge {...properties} />
        </g>
      </PopoverTrigger>
      <PopoverContent className='rounded-full w-fit p-0'>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              className='rounded-full hover:bg-content4'
              onClick={() =>
                onDeleteCurrentChange(
                  Number(properties.source),
                  Number(properties.target),
                  properties.data?.changeType.to !== 'INSERT',
                )
              }
            >
              {properties.data?.changeType.to === 'INSERT' ? (
                <Trash2 className='size-6' />
              ) : (
                <RotateCcw className='size-6' />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {properties.data?.changeType.to === 'INSERT'
              ? 'Delete change made by this event'
              : 'Restore change made by this event'}
          </TooltipContent>
        </Tooltip>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(AssociationChangeEdge);
