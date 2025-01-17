import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Pencil, Trash2 } from 'lucide-react';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import React from 'react';
import ConfirmDialog from '@/lib/modal-dialog/components/confirm-dialog.tsx';
import {
  AssociationType,
  associationTypeUpdateFormDTO,
} from '@/features/association-type/types.ts';
import {
  useDeleteAssociationType,
  useUpdateAssociationType,
} from '@/features/association-type/queries.ts';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useLocation, useRouter } from '@tanstack/react-router';
import useScenarioSearchParameterNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';

const AssociationTypeDialogs = ({ data }: { data: AssociationType }) => {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const updateTemplate = useUpdateAssociationType();
  const deleteTemplate = useDeleteAssociationType();
  const router = useRouter();
  const location = useLocation();
  const { navigateRelative } = useScenarioSearchParameterNavigation();

  return (
    <div className='flex gap-2'>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Pencil className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        <AutoFormDialogContent<AssociationType>
          config={{
            title: 'Edit association type',
            description: 'Make changes to association type',
            type: 'autoForm',
            data: data,
            zodObjectToValidate: associationTypeUpdateFormDTO,
            onSubmit: async dataUpdated => {
              await updateTemplate.mutateAsync({
                id: data.id,
                data: dataUpdated,
              });
              setIsEditOpen(false);
            },
          }}
          onClose={() => {
            setIsEditOpen(false);
          }}
        />
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='text-destructive hover:text-destructive/90'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
          <ConfirmDialog
            config={{
              type: 'confirm',
              variant: 'destructive',
              title: 'Delete association type',
              description:
                'Are you sure you want to delete this association type? This action cannot be undone.',
              onConfirm: async () => {
                await deleteTemplate.mutateAsync(data.id);
                setIsDeleteOpen(false);
                if (location.href.includes('/home')) {
                  await router.navigate({
                    to: '/home/catalog/associations',
                    replace: true,
                  });
                } else {
                  navigateRelative('catalogue:associations', { replace: true });
                }
              },
            }}
            onClose={() => {
              setIsDeleteOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssociationTypeDialogs;
