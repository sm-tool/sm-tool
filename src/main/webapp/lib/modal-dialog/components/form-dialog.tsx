import { FormDialogConfig } from '@/lib/modal-dialog/types/dialog.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog.tsx';
import { Form } from '@/components/ui/shadcn/form.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Loader2 } from 'lucide-react';
import React from 'react';
/**
 * Komponent renderujący zawartość formularza w oknie dialogowym.
 *
 * @param {Object} props
 * @param {FormDialogConfig<TData>} props.config - Konfiguracja formularza zawierająca:
 *   - title: tytuł okna dialogowego
 *   - description: opis formularza
 *   - schema: schemat walidacji Zod
 *   - defaultValues: domyślne wartości formularza
 *   - data: dane formularza (alternatywa dla defaultValues)
 *   - onSubmit: funkcja wywoływana po zatwierdzeniu formularza, otrzymuje dane formularza jako parametr
 *   - renderForm: funkcja renderująca pola formularza, otrzymuje methods z react-hook-form
 * @param {() => void} props.onClose - Funkcja wywoływana przy zamknięciu okna dialogowego
 *
 * @example
 * const config = {
 *   title: "Add User",
 *   description: "Fill in user details",
 *   schema: userSchema,
 *   defaultValues: { name: "", email: "" },
 *   onSubmit: async (data) => {
 *     await saveUser(data);
 *   },
 *   renderForm: (methods) => (
 *     <>
 *       <FormField name="name" label="Name" />
 *       <FormField name="email" label="Email" />
 *     </>
 *   )
 * };
 *
 * <FormDialogContent
 *   config={config}
 *   onClose={() => setIsOpen(false)}
 * />
 */
const FormDialogContent = <TData extends Record<string, unknown>>({
  config,
  onClose,
}: {
  config: FormDialogConfig<TData>;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const methods = useForm<TData>({
    resolver: zodResolver(config.schema),
    // @ts-expect-error -- po coś jest ten || TODO
    defaultValues: config.defaultValues || config.data,
  });

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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{config.title}</DialogTitle>
        <DialogDescription>{config.description}</DialogDescription>
      </DialogHeader>
      <div className='py-4'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            {config.renderForm(methods)}
            <div className='flex flex-row justify-between w-full gap-2 mt-6'>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button
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
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default FormDialogContent;
