import { useMouse } from '@/hooks/use-mouse.ts';
import React from 'react';

import { Tooltip } from '@radix-ui/react-tooltip';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';

const TooltipMouseFollow = ({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { ref, x, y } = useMouse<HTMLDivElement>();

  const tooltipPosition = React.useMemo(
    () => ({
      style: {
        left: `${x}px`,
        top: `${y}px`,
      },
    }),
    [x, y],
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={600}>
        <TooltipTrigger asChild>
          <div ref={ref} className='relative w-full h-full'>
            {trigger}
          </div>
        </TooltipTrigger>
        <TooltipContent
          {...tooltipPosition}
          hideWhenDetached
          className='fixed duration-0 w-64 -translate-x-1/2 -translate-y-[120%]'
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipMouseFollow;
