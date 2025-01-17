import { useReactFlow, useViewport } from '@xyflow/react';
import React from 'react';

interface MovingTextProperties {
  positionStartX: number;
  positionXEnd: number;
  children: React.ReactNode;
}

const MovingText = ({
  positionStartX,
  positionXEnd,
  children,
}: MovingTextProperties) => {
  const [textPosition, setTextPosition] = React.useState({ x: 0, y: 0 });
  const viewport = useViewport();
  const textReference = React.useRef<HTMLDivElement>(null);
  const { flowToScreenPosition } = useReactFlow();

  const getOffset = () => {
    if (!textReference.current) return 0;

    const textWidth = textReference.current.offsetWidth;
    const screenCenterX = window.innerWidth / 2;

    const centerOnScreen = flowToScreenPosition({
      x: positionStartX + (positionXEnd - positionStartX) / 2,
      y: 0,
    }).x;

    const startOnScreen = flowToScreenPosition({ x: positionStartX, y: 0 }).x;
    const endOnScreen = flowToScreenPosition({ x: positionXEnd, y: 0 }).x;

    let offset = screenCenterX - centerOnScreen;

    if (offset > endOnScreen - screenCenterX) {
      return endOnScreen - screenCenterX;
    }

    if (offset < startOnScreen - screenCenterX + textWidth) {
      return startOnScreen - screenCenterX + textWidth;
    }

    return offset;
  };

  const calculateTextPosition = React.useCallback(() => {
    setTextPosition({ x: getOffset(), y: 0 });
  }, [positionStartX, positionXEnd, viewport]);

  React.useEffect(() => {
    calculateTextPosition();
  }, [calculateTextPosition, viewport, positionStartX, positionXEnd]);

  return (
    <div
      className='absolute flex justify-center items-center w-full'
      style={{
        transform: `translateX(${textPosition.x}px)`,
        left: `${positionStartX}px`,
        width: `${positionXEnd - positionStartX}px`,
      }}
    >
      <div
        ref={textReference}
        className='flex min-w-0 max-w-5xl overflow-y-scroll animate-appearance-in p-4'
      >
        {children}
      </div>
    </div>
  );
};

export default MovingText;
