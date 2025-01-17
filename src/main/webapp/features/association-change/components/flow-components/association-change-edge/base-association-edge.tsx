/* eslint-disable -- not my lib */
// @ts-nocheck

import React from 'react';
import {
  Edge,
  EdgeProps,
  getStraightPath,
  useInternalNode,
} from '@xyflow/react';
import { AssociationOperation } from '@/features/association-change/types.ts';
import { getEdgeParams } from '@/lib/react-flow/utils/math.ts';
import { useAssociationType } from '@/features/association-type/queries.ts';
import { cn } from '@nextui-org/theme';
import { motion } from 'framer-motion';

const BaseAssociationEdge = ({
  source,
  target,
  markerEnd,
  data,
  style,
  children,
}: EdgeProps<
  Edge<{
    associationId: number;
    changeType: { from: AssociationOperation; to: AssociationOperation };
    isUnsavedEdge: boolean;
  }>
> & { children?: React.ReactNode }) => {
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

  const associationColor =
    data?.changeType.to === 'INSERT' ? '#16a34a' : '#dc2626';
  const edgeColor = data?.changeType.to === 'INSERT' ? '#15803d' : '#b91c1c';

  const dashOffset = data?.changeType.to === 'INSERT' ? -1 : 1;

  const animationClass =
    data?.changeType.to === 'INSERT'
      ? 'animate-dash-forward'
      : 'animate-dash-backward';

  return (
    <>
      <path
        d={edgePath}
        style={{
          stroke: edgeColor,
          fillOpacity: 2,
          strokeDasharray: '8,8',
          strokeDashoffset: dashOffset,
        }}
        markerEnd={markerEnd}
        className={cn(
          'transition-colors duration-300 stroke-[4px]',
          animationClass,
        )}
      />
      {data?.isUnsavedEdge && (
        <>
          <path
            d={edgePath}
            style={{
              stroke: '#fbbf24',
              filter: 'blur(2px)',
              opacity: 0.8,
            }}
            className='stroke-[10px]'
          />
          <path
            d={edgePath}
            style={{
              stroke: '#fbbf24',
              opacity: 0.9,
            }}
            className='stroke-[8px]'
          />
        </>
      )}
      <path
        d={edgePath}
        style={{ ...style, stroke: edgeColor }}
        className='!stroke-0'
        markerEnd={markerEnd}
      />
      <motion.g
        transform={`translate(${centerX},${centerY}) rotate(${adjustedAngle})`}
      >
        {isLoading ? (
          <rect
            x='-40'
            y='-10'
            width='80'
            height='20'
            rx='4'
            className='fill-gray-200 animate-pulse'
          />
        ) : (
          association?.description && (
            <g>
              {data?.isUnsavedEdge && (
                <>
                  <rect
                    x={-(association.description.length * 4 + 7)}
                    y='-12'
                    width={association.description.length * 8 + 14}
                    height='24'
                    rx='4'
                    style={{
                      fill: '#fbbf24',
                      filter: 'blur(2px)',
                      opacity: 0.8,
                    }}
                  />
                  <rect
                    x={-(association.description.length * 4 + 6)}
                    y='-11'
                    width={association.description.length * 8 + 12}
                    height='22'
                    rx='4'
                    style={{
                      fill: '#fbbf24',
                      opacity: 0.9,
                    }}
                  />
                </>
              )}
              <rect
                x={-(association.description.length * 4 + 5)}
                y='-10'
                width={association.description.length * 8 + 10}
                height='20'
                rx='4'
                style={{ fill: associationColor }}
                className='transition-colors duration-300'
              />
              <text
                className='text-md !text-foreground'
                dominantBaseline='middle'
                textAnchor='middle'
              >
                {association.description}
              </text>
            </g>
          )
        )}
      </motion.g>
      {children}
    </>
  );
};

export default React.memo(BaseAssociationEdge);
