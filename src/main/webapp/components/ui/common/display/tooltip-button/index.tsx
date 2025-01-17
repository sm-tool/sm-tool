import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import { Button, ButtonProperties } from '@/components/ui/shadcn/button.tsx';
import { Side } from '@floating-ui/utils';

const TooltipButton = ({
  children,
  buttonChildren,
  tooltipClassName,
  className = '',
  variant = 'ghost',
  size = 'icon',
  disabled = false,
  tooltipDisabled = false,
  tooltipSide = 'top',
  ...buttonProperties
}: Omit<ButtonProperties, 'children'> & {
  children: (disabled: boolean) => React.ReactNode;
  buttonChildren: React.ReactNode;
  tooltipClassName?: string;
  tooltipDisabled?: boolean;
  disabled?: boolean;
  tooltipSide?: Side;
}) => {
  const ButtonElement = (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      className={`text-destructive hover:text-destructive/90 ${className}`}
      {...buttonProperties}
    >
      {buttonChildren}
    </Button>
  );

  if (tooltipDisabled) {
    return ButtonElement;
  }

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <div className='inline-block'>{ButtonElement}</div>
      </TooltipTrigger>
      <TooltipContent className={tooltipClassName} side={tooltipSide}>
        {children(disabled)}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipButton;
