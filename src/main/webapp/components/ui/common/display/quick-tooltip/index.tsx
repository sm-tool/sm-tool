import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';

interface QuickTooltipProperties {
  content: React.ReactElement;
  children: React.ReactNode;
}

const QuickTooltip = ({ content, children }: QuickTooltipProperties) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default QuickTooltip;
