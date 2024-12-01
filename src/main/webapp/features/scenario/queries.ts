import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import useInterfaceStore from '@/stores/interface';
import { AppError, ErrorLevel } from '@/types/errors.ts';
import { scenarioApi } from './api.ts';
import { DefaultPaginatedParameters } from '@/lib/pagination/types';
import { PaginatedResponse } from '@/lib/pagination/types/pagination.ts';
import { STALE_TIME } from '@/lib/api/constats.ts';
import { toast } from 'sonner';
import { Scenario, ScenarioForm } from '@/features/scenario/types.ts';

const scenarioKeys = {
  one: (id: number): Array<string | number> => ['scenario', 'one', id],
  list: (parameters?: object) =>
    parameters ? ['scenario', 'list', parameters] : ['scenario', 'list'],
};

export const useScenarios = (
  parameters: DefaultPaginatedParameters<Scenario>,
): UseQueryResult<PaginatedResponse<Scenario>> => {
  return useQuery({
    queryKey: scenarioKeys.list(parameters),
    queryFn: () => scenarioApi.getAll(parameters),
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useScenario = () => {
  const scenarioId = useInterfaceStore.getState().scenarioId;
  if (!scenarioId) {
    throw new AppError('No scenario is selected', ErrorLevel.ERROR);
  }
  useQuery({
    queryKey: scenarioKeys.one(scenarioId),
    queryFn: () => scenarioApi.getOne(),
    enabled: !!scenarioId,
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useUpdateScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Scenario> }) =>
      scenarioApi.update(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Scenario updated');
      void queryClient.invalidateQueries({ queryKey: scenarioKeys.one(id) });
      void queryClient.invalidateQueries({ queryKey: scenarioKeys.list() });
    },
    onError: error => {
      throw new AppError(error.message, ErrorLevel.WARNING);
    },
  });
};

export const useCreateScenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newScenario: ScenarioForm) => scenarioApi.create(newScenario),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scenarioKeys.list() });
      toast.success('Scenario created');
    },
    onError: error => {
      throw new AppError(error.message, ErrorLevel.WARNING);
    },
  });
};

export const useDeleteScenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scenarioApi.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scenarioKeys.list() });
      toast.success('Scenario deleted');
    },
    onError: error => {
      throw new AppError(error.message, ErrorLevel.WARNING);
    },
  });
};
