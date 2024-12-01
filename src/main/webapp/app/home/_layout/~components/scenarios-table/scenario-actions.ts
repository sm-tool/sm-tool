import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import {
  useDeleteScenario,
  useUpdateScenario,
} from '@/features/scenario/queries.ts';
import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Eye, PencilRuler, Trash2 } from 'lucide-react';
import { Scenario, scenarioFormDTO } from '@/features/scenario/types.ts';
import { ActionItem } from '@/components/ui/common/buttons/context-menu/rud-context-menu.tsx';

const scenarioActions = (): ActionItem<Scenario>[] => {
  const { open } = useDialog();
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
            title: 'Edit scenario',
            data: scenario,
            zodObjectToValidate: scenarioFormDTO,
            // eslint-disable-next-line -- cant detect that await in void
            onSubmit: async formData =>
              void updateScenario({ id: scenario.id, data: formData }),
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
            title: 'Delete dialog',
            description: `Are you sure you want to delete scenario ${scenario.title}?`,
            onConfirm: () => deleteScenario(scenario.id),
          });
        },
      },
    ],
    [open, deleteScenario, updateScenario, navigate],
  );
};

export default scenarioActions;
