import React from 'react';
import { FLOW_UNIT_WIDTH } from '@/lib/react-flow/config/scenario-flow-config.ts';
import { useActiveScenario } from '@/features/scenario/queries.ts';
import { useViewport } from '@xyflow/react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/shadcn/context-menu.tsx';
import { Check } from 'lucide-react';
import useDarkMode from '@/hooks/use-dark-mode.tsx';
import {
  formatTimeRelativeToEventIndex,
  isSupportedTimeUnit,
  TimeReferenceMode,
} from '@/lib/react-flow/components/threads-context-menu/format-time-relative-to-event-index.ts';
import { useLocalStorage } from '@/hooks/use-local-storage.ts';

const TimelineCanvas = () => {
  const viewport = useViewport();
  const containerReference = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const scenario = useActiveScenario();

  const [timeMode, setTimeMode] = useLocalStorage<TimeReferenceMode>(
    'timeMode',
    'absolute',
  );

  const { theme } = useDarkMode();

  React.useEffect(() => {
    if (!containerReference.current) return;
    const updateDimensions = () => {
      if (containerReference.current) {
        setDimensions({
          width: containerReference.current.offsetWidth,
          height: containerReference.current.offsetHeight,
        });
      }
    };
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerReference.current);
    updateDimensions();
    return () => {
      if (containerReference.current) {
        resizeObserver.unobserve(containerReference.current);
      }
    };
  }, []);

  const draw = React.useCallback(
    (context: CanvasRenderingContext2D) => {
      const { width, height } = dimensions;

      context.clearRect(0, 0, width, height);
      const visibleStartX = -viewport.x / viewport.zoom;
      const visibleEndX = visibleStartX + width / viewport.zoom;
      const startUnitX = Math.floor(visibleStartX / FLOW_UNIT_WIDTH);
      const endUnitX = Math.ceil(visibleEndX / FLOW_UNIT_WIDTH);

      context.beginPath();
      context.globalAlpha = 0.6;
      context.strokeStyle =
        theme === 'dark' ? 'rgb(224, 224, 224)' : 'rgb(148, 163, 184)';
      context.lineWidth = 1 / viewport.zoom;

      const initialOffset = 20 / viewport.zoom;

      for (let index = startUnitX; index <= endUnitX; index++) {
        const x = index * FLOW_UNIT_WIDTH * viewport.zoom + viewport.x;
        const xWithOffset = index === 0 ? x + initialOffset : x;

        context.moveTo(x, 0);
        context.lineTo(x, height * 0.4);
        context.moveTo(x, height * 0.6);
        context.lineTo(x, height);

        const timeText = formatTimeRelativeToEventIndex(
          index,
          timeMode,
          scenario?.data,
        );
        context.save();
        context.fillStyle = theme === 'dark' ? '#FFFFFF' : '#475569';

        context.globalAlpha = 1;
        const fontSize = Math.min(12 / viewport.zoom, 16);
        context.font = `${fontSize}px Arial`;
        context.textAlign = 'center';
        context.fillText(
          timeText,
          xWithOffset,
          height * 0.5 + 4 / viewport.zoom,
        );

        for (let subIndex = 1; subIndex < 4; subIndex++) {
          const subX = x + (FLOW_UNIT_WIDTH * viewport.zoom * subIndex) / 4;
          context.moveTo(subX, 0);
          context.lineTo(subX, height * 0.2);
          context.moveTo(subX, height * 0.8);
          context.lineTo(subX, height);
        }

        context.restore();
      }
      context.stroke();
    },
    [viewport, dimensions, scenario, theme],
  );

  React.useEffect(() => {
    const canvasElement = containerReference.current?.querySelector('canvas');
    if (canvasElement) {
      const context = canvasElement.getContext('2d');
      if (context) draw(context);
    }
  }, [draw, theme, viewport, dimensions]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={containerReference}
          className='relative w-full h-12 bg-content2'
        >
          {dimensions.width > 0 && dimensions.height > 0 && (
            <canvas
              className='pointer-events-none absolute !bg-content2 top-0 left-0 w-full h-full
                border-divider border-1'
              width={dimensions.width}
              height={dimensions.height}
              ref={canvasReference => {
                if (canvasReference) {
                  const context = canvasReference.getContext('2d');
                  if (context) draw(context);
                }
              }}
            />
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => setTimeMode('absolute')}
          disabled={!isSupportedTimeUnit(scenario.data?.eventUnit || '')}
        >
          <span className='flex items-center'>
            {timeMode === 'absolute' && <Check className='mr-2 h-4 w-4' />}
            Absolute Time
          </span>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => setTimeMode('startRelative')}
          disabled={!isSupportedTimeUnit(scenario.data?.eventUnit || '')}
        >
          <span className='flex items-center'>
            {timeMode === 'startRelative' && <Check className='mr-2 h-4 w-4' />}
            Relative to Start
          </span>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => setTimeMode('endRelative')}
          disabled={!isSupportedTimeUnit(scenario.data?.eventUnit || '')}
        >
          <span className='flex items-center'>
            {timeMode === 'endRelative' && <Check className='mr-2 h-4 w-4' />}
            Relative to End
          </span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TimelineCanvas;
