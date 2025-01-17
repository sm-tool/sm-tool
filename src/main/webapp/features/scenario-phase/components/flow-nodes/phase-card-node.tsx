import React, { memo } from 'react';
import {
  ScenarioPhase,
  scenarioPhaseDTO,
} from '@/features/scenario-phase/types.ts';
import useScenarioSearchParamNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import {
  useDeletePhase,
  useUpdatePhase,
} from '@/features/scenario-phase/queries.ts';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import ConfirmDialogContent from '@/lib/modal-dialog/components/confirm-dialog.tsx';

import { Card } from '@/components/ui/shadcn/card.tsx';
import { Dialog } from '@/components/ui/shadcn/dialog.tsx';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Node, NodeProps } from '@xyflow/react';
import { getflowUnitObjectGradientStyle } from '@/lib/react-flow/utils/flow-unit-object-gradient-style.ts';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/shadcn/context-menu.tsx';
import { motion } from 'framer-motion';
import { cn } from '@nextui-org/theme';

export const PhaseCard = ({
  phase,
  className,
}: {
  phase: ScenarioPhase;
  className?: string;
}) => {
  const { navigateRelative } = useScenarioSearchParamNavigation();
  const updatePhase = useUpdatePhase();
  const deletePhase = useDeletePhase();
  const [form, setForm] = React.useState<'edit' | 'delete' | undefined>();

  const forms: Record<'edit' | 'delete', React.ReactNode> = {
    edit: (
      <AutoFormDialogContent
        config={{
          type: 'autoForm',
          title: 'Edit phase properties',
          data: phase,
          zodObjectToValidate: scenarioPhaseDTO,
          onSubmit: async data => {
            await updatePhase.mutateAsync({ id: data.id, data: data });
          },
        }}
        onClose={() => setForm(undefined)}
      />
    ),
    delete: (
      <ConfirmDialogContent
        config={{
          type: 'confirm',
          title: 'Delete phase',
          variant: 'destructive',
          description: 'Are you sure you want to delete this phase?',
          onConfirm: async () => {
            await deletePhase.mutateAsync(phase.id);
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
        <ContextMenuTrigger asChild>
          <motion.div
            // layout='position'
            // initial={{
            //   opacity: 0,
            // }}
            // animate={{
            //   width: `${FLOW_UNIT_WIDTH * (data.phase.endTime - data.phase.startTime)}px`,
            //   opacity: 1,
            // }}
            // exit={{
            //   scale: 0,
            //   rotate: 20,
            //   filter: 'brightness(0.5)',
            //   opacity: 0,
            // }}
            // transition={{
            //   duration: 0.3,
            //   exit: { duration: 0.2 },
            // }}
            className={cn('h-full', className)}
          >
            <Card
              onClick={event => {
                const contextMenuEvent = new MouseEvent('contextmenu', {
                  clientX: event.clientX,
                  clientY: event.clientY,
                  bubbles: true,
                });
                event.currentTarget.dispatchEvent(contextMenuEvent);
              }}
              style={getflowUnitObjectGradientStyle(phase.color)}
              className='w-full flex flex-col size-full overflow-hidden items-center text-center
                justify-center !rounded-none h-full'
            >
              <span className='text-2xl font-semibold line-clamp-4 block'>
                {phase.title}
              </span>
            </Card>
          </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => navigateRelative(`description`)}
            className='flex flex-row gap-x-2'
          >
            <Eye className='size-5 flex-shrink-0' />
            View phase
          </ContextMenuItem>
          <ContextMenuItem
            className='flex flex-row gap-x-2'
            onClick={() => setForm('edit')}
          >
            <Pencil className='size-5 flex-shrink-0' />
            Edit phase
          </ContextMenuItem>

          <ContextMenuItem
            className='flex flex-row gap-x-2'
            onClick={() => setForm('delete')}
          >
            <Trash2 className='size-5 flex-shrink-0' />
            Delete phase
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Dialog>
  );
};

const PhaseCardNode = ({ data }: NodeProps<Node<{ phase: ScenarioPhase }>>) => (
  <PhaseCard phase={data.phase} />
);

export default memo(PhaseCardNode);
