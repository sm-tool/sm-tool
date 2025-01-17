import { useQuery } from '@tanstack/react-query';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';
import { attributeInstanceApi } from '@/features/attribute/api.ts';

export const attributeInstanceMappingKeys = {
  detail: (scenarioId: number, id: number) =>
    ['attributeInstanceMapping', scenarioId, id] as const,
};

export const useAttributeInstanceMapping = (attributeInstanceId: number) => {
  return useQuery({
    queryKey: attributeInstanceMappingKeys.detail(
      getScenarioIdFromPath(),
      attributeInstanceId,
    ),
    queryFn: () => attributeInstanceApi.getOne(attributeInstanceId),
  });
};
