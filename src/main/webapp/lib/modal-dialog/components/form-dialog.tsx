import { AppError, ErrorLevel } from '@/types/errors.ts';
import { AutoFormDialogConfig } from '@/lib/modal-dialog/types/dialog.ts';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog.tsx';
import { AutoForm } from '@/components/ui/shadcn/auto-form';
import { ZodProvider } from '@autoform/zod';

interface AutoFormDialogContentProperties<
  TData extends Record<string, unknown>,
> {
  config: AutoFormDialogConfig<TData>;
  onClose: () => void;
}

export const AutoFormDialogContent = <TData extends Record<string, unknown>>({
  config,
  onClose,
}: AutoFormDialogContentProperties<TData>) => {
  const handleSubmit = async (data: TData) => {
    try {
      await config.onSubmit(data);
      onClose();
    } catch {
      throw new AppError('Error submitting form', ErrorLevel.ERROR);
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
      <AutoForm
        schema={new ZodProvider(config.zodObjectToValidate)}
        values={config.data}
        onSubmit={handleSubmit}
        withSubmit
      />
    </DialogContent>
  );
};
