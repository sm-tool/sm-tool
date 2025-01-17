import {
  HoverHandlers,
  useHoverDelay,
  UsePopoverHoverProperties,
} from '@/components/ui/common/display/popover-delayed/use-hover-delay.ts';
import React from 'react';

interface PopoverDelayed extends UsePopoverHoverProperties {
  children: (properties: {
    isHovered: boolean;
    setIsHovered: (value: boolean) => void;
    hoverHandlers: HoverHandlers;
  }) => React.ReactNode;
}

const PopoverDelayed = ({ children }: PopoverDelayed) => {
  const { isHovered, setIsHovered, getHoverHandlers } = useHoverDelay();

  return (
    <>
      {children({
        isHovered,
        setIsHovered,
        hoverHandlers: getHoverHandlers(),
      })}
    </>
  );
};

export default PopoverDelayed;
