import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import { useMemo } from 'react';
import { PencilRuler, Trash2 } from 'lucide-react';
import {
  useDeletePhase,
  useUpdatePhase,
} from '@/features/scenario-phase/queries.ts';
import {
  ScenarioPhase,
  scenarioPhaseDTO,
} from '@/features/scenario-phase/types.ts';
import { ActionItem } from '@/lib/actions/types.ts';

const scenarioPhaseActions = (): ActionItem<ScenarioPhase>[] => {
  const { open, close } = useDialog();
  const deletePhase = useDeletePhase();
  const updatePhase = useUpdatePhase();

  return useMemo(
    () => [
      {
        label: 'Edit phase',
        Icon: PencilRuler,
        variant: 'default',
        onClick: (data: ScenarioPhase) => {
          open({
            type: 'autoForm',
            onSubmit: async data => {
              await updatePhase.mutateAsync({ id: data.id, data: data });
              close();
            },
            zodObjectToValidate: scenarioPhaseDTO,
            title: 'Edit phase',
            data: data,
          });
        },
      },
      {
        label: 'Delete phase',
        Icon: Trash2,
        variant: 'destructive',
        onClick: (phase: ScenarioPhase) => {
          open({
            type: 'confirm',
            variant: 'destructive',
            title: 'Delete dialog',
            description: `Are you sure you want to delete phase ${phase.title}?`,
            onConfirm: () => deletePhase.mutateAsync(phase.id),
          });
        },
      },
    ],
    [open, deletePhase, updatePhase],
  );
};

export default scenarioPhaseActions;
