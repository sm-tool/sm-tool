import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { threadApi } from '@/features/thread/api.ts';
import { STALE_TIME } from '@/lib/api/constats.ts';
import {
  Thread,
  ThreadForm,
  ThreadOffsetForm,
} from '@/features/thread/types.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';
import { eventKeys } from '@/features/event-instance/queries.ts';
import { branchingKeys } from '@/features/branching/queries.ts';
import { objectInstanceKeys } from '@/features/object-instance/queries.ts';
import { queryClient } from '@/lib/core.tsx';

export const threadKeys = {
  all: (scenarioId: number) => ['threads', scenarioId] as const,
  detail: (scenarioId: number, id: number) =>
    [...threadKeys.all(scenarioId), 'detail', id] as const,
} as const;

export const useThreads = () => {
  return useQuery({
    queryKey: threadKeys.all(getScenarioIdFromPath()),
    queryFn: () => threadApi.getAll(),
  });
};

export const useThread = (threadId?: number) => {
  return useQuery({
    queryKey: threadKeys.detail(getScenarioIdFromPath(), threadId!),
    queryFn: () => threadApi.detail(threadId!),
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
    enabled: Number.isInteger(threadId),
  });
};

export const useThreadOffset = () => {
  return useMutation({
    mutationFn: ({ data }: { data: ThreadOffsetForm }) =>
      threadApi.offset(data),
    onSuccess: _ => {
      const scenarioId = getScenarioIdFromPath();
      successToast('Thread updated');
      void queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          { queryKey: threadKeys.all(scenarioId) },
          { queryKey: eventKeys.all(scenarioId) },
        ],
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update thread');
    },
  });
};

export const useUpdateThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Thread }) =>
      threadApi.update(id, data),
    onSuccess: _ => {
      successToast('Thread updated');
      void queryClient.invalidateQueries({
        queryKey: threadKeys.all(getScenarioIdFromPath()),
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update thread');
    },
  });
};

export const useCreateThread = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newThread: ThreadForm) => threadApi.create(newThread),
    onSuccess: _ => {
      successToast('Thread created');
      void queryClient.invalidateQueries({
        queryKey: threadKeys.all(getScenarioIdFromPath()),
      });
      void queryClient.invalidateQueries({
        queryKey: eventKeys.all(getScenarioIdFromPath()),
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create thread');
    },
  });
};

export const useDeleteThread = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => threadApi.delete(id),
    onSuccess: _ => {
      const scenarioId = getScenarioIdFromPath();
      void queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          { queryKey: threadKeys.all(scenarioId) },
          { queryKey: branchingKeys.all(scenarioId) },
          { queryKey: eventKeys.all(scenarioId) },
          { queryKey: objectInstanceKeys.all(scenarioId) },
        ],
      });
      successToast('Thread deleted');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete thread');
    },
  });
};

export const useDeleteThreads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await threadApi.delete(id).catch(() => {});
      }
      return { total: ids.length };
    },

    onSuccess: _ => {
      const scenarioId = getScenarioIdFromPath();
      void queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          { queryKey: threadKeys.all(scenarioId) },
          { queryKey: branchingKeys.all(scenarioId) },
          { queryKey: eventKeys.all(scenarioId) },
          { queryKey: objectInstanceKeys.all(scenarioId) },
        ],
      });
      successToast('Threads deleted');
    },

    onError: error => {
      handleErrorToast(error, 'Failed to delete some threads');
    },
  });
};
