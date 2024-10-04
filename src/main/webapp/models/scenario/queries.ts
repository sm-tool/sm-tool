import useInterfaceStore from '@/stores/interface';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import genericQuery from '../../utils/query/generic-query';
import { QdsScenario, qdsScenarioSchema } from '@/models/scenario/entity';

export const useScenario = () => {
  const queryClient = useQueryClient();
  const scenarioId = useInterfaceStore.getState().scenarioId;
  if (scenarioId === undefined) throw new Error('Scenario id is undefined');

  const query = useQuery<QdsScenario>({
    queryKey: ['scenarioInformation', scenarioId],
    queryFn: async () =>
      genericQuery({
        endpoint: `/api/scenario/${scenarioId}`,
        schema: qdsScenarioSchema,
      }),
    enabled: !!scenarioId,
    staleTime: Infinity,
  });

  const mutation = useMutation<QdsScenario, Error, QdsScenario>({
    mutationFn: async (scenario: QdsScenario) => {
      return await window
        .fetch(`/api/scenario/${scenarioId}`, {
          method: 'PUT',
          body: JSON.stringify(scenario),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => qdsScenarioSchema.parseAsync(response.json()));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['scenario', scenarioId],
      });
    },
  });

  return {
    ...query,
    updateScenarioInformation: mutation.mutate,
    isReady: !!scenarioId,
  };
};
