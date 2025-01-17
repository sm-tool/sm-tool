import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog.tsx';
import { ConfirmDialogConfig } from '@/lib/modal-dialog/types/dialog.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ConfirmDialogContentProperties {
  config: ConfirmDialogConfig;
  onClose: () => void;
}
/**
 * Zawartość dialogu potwierdzenia akcji.
 * Wyświetla dialog z przyciskami Cancel i Confirm oraz opcjonalnym opisem.
 *
 * @param {ConfirmDialogConfig} config - Konfiguracja dialogu zawierająca tytuł, opis, typ przycisku i callback onConfirm
 * @param {() => void} onClose - Funkcja wywoływana przy zamknięciu dialogu
 *
 * @example
 * const config: ConfirmDialogConfig = {
 *   type: 'confirm',
 *   title: 'Usuń element',
 *   description: 'Ta operacja jest nieodwracalna.\nCzy na pewno chcesz usunąć?',
 *   variant: 'destructive',
 *   onConfirm: async () => await deleteItem(id)
 * };
 *
 * <ConfirmDialogContent
 *   config={config}
 *   onClose={() => setOpen(false)}
 * />
 */
const ConfirmDialogContent = ({
  config,
  onClose,
}: ConfirmDialogContentProperties) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await config.onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent>
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </VisuallyHidden>
      <DialogHeader>
        <DialogTitle>{config.title}</DialogTitle>
        {config.description && (
          <DialogDescription className='whitespace-pre-line pt-2'>
            {config.description}
          </DialogDescription>
        )}
      </DialogHeader>
      <DialogFooter>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={config.variant}
          onClick={() => void handleConfirm()}
          disabled={isLoading}
          className='w-24 flex items-center justify-center gap-x-2'
        >
          {isLoading ? <Loader2 className='animate-spin h-4 w-4' /> : 'Confirm'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ConfirmDialogContent;
