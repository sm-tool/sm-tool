import { Timeout } from '@/hooks/use-debounce.ts';
import React from 'react';

export interface UsePopoverHoverProperties {
  delay?: number;
  onOpenChange?: (open: boolean) => void;
}

export interface HoverHandlers {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const useHoverDelay = ({
  delay = 200,
  onOpenChange,
}: UsePopoverHoverProperties = {}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const timerReference = React.useRef<Timeout>();

  const getHoverHandlers = (): HoverHandlers => ({
    onMouseEnter: () => {
      timerReference.current = globalThis.setTimeout(() => {
        setIsHovered(true);
        onOpenChange?.(true);
      }, delay);
    },
    onMouseLeave: () => {
      if (timerReference.current) {
        globalThis.clearTimeout(timerReference.current);
      }
    },
  });

  return {
    isHovered,
    setIsHovered,
    getHoverHandlers,
  };
};
