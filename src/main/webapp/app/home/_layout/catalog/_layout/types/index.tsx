import { createFileRoute } from '@tanstack/react-router';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { Plus, TextSelect } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import {
  ObjectType,
  ObjectTypeForm,
  objectTypeFormDTO,
} from '@/features/object-type/types.ts';
import { useCreateObjectType } from '@/features/object-type/queries.ts';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import React from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  ObjectTemplateForm,
  objectTemplateFormDTO,
} from '@/features/object-template/types.ts';
import { useCreateObjectTemplate } from '@/features/object-template/queries.ts';
import { getSlightlyDifferentColor } from '@/utils/color/get-SLIGHTLY-different-color.ts';

export const CreateNewObjectButton = ({
  variant,
}: {
  variant?: 'default' | 'outline' | 'ghost';
}) => {
  const createObjectType = useCreateObjectType({
    onTemplateCreateIntent: data => {
      setTemplateData(data);
      setIsTemplateDialogOpen(true);
    },
  });
  const createObjectTemplate = useCreateObjectTemplate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = React.useState(false);
  const [templateData, setTemplateData] = React.useState<ObjectType | null>(
    null,
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant={variant ?? 'default'} size='lg' className='w-full'>
            <Plus className='mr-2 h-5 w-5' />
            Create new object type
          </Button>
        </DialogTrigger>
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
          <DialogHeader className='font-bold text-xl'>
            Create object type
          </DialogHeader>
          <AutoFormDialogContent<ObjectTypeForm>
            config={{
              title: 'Create object type',
              type: 'autoForm',
              zodObjectToValidate: objectTypeFormDTO,
              onSubmit: async data => {
                await createObjectType.mutateAsync(data);
                setIsOpen(false);
              },
            }}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
      {templateData && (
        <Dialog
          open={isTemplateDialogOpen}
          onOpenChange={setIsTemplateDialogOpen}
        >
          <DialogTrigger asChild></DialogTrigger>
          <AutoFormDialogContent<ObjectTemplateForm>
            config={{
              title: 'Create object template from type',
              type: 'autoForm',
              zodObjectToValidate: objectTemplateFormDTO,
              defaultValues: {
                title: templateData.title,
                description: templateData.description,
                objectTypeId: templateData.id,
                color: getSlightlyDifferentColor(templateData.color),
              },
              onSubmit: async data => {
                await createObjectTemplate.mutateAsync(data);
                setTemplateData(null);
                setIsTemplateDialogOpen(false);
              },
            }}
            onClose={() => {
              setTemplateData(null);
              setIsTemplateDialogOpen(false);
            }}
          />
        </Dialog>
      )}
    </>
  );
};

const ObjectNotFound = () => {
  return (
    <div className='size-full grid place-items-center'>
      <Card className='flex flex-col items-center justify-between size-fit p-16 gap-12'>
        <div className='flex flex-col items-center gap-8 text-center max-w-lg'>
          <div className='space-y-4'>
            <h1 className='text-2xl font-bold'>Object Preview Panel</h1>
            <p className='text-default-600'>
              This is where you&#39;ll see details about your objects. Select
              any object from the list to explore its properties and
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

        <CreateNewObjectButton />
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/home/_layout/catalog/_layout/types/')({
  component: ObjectNotFound,
});
