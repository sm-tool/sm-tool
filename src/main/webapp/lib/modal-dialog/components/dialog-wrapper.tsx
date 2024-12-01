import React from 'react';
import {
  AutoFormDialogConfig,
  BaseDialogType,
  ConfirmDialogConfig,
  DialogConfig,
} from '@/lib/modal-dialog/types/dialog.ts';
import { Dialog } from '@/components/ui/shadcn/dialog.tsx';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/form-dialog.tsx';
import ConfirmDialogContent from './confirm-dialog';
import { DialogContext } from '../context';

const DialogWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  // eslint-disable-next-line -- ts aint smart enough
  const [currentConfig, setCurrentConfig] = React.useState<DialogConfig<any>>();

  const open = React.useCallback(<TData,>(config: DialogConfig<TData>) => {
    setCurrentConfig(config);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    setCurrentConfig(undefined);
  }, []);

  const value = React.useMemo(
    () => ({ open, close, isOpen, currentConfig }),
    [open, close, isOpen, currentConfig],
  );

  return (
    <DialogContext.Provider value={value}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {(currentConfig?.type as BaseDialogType) === 'autoForm' && (
          <AutoFormDialogContent
            config={
              currentConfig as AutoFormDialogConfig<Record<string, unknown>>
            }
            onClose={close}
          />
        )}
        {(currentConfig?.type as BaseDialogType) === 'confirm' && (
          <ConfirmDialogContent
            config={currentConfig as ConfirmDialogConfig}
            onClose={close}
          />
        )}
      </Dialog>
      {children}
    </DialogContext.Provider>
  );
};

export default DialogWrapper;
