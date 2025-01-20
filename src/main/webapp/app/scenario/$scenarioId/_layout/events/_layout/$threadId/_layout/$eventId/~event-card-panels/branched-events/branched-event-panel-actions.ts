import { ActionItem } from '@/lib/actions/types.ts';
import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import { useMemo } from 'react';
import { Pencil, RouteOff } from 'lucide-react';
import { Branching, branchingDTO } from '@/features/branching/types.ts';
import {
  useDeleteBranching,
  useUpdateBranching,
} from '@/features/branching/queries.ts';

export const useBranchedEventPanelActions = (): ActionItem<Branching>[] => {
  const { open, close } = useDialog();
  const updateBranching = useUpdateBranching();
  const deteleBranching = useDeleteBranching();

  return useMemo(
    () => [
      {
        label: 'Edit branching event data',
        Icon: Pencil,
        onClick: (branching: Branching) => {
          open({
            type: 'autoForm',
            title: 'Edit branching event',
            data: branching,
            zodObjectToValidate: branchingDTO,
            onSubmit: async data => {
              await updateBranching.mutateAsync({ id: data.id, data: data });
              close();
            },
          });
        },
      },
      {
        label: 'Remove branching',
        Icon: RouteOff,
        onClick: (branching: Branching) => {
          open({
            type: 'confirm',
            title: 'Remove branching',
            description:
              'Warning: This will permanently delete this brancing  and all its child threads. This action cannot be undone. If you wish to preserve the structure, consider editing the content instead.',
            variant: 'destructive',
            onConfirm: async () => {
              await deteleBranching.mutateAsync(branching.id);
            },
          });
        },
      },
    ],
    [open, updateBranching],
  );
};
