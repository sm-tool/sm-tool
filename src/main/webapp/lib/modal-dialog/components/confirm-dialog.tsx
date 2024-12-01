import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog.tsx';
import { ConfirmDialogConfig } from '@/lib/modal-dialog/types/dialog.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { AppError, ErrorLevel } from '@/types/errors.ts';

interface ConfirmDialogContentProperties {
  config: ConfirmDialogConfig;
  onClose: () => void;
}

const ConfirmDialogContent = ({
  config,
  onClose,
}: ConfirmDialogContentProperties) => {
  const handleConfirm = async () => {
    try {
      await config.onConfirm();
      onClose();
    } catch {
      throw new AppError('Error while confirming the action', ErrorLevel.ERROR);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{config.title}</DialogTitle>
        {config.description && (
          <DialogDescription>{config.description}</DialogDescription>
        )}
      </DialogHeader>
      <DialogFooter>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button variant={config.variant} onClick={void handleConfirm}>
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ConfirmDialogContent;
