import { Thread, threadDTO } from '@/features/thread/types.ts';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { FLOW_UNIT_HEIGHT } from '@/lib/react-flow/config/scenario-flow-config.ts';
import { Dialog } from '@/components/ui/shadcn/dialog.tsx';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useDeleteThread, useUpdateThread } from '@/features/thread/queries.ts';
import React from 'react';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import ConfirmDialogContent from '@/lib/modal-dialog/components/confirm-dialog.tsx';
import { getflowUnitObjectGradientStyle } from '@/lib/react-flow/utils/flow-unit-object-gradient-style.ts';
import useDarkMode from '@/hooks/use-dark-mode.tsx';
import { cn } from '@nextui-org/theme';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/shadcn/context-menu.tsx';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';

export type ThreadCardProperties = {
  thread: Thread;
};

// Since in reactflow ypu have to define exports EXPLICITE ale imports must be inline
const ThreadCard = ({ thread }: ThreadCardProperties) => {
  const { navigateWithParameters } = useScenarioCommonNavigation();
  const updateThread = useUpdateThread();
  const deleteThread = useDeleteThread();
  const [form, setForm] = React.useState<'edit' | 'delete' | undefined>();
  const { isDark } = useDarkMode();
  const { scenarioManipulation } = useThreadsFlow();

  const isSelectedNode = React.useMemo(
    () => scenarioManipulation.selectedThreads.includes(thread.id),
    [scenarioManipulation.selectedThreads, thread.id],
  );

  const forms: Record<'edit' | 'delete', React.ReactNode> = {
    edit: (
      <AutoFormDialogContent
        config={{
          type: 'autoForm',
          title: 'Edit thread properties',
          data: thread,
          zodObjectToValidate: threadDTO,
          onSubmit: async data => {
            await updateThread.mutateAsync({ id: thread.id, data: data });
          },
        }}
        onClose={() => setForm(undefined)}
      />
    ),
    delete: (
      <ConfirmDialogContent
        config={{
          type: 'confirm',
          title: 'Delete thread',
          variant: 'destructive',
          description:
            'Are you sure you want to delete this thread? This action cannot be undone and will delete EVERY preceding threads with its content?.',
          onConfirm: async () => {
            await deleteThread.mutateAsync(thread.id);
            setForm(undefined);
          },
        }}
        onClose={() => setForm(undefined)}
      />
    ),
  };

  return (
    <Dialog open={!!form} onOpenChange={() => setForm(undefined)}>
      {form === 'edit' ? forms['edit'] : forms['delete']}
      <ContextMenu>
        <ContextMenuTrigger className='relative'>
          {isSelectedNode && (
            <div
              className='absolute inset-0 z-20 animate-in fade-in duration-300 pointer-events-none
                bg-primary-400/10'
            />
          )}
          <Card
            onClick={(event: React.MouseEvent) => {
              if (event.shiftKey) {
                scenarioManipulation.toggleNodeSelection(thread.id);
              } else {
                navigateWithParameters(`events/${thread.id}`);
              }
            }}
            className={cn(
              `w-full flex flex-col !bg-content1 h-full overflow-hidden items-center
              text-center !rounded-none `,
            )}
            style={getflowUnitObjectGradientStyle(
              isDark ? '#0f172a' : '#FFFFFF',
              {
                height: FLOW_UNIT_HEIGHT,
                maxHeight: FLOW_UNIT_HEIGHT,
              },
            )}
          >
            <div className='w-full px-4 py-2 border-b flex-shrink-0 text-center'>
              <span className='text-2xl font-semibold block overflow-hidden h-8 truncate max-w-5xl'>
                {thread.title}
              </span>
            </div>
            {scenarioManipulation.threadViewMode === 'description' && (
              <div className='flex-1 overflow-y-auto px-4 py-2 min-h-0 duration-300 animate-appearance-in'>
                <p className='w-full'>{thread.description}</p>
              </div>
            )}
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => navigateWithParameters(`events/${thread.id}`)}
            className='flex flex-row gap-x-2'
          >
            <Eye className='size-5 flex-shrink-0' />
            Open thread in events editor
          </ContextMenuItem>
          <ContextMenuItem
            className='flex flex-row gap-x-2'
            onClick={() => setForm('edit')}
          >
            <Pencil className='size-5 flex-shrink-0' />
            Edit thread
          </ContextMenuItem>
          <ContextMenuItem
            className='flex flex-row gap-x-2'
            onClick={() => setForm('delete')}
          >
            <Trash2 className='size-5 flex-shrink-0' />
            Delete thread
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Dialog>
  );
};
export default ThreadCard;
