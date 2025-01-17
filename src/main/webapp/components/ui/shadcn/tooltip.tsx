'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from '@nextui-org/theme';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...properties }, reference) => (
  <TooltipPrimitive.Content
    ref={reference}
    sideOffset={sideOffset}
    className={cn(
      `z-50 overflow-hidden rounded-md border border-content4 bg-content3 px-3 py-1.5
      text-sm text-foreground shadow-sm animate-in fade-in-0 zoom-in-95
      data-[state=closed]:animate-out data-[state=closed]:fade-out-0
      data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2
      data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
      data-[side=top]:slide-in-from-bottom-2 transition-all duration-300
      ease-[cubic-bezier(0.34,1.56,0.64,1)]`,
      className,
    )}
    {...properties}
  />
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
