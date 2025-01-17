import { AutoFormDialogConfig } from '@/lib/modal-dialog/types/dialog.ts';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog.tsx';
import { AutoForm } from '@/components/ui/shadcn/auto-form';
import { ZodProvider } from '@autoform/zod';
import React from 'react';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Loader2, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useLocalStorage } from '@/hooks/use-local-storage.ts';

interface AutoFormDialogContentProperties<
  TData extends Record<string, unknown>,
> {
  config: AutoFormDialogConfig<TData>;
  onClose: () => void;
}
/**
 * Zawartość dialogu z automatycznie generowanym formularzem na podstawie schematu Zod.
 * Dialog posiada możliwość przełączania między standardowym a rozszerzonym widokiem formularza.
 *
 * @param {AutoFormDialogConfig<TData>} config - Konfiguracja dialogu zawierająca schemat, tytuł, opis i callback onSubmit
 * @param {() => void} onClose - Funkcja wywoływana przy zamknięciu dialogu
 *
 * @example
 * const config: AutoFormDialogConfig<UserData> = {
 *   type: 'autoForm',
 *   title: 'Dodaj użytkownika',
 *   description: 'Wprowadź dane nowego użytkownika',
 *   zodObjectToValidate: userSchema,
 *   defaultValues: { name: '', email: '' },
 *   onSubmit: async (data) => await createUser(data)
 * };
 *
 * <AutoFormDialogContent
 *   config={config}
 *   onClose={() => setOpen(false)}
 * />
 */
export const AutoFormDialogContent = <TData extends Record<string, unknown>>({
  config,
  onClose,
}: AutoFormDialogContentProperties<TData>) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUsingExpandedForms, setIsUsingExpandedForms] = useLocalStorage(
    'isUsingExpandedForm',
    false,
  );
  const submitReference = React.useRef<HTMLButtonElement | null>(null);

  const handleSubmit = async (data: TData) => {
    setIsLoading(true);
    try {
      await config.onSubmit(data);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent
      className={`${isUsingExpandedForms ? 'max-w-[800px]' : 'max-w-[500px]'} w-full @container`}
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </VisuallyHidden>
      <DialogHeader className='flex flex-row items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          className='mt-2'
          onClick={() => setIsUsingExpandedForms(!isUsingExpandedForms)}
        >
          {isUsingExpandedForms ? (
            <PanelRightOpen className='size-5' />
          ) : (
            <PanelRightClose className='size-5' />
          )}
        </Button>
        <div>
          <DialogTitle>{config.title}</DialogTitle>
          {config.description && (
            <DialogDescription>{config.description}</DialogDescription>
          )}
        </div>
      </DialogHeader>
      <div className='py-4'>
        <AutoForm
          schema={new ZodProvider(config.zodObjectToValidate)}
          values={config.data}
          onSubmit={handleSubmit}
          defaultValues={config.defaultValues}
        >
          <div className='flex flex-row justify-between w-full gap-2 mt-6'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              ref={submitReference}
              type='submit'
              disabled={isLoading}
              className='w-24 flex items-center justify-center gap-x-2'
            >
              {isLoading ? (
                <Loader2 className='animate-spin h-4 w-4' />
              ) : (
                'Confirm'
              )}
            </Button>
          </div>
        </AutoForm>
      </div>
    </DialogContent>
  );
};
