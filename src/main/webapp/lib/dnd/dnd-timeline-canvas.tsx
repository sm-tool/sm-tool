import { DND_ROW_HEIGHT, DND_UNIT_SIZE } from '@/lib/dnd/dnd-timeline.tsx';
import React from 'react';

/**
 * Komponent renderujący siatkę osi czasu z oznaczeniami czasowymi przy użyciu Canvas.
 *
 * @param {Object} props
 * @param {number} props.timeUnits - Liczba jednostek czasu do wyświetlenia na osi
 * @param {number} props.eventDuration - Długość pojedynczej jednostki czasowej w minutach
 *
 * @example
 * <TimelineCanvas
 *   timeUnits={48} // 48 jednostek czasowych
 *   eventDuration={30} // 30 minut na jednostkę
 * />
 */
const TimelineCanvas = ({
  timeUnits,
  eventDuration,
}: {
  timeUnits: number;
  eventDuration: number;
}) => {
  const canvasReference = React.useRef<HTMLCanvasElement>(null);
  const draw = React.useCallback(
    (context: CanvasRenderingContext2D) => {
      const canvas = canvasReference.current;
      if (!canvas) return;
      const extraWidth = window.innerWidth;
      canvas.width = timeUnits * DND_UNIT_SIZE + extraWidth;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.strokeStyle = 'rgba(224, 224, 224, 0.3)';
      context.lineWidth = 1;
      for (let index = 0; index * DND_UNIT_SIZE <= canvas.width; index++) {
        const x = index * DND_UNIT_SIZE;
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.save();
        context.fillStyle = '#FFF';
        context.font = '10px Arial';
        context.fillText(`${index * eventDuration}min`, x + 2, 10);
        context.restore();
      }
      context.stroke();
    },
    [timeUnits, eventDuration],
  );

  React.useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) return;
    canvas.width = (timeUnits + 10) * DND_UNIT_SIZE;
    canvas.height = DND_ROW_HEIGHT + 10;
    const context = canvas.getContext('2d');
    if (!context) return;
    draw(context);
  }, [timeUnits, draw]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0 }}>
      <canvas
        ref={canvasReference}
        className='absolute top-0 left-0 animate-animate-fade-out'
      />

      <div
        className='absolute top-0 w-[100vw] bg-red-700/40 z-10'
        style={{
          left: `${timeUnits * DND_UNIT_SIZE}px`,
          height: DND_ROW_HEIGHT + 10,
        }}
        // TODO: refactor into component
        onClick={event => {
          const bubble = document.createElement('div');
          bubble.className =
            'absolute bg-content3 bg-border-1 p-2 rounded-md shadow-md animate-fade-out z-50';
          bubble.style.left = `${event.clientX}px`;
          bubble.style.top = `${event.clientY}px`;
          bubble.textContent = 'Phase should not be created in overtime';
          document.body.append(bubble);

          globalThis.setTimeout(() => {
            bubble.remove();
          }, 2000);
        }}
      />
    </div>
  );
};

export default TimelineCanvas;
