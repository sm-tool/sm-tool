import React from 'react';
import { FLOW_UNIT_WIDTH } from '@/lib/react-flow/config/scenario-flow-config.ts';
import { useViewport } from '@xyflow/react';
import { cn } from '@nextui-org/theme';

const PADDING = 40;

const MovingText = ({
  startTime,
  endTime,
  text,
  containerWidth,
  unitWidth = FLOW_UNIT_WIDTH,
  className,
  doNotTakezoomIntoAccount = false,
}: {
  startTime: number;
  endTime: number;
  text: string;
  containerWidth: number;
  className?: string;
  unitWidth?: number;
  doNotTakezoomIntoAccount?: boolean;
}) => {
  const { x: viewportX, zoom } = useViewport();
  const elementWidth = (endTime - startTime) * FLOW_UNIT_WIDTH - 40;
  const textReference = React.useRef<HTMLDivElement>(null);
  const [textWidth, setTextWidth] = React.useState(0);

  const displayText = text?.length === 0 ? 'No description set' : text;

  React.useEffect(() => {
    if (textReference.current) {
      const width = textReference.current.getBoundingClientRect().width;
      setTextWidth(width);
    }
  }, [text]);

  const textPosition = React.useMemo(() => {
    if (elementWidth <= 1024) {
      return elementWidth / 2;
    }
    const paddedElementWidth = elementWidth - PADDING;
    const viewportCenter = doNotTakezoomIntoAccount
      ? -viewportX + containerWidth / 2 - startTime * unitWidth
      : -viewportX / zoom + containerWidth / (2 * zoom) - startTime * unitWidth;
    const halfTextWidth = textWidth / 2;
    const minPosition = +halfTextWidth;
    const maxPosition = paddedElementWidth - halfTextWidth;
    return Math.min(Math.max(viewportCenter, minPosition), maxPosition);
  }, [viewportX, zoom, startTime, elementWidth, textWidth, containerWidth]);

  return (
    <div
      className='relative size-full'
      style={{
        width: elementWidth,
      }}
    >
      <div className='h-full relative'>
        <div
          ref={textReference}
          className='absolute top-1/2 max-w-5xl min-w-0 flex h-full overflow-y-auto overflow-x-hidden
            w-fit'
          style={{
            left: textPosition,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className={cn(className, text?.length === 0 && 'text-default-400')}
          >
            <span className='whitespace-normal break-words'>{displayText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovingText;
