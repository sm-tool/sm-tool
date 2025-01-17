import { ActionItem } from '@/lib/actions/types.ts';
import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import { useMemo } from 'react';
import { Pencil } from 'lucide-react';
import { Branching, branchingDTO } from '@/features/branching/types.ts';
import { useUpdateBranching } from '@/features/branching/queries.ts';

export const useBranchedEventPanelActions = (): ActionItem<Branching>[] => {
  const { open, close } = useDialog();
  const updateBranching = useUpdateBranching();

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
    ],
    [open, updateBranching],
  );
};
