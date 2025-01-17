import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { objectInstanceFormDTO } from '@/features/object-instance/types.ts';
import { Wizard, WizardStep } from '@/components/ui/common/wizard';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form.tsx';
import { Input } from '@/components/ui/shadcn/input.tsx';
import ObjectTypeSelectDialog from '@/features/object-type/components/object-type-tree/object-type-select-dialog.tsx';
import ObjectTemplatePicker from '@/features/object-template/components/object-template-picker';
import { Controller } from 'react-hook-form';
import { objectTypeIdReference } from '@/lib/zod-types/object-type-id-reference.ts';

const AddObjectForm = ({
  threadId,
  onSucces,
  onCancel,
  isLoading,
  isActive,
}: {
  threadId: number;
  onSucces: (data: z.infer<typeof objectInstanceFormDTO>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  isActive: boolean;
}) => {
  const steps: WizardStep[] = [
    {
      id: 1,
      title: 'Provide object name',
      description:
        "Object name needs to be unique and will be used to identify this instance. The object's lifecycle is initially bound to its assigned thread",
      fields: ['name'],
      component: register => (
        <FormItem>
          <FormLabel>
            Object Name <span className='text-primary'> *</span>
          </FormLabel>
          <FormControl>
            <Input {...register('name')} />
          </FormControl>
          <FormMessage />
        </FormItem>
      ),
      validationSchema: objectInstanceFormDTO.pick({ name: true }),
    },
    {
      id: 2,
      title: 'Provide object type',
      description:
        'Choose the type for your object. This selection determines which associations and relationships can be established with other objects in the workflow.',
      fields: ['objectTypeId'],
      component: (register, formValues) => (
        <FormItem>
          <FormLabel>
            Object Type <span className='text-primary'> *</span>
          </FormLabel>
          <FormControl>
            <ObjectTypeSelectDialog
              globalsBlocked={threadId !== 0}
              {...register('objectTypeId')}
              value={formValues.objectTypeId as number | undefined}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      ),
      validationSchema: z.object({
        objectTypeId: objectTypeIdReference({
          modifier: schema => schema.positive(),
        }),
        name: z
          .string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
          })
          .min(1, 'Name is required'),
      }),
    },
    {
      id: 3,
      title: 'Provide template',
      description:
        'Select a template compatible with the chosen object type. The template defines which attributes the object will have and their default values during operation.',
      fields: ['templateId'],
      component: (_, formValues, control) => (
        <FormItem>
          <FormLabel>
            Template <span className='text-primary'> *</span>
          </FormLabel>
          <FormControl>
            <Controller
              control={control}
              name='templateId'
              render={({ field }) => (
                <ObjectTemplatePicker
                  objectTypeId={formValues.objectTypeId as number}
                  defaultValueForCreator={{
                    objectTypeId: formValues.objectTypeId as number,
                  }}
                  value={field.value as number}
                  onChange={field.onChange}
                />
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      ),
      validationSchema: objectInstanceFormDTO.pick({
        templateId: true,
        originThreadId: true,
      }),
    },
  ];

  return (
    <Wizard
      steps={steps}
      // @ts-expect-error -- TODO: Dodać generica
      onSubmit={onSucces}
      isActive={isActive}
      isLoading={isLoading}
      defaultValues={{
        name: '',
        objectTypeId: undefined,
        originThreadId: threadId,
      }}
      onCancel={onCancel}
    />
  );
};

export default AddObjectForm;
