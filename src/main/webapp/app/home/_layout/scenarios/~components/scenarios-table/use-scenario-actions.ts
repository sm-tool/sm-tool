import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import {
  useDeleteScenario,
  useUpdateScenario,
} from '@/features/scenario/queries.ts';
import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Eye, PencilRuler, Trash2 } from 'lucide-react';
import { Scenario, scenarioDTO } from '@/features/scenario/types.ts';
import { ActionItem } from '@/lib/actions/types.ts';

const useScenarioActions = (): ActionItem<Scenario>[] => {
  const { open, close } = useDialog();
  const { mutateAsync: deleteScenario } = useDeleteScenario();
  const { mutateAsync: updateScenario } = useUpdateScenario();
  const { navigate } = useRouter();

  return useMemo(
    () => [
      {
        label: 'Open scenario',
        Icon: Eye,
        variant: 'default',
        onClick: (scenario: Scenario) => {
          void navigate({ to: `/scenario/${scenario.id}` });
        },
      },
      {
        label: 'Edit scenario',
        Icon: PencilRuler,
        variant: 'default',
        onClick: (scenario: Scenario) => {
          open({
            type: 'autoForm',
            onSubmit: async data => {
              await updateScenario({ id: data.id, data: data });
              close();
            },
            zodObjectToValidate: scenarioDTO,
            title: 'Edit scenario',
            data: scenario,
          });
        },
      },
      {
        label: 'Delete scenario',
        Icon: Trash2,
        variant: 'destructive',
        onClick: (scenario: Scenario) => {
          open({
            type: 'confirm',
            variant: 'destructive',
            title: 'Delete scenario',
            description: `Are you sure you want to delete scenario ${scenario.title}? This action cannot be undone`,
            onConfirm: () => deleteScenario(scenario.id),
          });
        },
      },
    ],
    [open, deleteScenario, updateScenario, navigate],
  );
};

export default useScenarioActions;
