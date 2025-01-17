import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';
import { threadKeys } from '@/features/thread/queries.ts';
import { branchingKeys } from '@/features/branching/queries.ts';
import { eventKeys } from '@/features/event-instance/queries.ts';
import { ForkUpdateRequest } from '@/features/branching/fork/types.ts';
import { branchingForkApi } from '@/features/branching/fork/api.ts';

export const useCreateForkCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchingForkApi.createForkCreateRequest,
    onSuccess: _ => {
      successToast('Fork created');
      const scenarioId = getScenarioIdFromPath();
      void queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          { queryKey: threadKeys.all(scenarioId) },
          { queryKey: branchingKeys.all(scenarioId) },
          { queryKey: eventKeys.all(scenarioId) },
        ],
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create fork');
    },
  });
};

export const useUpdateForkCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      branchingId,
      forkUpdateRequest,
    }: {
      branchingId: number;
      forkUpdateRequest: ForkUpdateRequest;
    }) =>
      branchingForkApi.updateForkCreateRequest(branchingId, forkUpdateRequest),
    onSuccess: _ => {
      successToast('Fork updated');
      const scenarioId = getScenarioIdFromPath();
      void queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          { queryKey: threadKeys.all(scenarioId) },
          { queryKey: branchingKeys.all(scenarioId) },
          { queryKey: eventKeys.all(scenarioId) },
        ],
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update fork');
    },
  });
};

export const useDeleteJoinCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ branchingId }: { branchingId: number }) =>
      branchingForkApi.deleteForkCreateRequest(branchingId),
    onSuccess: _ => {
      successToast('Fork deleted');
      const scenarioId = getScenarioIdFromPath();
      void queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          { queryKey: threadKeys.all(scenarioId) },
          { queryKey: branchingKeys.all(scenarioId) },
          { queryKey: eventKeys.all(scenarioId) },
        ],
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete fork');
    },
  });
};
