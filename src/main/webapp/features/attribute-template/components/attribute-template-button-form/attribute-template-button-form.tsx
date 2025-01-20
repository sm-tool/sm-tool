import {
  AttributeTemplate,
  AttributeTemplateFormType,
  baseAttributeTemplateDTO,
} from '@/features/attribute-template/types.ts';
import React from 'react';
import {
  useAllTemplateAttributes,
  useCreateAttributeTemplate,
} from '@/features/attribute-template/queries.ts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Plus } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import WizardDialogContent from '@/lib/modal-dialog/components/wizard-dialog.tsx';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form.tsx';
import { Input } from '@/components/ui/shadcn/input.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select.tsx';
import {
  AttributeTypeDisplay,
  attributeTypeDTO,
} from '@/features/attribute-template/attribute-type/types.ts';
import { Controller } from 'react-hook-form';
import { AttributeFormItem } from '@/features/attribute/components/attribute-card-value/attribute-form.tsx';
import { z } from '@/lib/zod-types/hiden-field.types.ts';

const AttributeTemplateButtonForm = ({
  objectTemplateId,
}: {
  objectTemplateId: number;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const createAttributeTemplate = useCreateAttributeTemplate();
  const { data: attributes, isLoading } =
    useAllTemplateAttributes(objectTemplateId);

  if (isLoading) return;

  return (
    <AttributeFormLocal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      objectTemplateId={objectTemplateId}
      onSubmit={async data => {
        await createAttributeTemplate.mutateAsync(data);
        setIsOpen(false);
      }}
      attributes={attributes}
    />
  );
};

type AttributeFormProperties = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  objectTemplateId: number;
  onSubmit: (data: AttributeTemplateFormType) => Promise<void>;
  attributes?: AttributeTemplate[];
};

export const AttributeFormLocal = ({
  isOpen,
  setIsOpen,
  objectTemplateId,
  onSubmit,
  attributes,
}: AttributeFormProperties) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='default' className='flex flex-row gap-x-2'>
          <Plus className='size-5 flex-shrink-0' />
          <span className='hidden @md:block'>Add new attribute template</span>
          <span className='block @md:hidden'>Add attribute</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden>
        <WizardDialogContent<AttributeTemplateFormType>
          config={{
            title: 'Create new attribute template',
            type: 'wizard',
            defaultValues: {
              objectTemplateId: objectTemplateId,
              type: 'INT' as AttributeTypeDisplay,
            },
            steps: [
              {
                id: 1,
                title: 'Provide attribute details',
                description:
                  'Enter the name and type for the attribute that will be modifiable within the template during runtime operations.',
                fields: ['name', 'type'],
                component: (register, _, control) => (
                  <div className='space-y-4'>
                    <FormItem>
                      <FormLabel>
                        Name <span className='text-primary'> *</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...register('name')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>
                        Type <span className='text-primary'> *</span>
                      </FormLabel>
                      <FormControl>
                        <Controller
                          name='type'
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              value={value as AttributeTypeDisplay}
                              onValueChange={onChange}
                              defaultValue={
                                Object.values(AttributeTypeDisplay)[0]
                              }
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select type' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {Object.values(AttributeTypeDisplay).map(
                                    (type, id) => (
                                      <SelectItem key={id} value={type}>
                                        {type}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                ),
                validationSchema: z.object({
                  name: z
                    .string()
                    .min(1, 'Name is required')
                    .refine(
                      name =>
                        !attributes?.some(attribute => attribute.name === name),
                      'Attribute with this name already exists',
                    ),
                  type: attributeTypeDTO,
                }),
              },
              {
                id: 2,
                title: 'Provide attribute unit',
                description:
                  'Specify the measurement unit for your attribute (e.g., kg, persons, pieces) that will be displayed alongside the attribute value during operations.',
                fields: ['unit'],
                component: register => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input {...register('unit')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ),
                validationSchema: baseAttributeTemplateDTO.pick({ unit: true }),
              },
              {
                id: 3,
                title: 'Provide default value',
                description:
                  'Set the initial value for your attribute that will be used as a starting point before any modifications are made during operations.',
                fields: ['defaultValue'],
                component: (register, formValues, control) => (
                  <AttributeFormItem
                    // @ts-expect-error -- fix type
                    field={{
                      value: formValues.defaultValue as string,
                      ...register('defaultValue'),
                    }}
                    type={formValues.type as AttributeTypeDisplay}
                    control={control}
                  />
                ),
                validationSchema: baseAttributeTemplateDTO.pick({
                  defaultValue: true,
                  objectTemplateId: true,
                }),
              },
            ],
            onSubmit: onSubmit,
          }}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AttributeTemplateButtonForm;
