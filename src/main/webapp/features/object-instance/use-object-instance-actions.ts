import { ActionItem } from '@/lib/actions/types.ts';
import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
  ObjectInstance,
  objectInstanceDTO,
} from '@/features/object-instance/types.ts';
import {
  useDeleteObjectInstance,
  useUpdateObjectInstance,
} from '@/features/object-instance/queries.ts';
import useScenarioSearchParameterNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';

const useObjectInstanceActions = (config?: {
  disableNavigation?: boolean;
}): ActionItem<ObjectInstance>[] => {
  const { open, close } = useDialog();
  const updateObjectInstance = useUpdateObjectInstance();
  const deleteObjectInstance = useDeleteObjectInstance();
  const { navigateRelative } = useScenarioSearchParameterNavigation();
  return useMemo(
    () => [
      {
        label: 'Edit object',
        Icon: Pencil,
        onClick: (objectInstance: ObjectInstance) => {
          open({
            type: 'autoForm',
            title: 'Edit object properties',
            data: objectInstance,
            zodObjectToValidate: objectInstanceDTO,
            onSubmit: async data => {
              await updateObjectInstance.mutateAsync({
                id: objectInstance.id,
                data: data,
              });
            },
          });
        },
      },
      {
        label: 'Delete object',
        Icon: Trash2,
        variant: 'destructive',
        onClick: (data: ObjectInstance) => {
          open({
            type: 'confirm',
            variant: 'destructive',
            title: 'Delete object',
            description:
              'Are you sure you want to delete this object? This action will not only remove it from this thread but also delete it entirely.',
            onConfirm: async () => {
              await deleteObjectInstance.mutateAsync(data.id);
              close();
              if (!config?.disableNavigation) {
                navigateRelative('objects', { replace: true });
              }
            },
          });
        },
      },
    ],
    [open, updateObjectInstance, deleteObjectInstance],
  );
};

export default useObjectInstanceActions;
