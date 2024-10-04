import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { CancelButton } from '@/components/ui/common/buttons/cancel';
import { ComponentType, ReactNode } from 'react';

interface WithDialogProperties {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: () => Promise<void>;
}

export const withDialog = <T extends object>(
  WrappedComponent: ComponentType<T>,
) => {
  return function WithDialog({
    open,
    onClose,
    title,
    ...properties
  }: WithDialogProperties & T) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <WrappedComponent {...(properties as T)} />
          <DialogFooter>
            <CancelButton onClick={onClose} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
};
