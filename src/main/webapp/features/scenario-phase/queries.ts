import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { STALE_TIME } from '@/lib/api/constats.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { toast } from 'sonner';
import {
  ScenarioPhase,
  ScenarioPhaseForm,
} from '@/features/scenario-phase/types.ts';
import { scenarioPhaseApi } from '@/features/scenario-phase/api.ts';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';

export const phasesKeys = {
  all: (scenarioId: number) => ['phases', scenarioId] as const,
  detail: (scenarioId: number, id: number) =>
    [...phasesKeys.all(scenarioId), 'detail', id] as const,
} as const;

export const usePhases = () => {
  return useQuery({
    queryKey: phasesKeys.all(getScenarioIdFromPath()),
    queryFn: () => scenarioPhaseApi.getAll(),
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useUpdatePhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ScenarioPhase }) =>
      scenarioPhaseApi.update(id, data),
    onSuccess: _ => {
      successToast('Scenario phase updated');
      void queryClient.invalidateQueries({
        queryKey: phasesKeys.all(getScenarioIdFromPath()),
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update scenario phase');
    },
  });
};

export const useCreatePhase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPhase: ScenarioPhaseForm) =>
      scenarioPhaseApi.create(newPhase),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: phasesKeys.all(getScenarioIdFromPath()),
      });

      successToast('Scenario phase created');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create scenario phase');
    },
  });
};

export const useDeletePhase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => scenarioPhaseApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: phasesKeys.all(getScenarioIdFromPath()),
      });
      toast.success('Scenario phase deleted');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete scenario phase');
    },
  });
};
