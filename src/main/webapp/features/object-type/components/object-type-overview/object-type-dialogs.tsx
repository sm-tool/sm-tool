import {
  ObjectType,
  objectTypeUpdateFormDTO,
} from '@/features/object-type/types.ts';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Pencil, Trash2 } from 'lucide-react';
import {
  useDeleteObjectType,
  useUpdateObjectType,
} from '@/features/object-type/queries.ts';
import ConfirmDialog from '@/lib/modal-dialog/components/confirm-dialog.tsx';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import React from 'react';
import { useLocation, useRouter } from '@tanstack/react-router';
import { Tooltip } from '@/components/ui/shadcn/tooltip.tsx';
import TooltipButton from '@/components/ui/common/display/tooltip-button';
import useScenarioSearchParameterNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';

const ObjectTypeDialogs = ({
  values,
  canDelete,
}: {
  values: ObjectType;
  canDelete: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const updateObjectType = useUpdateObjectType();
  const deleteObjecType = useDeleteObjectType();
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
        <AutoFormDialogContent<ObjectType>
          config={{
            title: 'Edit object type',
            description: 'Make changes to object type properties',
            type: 'autoForm',
            data: values,
            zodObjectToValidate: objectTypeUpdateFormDTO,
            onSubmit: async data => {
              await updateObjectType.mutateAsync({ id: data.id, data: data });
              setIsOpen(false);
            },
          }}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <Tooltip>
          <TooltipButton
            buttonChildren={<Trash2 className='h-4 w-4' />}
            disabled={!canDelete}
            tooltipDisabled={canDelete}
            onClick={() => setIsConfirmOpen(true)}
            tooltipSide={'left'}
          >
            {disabled => disabled && ' base types cannot be deleted'}
          </TooltipButton>
        </Tooltip>
        <ConfirmDialog
          config={{
            type: 'confirm',
            variant: 'destructive',
            title: 'Delete object type',
            description:
              'Are you sure you want to delete this object type? This action cannot be undone.',
            onConfirm: async () => {
              await deleteObjecType.mutateAsync(values.id);
              setIsConfirmOpen(false);
              if (location.href.includes('/home')) {
                await router.navigate({
                  to: '/home/catalog/types',
                  replace: true,
                });
              } else {
                navigateRelative('catalogue:types', { replace: true });
              }
            },
          }}
          onClose={() => {
            setIsConfirmOpen(false);
          }}
        />
      </Dialog>
    </div>
  );
};

export default ObjectTypeDialogs;
