import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JoinUpdateRequest } from '@/features/branching/join/types.ts';
import { branchingJoinApi } from '@/features/branching/join/api.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { branchingKeys } from '@/features/branching/queries.ts';
import { eventKeys } from '@/features/event-instance/queries.ts';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';
import { threadKeys } from '@/features/thread/queries.ts';

export const useCreateJoinCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchingJoinApi.createJoinCreateRequest,
    onSuccess: _ => {
      successToast('Join created');
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
      handleErrorToast(error, 'Failed to create join');
    },
  });
};

export const useUpdateJoinCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      branchingId,
      joinUpdateRequest,
    }: {
      branchingId: number;
      joinUpdateRequest: JoinUpdateRequest;
    }) =>
      branchingJoinApi.updateJoinCreateRequest(branchingId, joinUpdateRequest),
    onSuccess: _ => {
      successToast('Join updated');
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
      handleErrorToast(error, 'Failed to update join');
    },
  });
};

export const useDeleteJoinCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ branchingId }: { branchingId: number }) =>
      branchingJoinApi.deleteJoinCreateRequest(branchingId),
    onSuccess: _ => {
      successToast('Join deleted');
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
      handleErrorToast(error, 'Failed to delete join');
    },
  });
};
