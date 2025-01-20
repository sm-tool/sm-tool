import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Import } from 'lucide-react';
import WizardDialogContent from '@/lib/modal-dialog/components/wizard-dialog.tsx';
import { z } from '@/lib/zod-types/hiden-field.types.ts';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form.tsx';
import { Controller } from 'react-hook-form';
import ScenarioSelector from '@/features/scenario/components/scenario-selector';
import React from 'react';
import {
  ObjectTemplateAssigment,
  objectTemplateAssigmentDTO,
} from '@/features/object-template/types.ts';
import ObjectTemplateSelector from '@/features/object-template/components/object-template-selector';
import { useObjectTemplateAssigment } from '@/features/object-template/queries.ts';

const ImportButtonForObjectTemplates = () => {
  const [isOpened, setIsOpened] = React.useState(false);
  const query = useObjectTemplateAssigment();

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger>
        <Button
          variant='outline'
          className='flex gap-x-2 w-full'
          onClick={() => setIsOpened(true)}
        >
          <Import />
          Import type from other scenario
        </Button>
      </DialogTrigger>
      <WizardDialogContent<ObjectTemplateAssigment>
        className='min-w-fit w-fit max-w-none overflow-visible'
        config={{
          title: 'Import templates',
          type: 'wizard',
          steps: [
            {
              id: 1,
              title: 'Select scenario',
              description: 'To import types select scenario to select from',
              fields: ['scenarioId'],
              validationSchema: z.object({
                scenarioId: z.coerce.number().min(1),
              }),
              component: (_, __, control) => (
                <FormItem>
                  <FormLabel>
                    Selected scenario <span className='text-primary'> *</span>
                  </FormLabel>
                  <FormControl>
                    <Controller
                      control={control}
                      name='scenarioId'
                      render={({ field }) => (
                        <ScenarioSelector
                          value={field.value as number}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ),
            },
            {
              id: 2,
              title: 'Select templates',
              description:
                'Select templates to import, keep in mind that if this scenario does not have type that template requires it shall be imported as well',
              validationSchema: objectTemplateAssigmentDTO,
              fields: ['assign'],
              component: (_, formValues, control) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Controller
                        control={control}
                        name='assign'
                        defaultValue={[]}
                        render={({ field }) => (
                          <ObjectTemplateSelector
                            scenarioId={formValues.scenarioId as number}
                            value={field.value as number[]}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </FormControl>
                  </FormItem>
                );
              },
            },
          ],
          onSubmit: async data => {
            // @ts-expect-error -- type does not support different input vs output
            await query.mutateAsync(data);
            setIsOpened(false);
          },
        }}
        onClose={() => {
          setIsOpened(false);
        }}
      />
    </Dialog>
  );
};

export default ImportButtonForObjectTemplates;
