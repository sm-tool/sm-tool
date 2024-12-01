import { QdsPhase } from '@/features/phase/entity.ts';
import { Node, NodeProps, useViewport } from '@xyflow/react';
import getPhaseFlowRect from '@/components/feature/page/scenario/scenarioFlow/utils/get-phase-flow-rect.ts';
import { memo, useEffect, useMemo, useRef } from 'react';

const xPADDING = 20;

const PhaseNode = ({ data, positionAbsoluteX }: NodeProps<Node<QdsPhase>>) => {
  const nodeWidth = data.endTime - data.startTime;
  const { x: viewportX } = useViewport(); // TODO: Dodać wsparcie do zooma
  const textReference = useRef<HTMLDivElement>(null);
  const textWidthReference = useRef(0);
  const { height: containerHeight } = getPhaseFlowRect();

  useEffect(() => {
    if (textReference.current) {
      textWidthReference.current =
        textReference.current.getBoundingClientRect().width;
    }
  }, [data.title]);

  const textPosition = useMemo(() => {
    const { width: containerWidth } = getPhaseFlowRect();
    const viewportCenter = -viewportX + containerWidth / 2 - positionAbsoluteX;

    const halfTextWidth = textWidthReference.current / 2;

    const minPosition = xPADDING + halfTextWidth;
    const maxPosition = nodeWidth - xPADDING - halfTextWidth;

    return Math.min(Math.max(viewportCenter, minPosition), maxPosition);
  }, [positionAbsoluteX, viewportX, nodeWidth, textWidthReference.current]); // TODO: ZAINSTALUJ eslint-hook bo na pewno czegoś zapomniałem o tej 02:14 w nocy

  return (
    <div
      className='relative bg-background border h-max'
      style={{ width: nodeWidth, height: containerHeight }}
    >
      <div className='h-full relative overflow-hidden'>
        <div
          ref={textReference}
          className='absolute top-1/2 -translate-y-1/2 px-4 py-2'
          style={{
            left: textPosition,
            transform: 'translateX(-50%) translateY(-50%)',
          }}
        >
          <span className='whitespace-nowrap font-medium'>{data.title}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(PhaseNode);
