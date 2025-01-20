import { createFileRoute } from '@tanstack/react-router';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { Plus, TextSelect } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import {
  ObjectTemplateForm,
  objectTemplateFormDTO,
} from '@/features/object-template/types.ts';
import { useCreateObjectTemplate } from '@/features/object-template/queries.ts';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import React from 'react';

export const CreateNewTemplateButton = ({
  variant,
  defaultValueForCreator,
}: {
  variant?: 'default' | 'outline' | 'ghost';
  defaultValueForCreator?: Partial<ObjectTemplateForm>;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const createObjectTemplate = useCreateObjectTemplate();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant ?? 'default'} size='lg' className='w-full'>
          <Plus className='mr-2 h-5 w-5' />
          Create New Template
        </Button>
      </DialogTrigger>
      <AutoFormDialogContent<ObjectTemplateForm>
        config={{
          title: 'Create object template',
          type: 'autoForm',
          zodObjectToValidate: objectTemplateFormDTO,
          defaultValues: defaultValueForCreator,
          onSubmit: async data => {
            await createObjectTemplate.mutateAsync(data);
            setIsOpen(false);
          },
        }}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </Dialog>
  );
};

const TemplateNotFound = () => {
  return (
    <div className='size-full grid place-items-center'>
      <Card className='flex flex-col items-center justify-between size-fit p-16 gap-12'>
        <div className='flex flex-col items-center gap-8 text-center max-w-lg'>
          <div className='space-y-4'>
            <h1 className='text-2xl font-bold'>Template Preview Panel</h1>
            <p className='text-default-600'>
              This is where you&#39;ll see details about your templates. Select
              any template from the list to explore its properties and
              configurations.
            </p>
          </div>

          <TextSelect className='size-32 text-content4' />

          <p className='text-lg font-semibold'>With objects you can:</p>
          <Card className='w-fit p-4 bg-default-100'>
            <div className='text-default-600 space-y-2 text-left'>
              <p>• Define custom properties and behaviors</p>
              <p>• Create relationships between different objects</p>
              <p>• Set up advanced configurations and rules</p>
            </div>
          </Card>
        </div>
        <CreateNewTemplateButton />
      </Card>
    </div>
  );
};

export const Route = createFileRoute(
  '/home/_layout/catalog/_layout/templates/',
)({
  component: TemplateNotFound,
});
