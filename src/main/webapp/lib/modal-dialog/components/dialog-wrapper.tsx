import React from 'react';
import {
  AutoFormDialogConfig,
  BaseDialogType,
  ConfirmDialogConfig,
  DialogConfig,
  FormDialogConfig,
  WizardFormDialogConfig,
} from '@/lib/modal-dialog/types/dialog.ts';
import { Dialog } from '@/components/ui/shadcn/dialog.tsx';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import ConfirmDialogContent from './confirm-dialog';
import { DialogContext } from '../context';
import FormDialogContent from '@/lib/modal-dialog/components/form-dialog.tsx';
import { FieldValues } from 'react-hook-form';
import WizardDialogContent from '@/lib/modal-dialog/components/wizard-dialog.tsx';
/**
 * Komponent opakowujący system dialogów, zarządzający ich stanem i typami.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 *
 * Udostępnia poprzez DialogContext następujące metody:
 * - open: funkcja otwierająca dialog, przyjmuje obiekt konfiguracji dialogu
 * - close: funkcja zamykająca aktywny dialog
 * - isOpen: boolean określający czy jakikolwiek dialog jest otwarty
 * - currentConfig: aktualna konfiguracja otwartego dialogu
 * - isActiveDialog: funkcja sprawdzająca czy dany dialog jest aktywny (na podstawie ID)
 *
 * Obsługiwane typy dialogów:
 * - autoForm: automatycznie generowany formularz
 * - form: własny formularz
 * - wizard: formularz wieloetapowy
 * - confirm: dialog potwierdzenia
 *
 * @example
 * <DialogWrapper>
 *   <Button
 *     onClick={() => {
 *       dialogContext.open({
 *         type: 'confirm',
 *         title: 'Delete Item',
 *         description: 'Are you sure?',
 *         onConfirm: () => handleDelete()
 *       });
 *     }}
 *   >
 *     Delete
 *   </Button>
 * </DialogWrapper>
 */
const DialogWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogStack, setDialogStack] = React.useState<string[]>([]);
  // eslint-disable-next-line -- ts aint smart enough
  const [currentConfig, setCurrentConfig] = React.useState<DialogConfig<any>>();

  const open = React.useCallback(<TData,>(config: DialogConfig<TData>) => {
    setCurrentConfig(config);
    setIsOpen(true);
    setDialogStack(previous => [...previous, config.title]);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    setCurrentConfig(undefined);
    setDialogStack(previous => previous.slice(0, -1));
  }, []);

  const isActiveDialog = React.useCallback(
    (dialogId: string) => {
      return dialogStack.at(-1) === dialogId;
    },
    [dialogStack],
  );

  const value = React.useMemo(
    () => ({ open, close, isOpen, currentConfig, isActiveDialog }),
    [open, close, isOpen, currentConfig, isActiveDialog],
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
        {(currentConfig?.type as BaseDialogType) === 'form' && (
          <FormDialogContent
            config={currentConfig as FormDialogConfig<FieldValues>}
            onClose={close}
          />
        )}
        {(currentConfig?.type as BaseDialogType) === 'wizard' && (
          <WizardDialogContent
            config={currentConfig as WizardFormDialogConfig<FieldValues>}
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
