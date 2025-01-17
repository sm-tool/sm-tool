import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { scenarioApi } from './api.ts';
import { STALE_TIME } from '@/lib/api/constats.ts';
import { toast } from 'sonner';
import {
  Scenario,
  ScenarioApiFilterMethods,
  ScenarioFormType,
} from '@/features/scenario/types.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { QueryRequest } from '@/lib/hal-pagination/types/pagination.types.ts';
import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';

const scenarioKeys = {
  all: ['scenarios'] as const,
  list: (request?: QueryRequest<Scenario, ScenarioApiFilterMethods>) =>
    [...scenarioKeys.all, request] as const,
  detail: (id: number) => [...scenarioKeys.all, 'detail', id] as const,
} as const;

export const useScenarios = (
  request?: QueryRequest<Scenario, ScenarioApiFilterMethods>,
): UseQueryResult<HalPaginatedResponse<Scenario, 'scenario'>> => {
  return useQuery({
    queryKey: ['scenarios', request],
    queryFn: () => scenarioApi.getAll(request),
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useScenario = (scenarioId: number) => {
  return useQuery({
    queryKey: scenarioKeys.detail(scenarioId),
    queryFn: () => scenarioApi.getOne(scenarioId),
    enabled: !!scenarioId,
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useActiveScenario = () => {
  const scenarioId = getScenarioIdFromPath();

  return useQuery({
    queryKey: scenarioKeys.detail(scenarioId),
    queryFn: () => scenarioApi.getOne(scenarioId),
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useUpdateActiveScenario = () => {
  const queryClient = useQueryClient();
  const scenarioId = getScenarioIdFromPath();

  return useMutation({
    mutationFn: ({ data }: { data: Scenario }) =>
      scenarioApi.update(scenarioId, data),
    onSuccess: _ => {
      successToast('Scenario updated');
      void queryClient.invalidateQueries({ queryKey: scenarioKeys.all });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update scenario');
    },
  });
};

export const useUpdateScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Scenario }) =>
      scenarioApi.update(id, data),
    onSuccess: _ => {
      successToast('Scenario updated');
      void queryClient.invalidateQueries({ queryKey: scenarioKeys.all });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update scenario');
    },
  });
};

export const useCreateScenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newScenario: ScenarioFormType) =>
      scenarioApi.create(newScenario),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scenarioKeys.all });

      successToast('Scenario created');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create scenario');
    },
  });
};

export const useDeleteScenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scenarioApi.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scenarioKeys.all });
      toast.success('Scenario deleted');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete scenario');
    },
  });
};
