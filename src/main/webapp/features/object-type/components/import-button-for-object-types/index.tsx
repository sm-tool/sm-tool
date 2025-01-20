import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog';
import React from 'react';
import WizardDialogContent from '@/lib/modal-dialog/components/wizard-dialog.tsx';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import {
  ObjectTypeAssigment,
  objectTypeAssigmentRequestDTO,
} from '@/features/object-type/types.ts';
import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { Controller } from 'react-hook-form';
import ScenarioSelector from '@/features/scenario/components/scenario-selector';
import { Import } from 'lucide-react';
import ObjectTypeSelector from '@/features/object-type/components/object-type-selector';
import { useObjectTypeAssigment } from '@/features/object-type/queries.ts';

const ImportButtonForObjectTypes = () => {
  const [isOpened, setIsOpened] = React.useState(false);
  const query = useObjectTypeAssigment();

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
      <WizardDialogContent<ObjectTypeAssigment>
        className='min-w-fit w-fit max-w-none overflow-visible'
        config={{
          title: 'Import types',
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
              title: 'Select types',
              description:
                'Select types you would like to import from other scenario by selecting them',
              validationSchema: objectTypeAssigmentRequestDTO,
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
                          <ObjectTypeSelector
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

export default ImportButtonForObjectTypes;
