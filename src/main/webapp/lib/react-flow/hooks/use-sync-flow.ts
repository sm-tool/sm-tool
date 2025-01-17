import { OnMove, ReactFlowInstance, useReactFlow } from '@xyflow/react';
import {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
} from 'react';

type FlowContextType = {
  mainFlowReference: MutableRefObject<ReactFlowInstance | undefined>;
  timelineFlowReference: MutableRefObject<ReactFlowInstance | undefined>;
};

export const FlowContext = createContext<FlowContextType | null>(null);

type ViewportLimits = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export const useRestrictedViewport = (
  limits: ViewportLimits,
  isTimeline: boolean,
) => {
  const context = useContext(FlowContext);
  if (!context) throw new Error('Missing FlowContext');

  const { setViewport } = useReactFlow();
  const { minX, maxX, minY, maxY } = limits;
  const isSyncing = useRef(false);

  return useCallback<OnMove>(
    (_, viewport) => {
      const isOutOfBounds =
        viewport.x > maxX ||
        viewport.x < minX ||
        viewport.y > maxY ||
        viewport.y < minY;

      if (isOutOfBounds) {
        const newX = Math.min(maxX, Math.max(minX, viewport.x));
        const newY = Math.min(maxY, Math.max(minY, viewport.y));

        void setViewport({
          x: newX,
          y: newY,
          zoom: viewport.zoom,
        });
      }

      if (!isSyncing.current) {
        isSyncing.current = true;
        const otherFlow = isTimeline
          ? context.mainFlowReference.current
          : context.timelineFlowReference.current;
        if (otherFlow) {
          const otherViewport = otherFlow.getViewport();
          void otherFlow.setViewport({
            ...otherViewport,
            x: viewport.x,
          });
          globalThis.requestAnimationFrame(() => {
            void otherFlow.setViewport({
              ...otherFlow.getViewport(),
              zoom: viewport.zoom,
            });
            isSyncing.current = false;
          });
        } else {
          isSyncing.current = false;
        }
      }

      return !isOutOfBounds;
    },
    [setViewport, maxX, maxY, minX, minY, isTimeline],
  );
};
