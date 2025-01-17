import {
  Button,
  type ButtonProperties,
} from '@/components/ui/shadcn/button.tsx';
import React from 'react';
import { cn } from '@nextui-org/theme';

interface ConfirmDoubleClickButtonProperties
  extends Omit<ButtonProperties, 'onClick' | 'onConfirm'> {
  onConfirm: () => void;
  children: React.ReactNode;
}

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
const ConfirmDoubleClickButton = React.forwardRef<
  HTMLDivElement,
  ConfirmDoubleClickButtonProperties
>(
  (
    { className, variant = 'outline', onConfirm, children, ...properties },
    reference,
  ) => {
    const [isConfirming, setIsConfirming] = React.useState(false);

    return (
      <Button
        // @ts-expect-error -- głupoty gada
        ref={reference}
        type='button'
        variant={variant}
        className={cn(
          'text-sm transition-colors duration-200',
          isConfirming &&
            'bg-danger/20 hover:bg-danger/30 text-danger border-danger',
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
        {isConfirming ? 'Are you sure?' : children}
      </Button>
    );
  },
);

ConfirmDoubleClickButton.displayName = 'ConfirmDoubleClickButton';

export default ConfirmDoubleClickButton;
