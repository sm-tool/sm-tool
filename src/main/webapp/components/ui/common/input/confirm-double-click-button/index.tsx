import React from 'react';
import { cn } from '@nextui-org/theme';
import TooltipButton from '@/components/ui/common/display/tooltip-button';
import { ButtonProperties } from '@/components/ui/shadcn/button.tsx';
import { Side } from '@floating-ui/utils';

/**
 * Komponent przycisku wymagający podwójnego kliknięcia do potwierdzenia akcji.
 * Przy pierwszym kliknięciu zmienia tekst na "Are you sure?" i oczekuje na drugie kliknięcie.
 * Kliknięcie poza przyciskiem lub utrata focusu resetuje stan potwierdzenia.
 *
 * @param {Object} props
 * @param {() => void} props.onConfirm - Funkcja wywoływana po drugim kliknięciu (potwierdzeniu)
 * @param {React.ReactNode} props.children - Tekst wyświetlany na przycisku w stanie spoczynku
 * @param {string} [props.className]
 * @param {'outline' | 'default' | 'destructive' | 'ghost' | 'link' | 'secondary'} [props.variant='outline'] - Wariant stylistyczny przycisku
 *
 * @example
 * ```tsx
 * <ConfirmDoubleClickButton
 *   onConfirm={() => handleDeleteAccount()}
 *   variant="destructive"
 * >
 *   Delete thread
 * </ConfirmDoubleClickButton>
 * ```
 */
type ConfirmDoubleClickButtonProperties = {
  className?: string;
  variant?: 'outline';
  onConfirm: () => void;
  children: React.ReactNode;
  side: Side;
  disabledText: string;
} & ButtonProperties;

const ConfirmDoubleClickButton = ({
  className,
  variant = 'outline',
  onConfirm,
  children,
  side,
  disabledText,
  ...properties
}: ConfirmDoubleClickButtonProperties) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  return (
    <TooltipButton
      variant={variant}
      buttonChildren={isConfirming ? 'Are you sure?' : children}
      tooltipDisabled={!properties.disabled}
      tooltipSide={side}
      className={cn(
        'w-text-sm transition-colors duration-200',
        isConfirming &&
          'bg-danger/20 hover:bg-danger/30 text-danger border-danger w-full px-2',
        className,
      )}
      onClick={() => {
        if (isConfirming) {
          onConfirm();
        } else {
          setIsConfirming(true);
        }
      }}
      onBlur={() => setIsConfirming(false)}
      {...properties}
    >
      {disabled => disabled && disabledText}
    </TooltipButton>
  );
};

export default ConfirmDoubleClickButton;
