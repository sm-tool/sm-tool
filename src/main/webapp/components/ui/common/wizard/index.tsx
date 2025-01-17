import {
  Control,
  FieldValues,
  useForm,
  UseFormRegister,
} from 'react-hook-form';
import { AnyZodObject, z, ZodError } from 'zod';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { CheckIcon, Loader2 } from 'lucide-react';
import { cn } from '@nextui-org/theme';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Form } from '@/components/ui/shadcn/form.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/ui/shadcn/alert.tsx';
import React from 'react';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';

type IconComponent = React.ComponentType<{ className?: string }>;

export interface WizardStep {
  id: number;
  title: string;
  description?: string;
  fields: string[];
  icon?: IconComponent;
  component: (
    register: UseFormRegister<FieldValues>,
    formValues: Record<string, unknown>,
    control: Control,
  ) => React.ReactNode;
  validationSchema: z.ZodSchema;
  hideErrorMessage?: boolean;
}

interface WizardProperties {
  steps: WizardStep[];
  onSubmit: (data: unknown) => void;
  onCancel: () => void;
  defaultValues?: Record<string, unknown>;
  isLoading?: boolean;
}
/**
 * Komponent formularza wieloetapowego (wizard) z nawigacją między krokami.
 *
 * @param {Object} props
 * @param {WizardStep[]} props.steps - Tablica kroków formularza, gdzie każdy krok zawiera:
 *   - id: unikalny identyfikator kroku
 *   - title: tytuł wyświetlany nad formularzem
 *   - description?: opcjonalny opis kroku
 *   - fields: lista nazw pól formularza w danym kroku
 *   - icon?: opcjonalna ikona wyświetlana w nawigacji
 *   - component: funkcja renderująca zawartość formularza, otrzymuje register, formValues i control z react-hook-form
 *   - validationSchema: schemat walidacji Zod dla pól w danym kroku
 *   - hideErrorMessage?: flaga ukrywająca komunikaty błędów
 * @param {(data: unknown) => void} props.onSubmit - Funkcja wywoływana po zatwierdzeniu ostatniego kroku
 * @param {() => void} props.onCancel - Funkcja wywoływana przy anulowaniu formularza
 * @param {Record<string, unknown>} props.defaultValues - Opcjonalne wartości początkowe formularza
 * @param {boolean} props.isLoading - Flaga określająca czy formularz jest w trakcie przetwarzania
 *
 * @example
 * <Wizard
 *   steps={[
 *     {
 *       id: 1,
 *       title: "Personal Info",
 *       fields: ["firstName", "lastName"],
 *       component: (register, values, control) => (
 *         <div>
 *           <input {...register("firstName")} />
 *           <input {...register("lastName")} />
 *         </div>
 *       ),
 *       validationSchema: z.object({
 *         firstName: z.string(),
 *         lastName: z.string()
 *       })
 *     },
 *     // ... more steps
 *   ]}
 *   onSubmit={async (data) => {
 *     await saveData(data);
 *   }}
 *   onCancel={() => setIsOpen(false)}
 *   defaultValues={{ firstName: "", lastName: "" }}
 * />
 */
