import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import {
  ObjectTemplate,
  objectTemplateDTO,
} from '@/features/object-template/types.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Pencil, Trash2 } from 'lucide-react';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import React from 'react';
import {
  useDeleteObjectTemplate,
  useUpdateObjectTemplate,
} from '@/features/object-template/queries.ts';
import ConfirmDialog from '@/lib/modal-dialog/components/confirm-dialog.tsx';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useLocation, useRouter } from '@tanstack/react-router';
import useScenarioSearchParameterNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';

const ObjectTemplateDialogs = ({ data }: { data: ObjectTemplate }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const updateTemplate = useUpdateObjectTemplate();
  const deleteTemplate = useDeleteObjectTemplate();
  const router = useRouter();
  const location = useLocation();
  const { navigateRelative } = useScenarioSearchParameterNavigation();

  return (
    <div className='flex gap-2'>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Pencil className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        <AutoFormDialogContent<ObjectTemplate>
          config={{
            title: 'Edit template',
            description: 'Make changes to template properties',
            type: 'autoForm',
            data: data,
            zodObjectToValidate: objectTemplateDTO,
            onSubmit: async data => {
              await updateTemplate.mutateAsync({ id: data.id, data: data });
              setIsOpen(false);
            },
          }}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </Dialog>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
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
              title: 'Delete template',
              description:
                'Are you sure you want to delete this template? This action cannot be undone.',
              onConfirm: async () => {
                await deleteTemplate.mutateAsync(data.id);
                setIsConfigOpen(false);
                if (location.href.includes('/home')) {
                  await router.navigate({
                    to: '/home/catalog/templates',
                    replace: true,
                  });
                } else {
                  navigateRelative('catalogue:templates', { replace: true });
                }
              },
            }}
            onClose={() => {
              setIsConfigOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObjectTemplateDialogs;
