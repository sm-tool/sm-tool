import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import { Thread, threadDTO } from '@/features/thread/types.ts';
import { useDeleteThread, useUpdateThread } from '@/features/thread/queries.ts';
import useScenarioSearchParamNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import { useMemo } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ActionItem } from '@/lib/actions/types.ts';

const useThreadActions = ({
  isOpenHidden,
}: {
  isOpenHidden: boolean;
}): ActionItem<Thread>[] => {
  const { open, close } = useDialog();
  const updateThread = useUpdateThread();
  const deleteThread = useDeleteThread();
  const { navigateRelative } = useScenarioSearchParamNavigation();

  return useMemo(() => {
    const actions: ActionItem<Thread>[] = [];

    if (!isOpenHidden) {
      actions.push({
        label: 'Open thread overview',
        Icon: Eye,
        variant: 'default',
        onClick: (thread: Thread) => {
          navigateRelative(`thread:${thread.id}`);
        },
      });
    }

    actions.push(
      {
        label: 'Edit thread',
        Icon: Pencil,
        onClick: (thread: Thread) => {
          open({
            type: 'autoForm',
            title: 'Edit thread properties',
            data: thread,
            zodObjectToValidate: threadDTO,
            onSubmit: async data => {
              await updateThread.mutateAsync({ id: thread.id, data: data });
            },
          });
        },
      },
      {
        label: 'Delete thread',
        Icon: Trash2,
        variant: 'destructive',
        onClick: (data: Thread) => {
          open({
            type: 'confirm',
            variant: 'destructive',
            title: 'Delete thread',
            description:
              'Are you sure you want to delete this thread? This action cannot be undone and will delete EVERY preceding threads with its content?.',
            onConfirm: async () => {
              await deleteThread.mutateAsync(data.id);
              close();
            },
          });
        },
      },
    );

    return actions;
  }, [open, close, updateThread, deleteThread, navigateRelative, isOpenHidden]);
};

export default useThreadActions;