export function Wizard({
  steps,
  onSubmit,
  onCancel,
  defaultValues,
  isLoading,
}: WizardProperties) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const form = useForm({
    defaultValues,
    resolver: zodResolver(
      steps.reduce(
        (accumulator, step) =>
          accumulator.merge(step.validationSchema as AnyZodObject),
        z.object({}),
      ),
    ),
  });

  const formValues = form.watch();
  const currentStep = steps[activeStep];

  const handleNext = async () => {
    const isValid = await form.trigger(currentStep.fields);

    if (isValid) {
      if (activeStep === steps.length - 1) {
        await form.handleSubmit(onSubmit)();
      } else {
        setCompletedSteps(previous => {
          return [...new Set([...previous, activeStep])];
        });
        setActiveStep(previous => previous + 1);
      }
    }
  };

  const handleBack = () => {
    const nextSteps = steps.slice(activeStep);
    const fieldsToReset = nextSteps.flatMap(step => step.fields ?? []);

    form.reset({
      ...form.getValues(),
      ...Object.fromEntries(fieldsToReset.map(field => [field, undefined])),
    });

    setCompletedSteps(previous =>
      previous.filter(stepIndex => stepIndex < activeStep - 1),
    );

    setActiveStep(previous => previous - 1);
  };

  const jumpToStep = (stepIndex: number) => {
    if (stepIndex < activeStep) {
      const stepsToReset = steps.slice(stepIndex + 1);
      const fieldsToReset = stepsToReset.flatMap(step => step.fields ?? []);

      form.reset({
        ...form.getValues(),
        ...Object.fromEntries(fieldsToReset.map(field => [field, undefined])),
      });

      setCompletedSteps(previous => previous.filter(step => step <= stepIndex));
    }
    setActiveStep(stepIndex);
  };

  return (
    <Form {...form}>
      <Card className='w-full mx-auto min-w-96 p-6 border-none'>
        <div className='space-y-6'>
          <div className='w-full'>
            <div className='flex justify-between relative'>
              <div className='absolute top-1/2 left-0 right-0 h-0.5 bg-default-200' />
              <div className='absolute top-1/2 left-0 right-0 h-0.5'>
                <div
                  className='h-full bg-success transition-all duration-300'
                  style={{
                    width: `${(completedSteps.length / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>
              <div className='flex justify-between w-full relative z-10'>
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.id}>
                      <Button
                        variant={
                          completedSteps.includes(index)
                            ? 'success'
                            : 'secondary'
                        }
                        size='icon'
                        disabled={
                          index > activeStep + 1 ||
                          (index > 0 && !completedSteps.includes(index - 1))
                        }
                        onClick={() => jumpToStep(index)}
                        className={cn(
                          'h-10 w-10 rounded-full',
                          !completedSteps.includes(index) &&
                            activeStep !== index &&
                            '!opacity-100 disabled:bg-default-100',
                          activeStep === index && 'border-primary-400 border-2',
                        )}
                      >
                        {completedSteps.includes(index) ? (
                          <CheckIcon className='h-4 w-4' />
                        ) : StepIcon ? (
                          <StepIcon className='h-4 w-4' />
                        ) : (
                          index + 1
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className='text-center space-y-1.5 w-full flex flex-col items-center justify-center'>
            <h2 className='text-lg font-semibold tracking-tight'>
              {currentStep.title}
            </h2>
            {currentStep.description && (
              <p className='text-sm text-default-600 w-full pb-2 max-w-[700px]'>
                {currentStep.description.trim()}
              </p>
            )}
          </div>
          {currentStep.component(form.register, formValues, form.control)}
          <ScrollArea className='max-h-32'>
            {!currentStep.hideErrorMessage &&
              Object.entries(form.formState.errors).map(([field, error]) => {
                const errorMessage = error?.message;
                if (!errorMessage) return;

                const messages =
                  typeof errorMessage === 'object' && 'errors' in errorMessage
                    ? (errorMessage as ZodError).errors.map(
                        error => error.message,
                      )
                    : Array.isArray(errorMessage)
                      ? errorMessage
                      : [errorMessage];

                return messages.map((message: string, index) => (
                  <Alert key={`${field}-${index}`} variant='danger'>
                    {message?.toString()}
                  </Alert>
                ));
              })}
          </ScrollArea>
          <div className='flex justify-between pt-4'>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <div className='space-x-2'>
              <Button
                variant='outline'
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Tooltip open={!!form.formState.errors['root']}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNext}
                    disabled={isLoading || !!form.formState.errors['root']}
                    className='w-24'
                  >
                    {isLoading ? (
                      <Loader2 className='animate-spin h-4 w-4' />
                    ) : activeStep === steps.length - 1 ? (
                      'Finish'
                    ) : (
                      'Next'
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side='bottom'
                  className='bg-transparent p-0 border-0 bg-content1 rounded-xl'
                >
                  <Alert
                    variant='danger'
                    className='flex gap-x-2 w-full rounded-xl'
                  >
                    {form.formState.errors['root']?.message ||
                      'Please fix the errors before proceeding'}
                  </Alert>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </Form>
  );
}
