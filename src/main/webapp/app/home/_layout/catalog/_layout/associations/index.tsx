import { createFileRoute } from '@tanstack/react-router';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { Plus, TextSelect } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import {
  AssociationTypeCreateForm,
  associationTypeCreateFormDTO,
} from '@/features/association-type/types.ts';
import { useCreateAssociationType } from '@/features/association-type/queries.ts';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import React from 'react';
import { cn } from '@nextui-org/theme';

export const CreateNewAssociation = ({
  variant,
  initialData,
  className,
  buttonText,
}: {
  variant?: 'default' | 'outline' | 'ghost';
  initialData?: Partial<AssociationTypeCreateForm>;
  className?: string;
  buttonText?: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const createAssociationType = useCreateAssociationType();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant ?? 'default'}
          size='lg'
          className={cn('w-full max-w-md', className)}
        >
          <Plus className='mr-2 h-5 w-5' />
          {buttonText || 'Create New Association'}
        </Button>
      </DialogTrigger>
      <AutoFormDialogContent<AssociationTypeCreateForm>
        config={{
          title: 'Create association type',
          type: 'autoForm',
          defaultValues: initialData,
          zodObjectToValidate: associationTypeCreateFormDTO,
          onSubmit: async data => {
            await createAssociationType.mutateAsync(data);
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

const AssociationNotFound = () => {
  return (
    <div className='size-full grid place-items-center'>
      <Card className='flex flex-col items-center justify-between size-fit p-16 gap-12'>
        <div className='flex flex-col items-center gap-8 text-center max-w-lg'>
          <div className='space-y-4'>
            <h1 className='text-2xl font-bold'>Association Preview Panel</h1>
            <p className='text-default-600'>
              This is where you&#39;ll see details about your associations.
              Select any association from the list to explore its properties and
              configurations.
            </p>
          </div>

          <TextSelect className='size-32 text-content4' />

          <p className='text-lg font-semibold'>With associations you can:</p>
          <Card className='w-fit p-4 bg-default-100'>
            <div className='text-default-600 space-y-2 text-left'>
              <p>• Define custom properties and behaviors</p>
              <p>• Create relationships between different objects</p>
              <p>• Set up advanced configurations and rules</p>
            </div>
          </Card>
        </div>
        <CreateNewAssociation />
      </Card>
    </div>
  );
};

export const Route = createFileRoute(
  '/home/_layout/catalog/_layout/associations/',
)({
  component: AssociationNotFound,
});
