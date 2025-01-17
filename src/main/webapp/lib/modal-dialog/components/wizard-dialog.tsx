import { WizardFormDialogConfig } from '@/lib/modal-dialog/types/dialog.ts';
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog.tsx';
import { Wizard } from '@/components/ui/common/wizard';
import { cn } from '@nextui-org/theme';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
/**
 * Komponent zawartości dialogu dla formularza wieloetapowego (wizard).
 *
 * @param {Object} props
 * @param {WizardFormDialogConfig<TData>} props.config - Konfiguracja formularza zawierająca:
 *   - title: tytuł okna dialogowego
 *   - description?: opcjonalny opis formularza
 *   - steps: tablica kroków formularza
 *   - defaultValues?: domyślne wartości formularza
 *   - onSubmit: funkcja wywoływana po ukończeniu wszystkich kroków
 * @param {() => void} props.onClose - Funkcja wywoływana przy zamknięciu dialogu
 * @param {string} props.className
 *
 * @example
 * const wizardConfig = {
 *   title: "Create Account",
 *   description: "Complete all steps to create your account",
 *   steps: [
 *     {
 *       id: 1,
 *       title: "Basic Info",
 *       fields: ["email", "password"],
 *       component: (register, values, control) => (
 *         <div>
 *           <input {...register("email")} />
 *           <input {...register("password")} type="password" />
 *         </div>
 *       ),
 *       validationSchema: basicInfoSchema
 *     }
 *   ],
 *   onSubmit: async (data) => {
 *     await createAccount(data);
 *   }
 * };
 *
 * <WizardDialogContent
 *   config={wizardConfig}
 *   onClose={() => setOpen(false)}
 *   className="max-w-2xl"
 * />
 */
const WizardDialogContent = <TData extends Record<string, unknown>>({
  config,
  onClose,
  className,
}: {
  config: WizardFormDialogConfig<TData>;
  onClose: () => void;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

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
    <DialogContent className={cn(className)}>
      <DialogHeader>
        <DialogTitle>{config.title}</DialogTitle>
        {config.description && (
          <DialogDescription>{config.description}</DialogDescription>
        )}
      </DialogHeader>
      <VisuallyHidden>
        <DialogDescription></DialogDescription>
      </VisuallyHidden>
      <Wizard
        steps={config.steps}
        // @ts-expect-error -- typed too specifically
        onSubmit={handleSubmit}
        defaultValues={config.defaultValues}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </DialogContent>
  );
};

export default WizardDialogContent;
