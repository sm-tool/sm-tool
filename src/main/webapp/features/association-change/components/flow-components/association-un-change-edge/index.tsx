/* eslint-disable -- not my lib */
// @ts-nocheck

import {
  Edge,
  EdgeProps,
  getStraightPath,
  useInternalNode,
} from '@xyflow/react';
import React from 'react';
import { useAssociationType } from '@/features/association-type/queries.ts';
import { AssociationOperation } from '@/features/association-change/types.ts';
import { motion } from 'framer-motion';
import { getEdgeParams } from '@/lib/react-flow/utils/math.ts';
import { cn } from '@nextui-org/theme';
import { Unplug } from 'lucide-react';
import { useAssociationFlow } from '@/features/association-change/components/association-changes-overview/associaiton-changes-context.tsx';
import TooltipButton from '@/components/ui/common/display/tooltip-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shadcn/popover.tsx';

const AssociationUnChangeEdge = ({
  source,
  target,
  markerEnd,
  data,
}: EdgeProps<
  Edge<{
    associationId: number;
    changeType: { from: AssociationOperation; to: AssociationOperation };
  }>
>) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);
  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  const angle = Math.atan2(ty - sy, tx - sx) * (180 / Math.PI);
  const adjustedAngle = angle > 90 || angle < -90 ? angle + 180 : angle;

  const centerX = (sx + tx) / 2;
  const centerY = (sy + ty) / 2;

  const { data: association, isLoading } = useAssociationType(
    data!.associationId,
  );

  const { onAssociationBreak } = useAssociationFlow();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <g>
      <path
        d={edgePath}
        style={{
          stroke: 'white',
          fillOpacity: 2,
        }}
        markerEnd={markerEnd}
        className={cn('transition-colors duration-300 stroke-[4px]')}
      />
      <motion.g
        transform={`translate(${centerX},${centerY}) rotate(${adjustedAngle})`}
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            {isLoading ? (
              <rect
                x='-40'
                y='-10'
                width='80'
                height='20'
                rx='4'
                className='fill-white animate-pulse'
              />
            ) : (
              association?.description && (
                <g>
                  <rect
                    x={-(association.description.length * 4 + 5)}
                    y='-10'
                    width={association.description.length * 8 + 10}
                    height='20'
                    rx='4'
                    fill='white'
                    className='transition-colors duration-300'
                  />
                  <text
                    className='text-md !text-black'
                    dominantBaseline='middle'
                    textAnchor='middle'
                  >
                    {association.description}
                  </text>
                </g>
              )
            )}
          </PopoverTrigger>
          <PopoverContent
            className='rounded-full w-fit p-0'
            side='top'
            align='center'
            sideOffset={-15}
          >
            <TooltipButton
              buttonChildren={<Unplug className='size-6' />}
              onClick={() => {
                onAssociationBreak(source, target);
                setIsOpen(false);
              }}
              disabled={data.disabled}
            >
              {disabled =>
                disabled ? (
                  <>
                    Thread termination and branching events cannot make any
                    changes
                  </>
                ) : (
                  <>Break association in this event</>
                )
              }
            </TooltipButton>
          </PopoverContent>
        </Popover>
      </motion.g>
    </g>
  );
};

export default React.memo(AssociationUnChangeEdge);
