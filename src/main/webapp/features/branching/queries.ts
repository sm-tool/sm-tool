import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { STALE_TIME } from '@/lib/api/constats.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { branchingApi } from '@/features/branching/api.ts';
import { Branching, BranchingForm } from '@/features/branching/types.ts';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';
import { useParams } from '@tanstack/react-router';
import { useThread } from '@/features/thread/queries.ts';

export const branchingKeys = {
  all: (scenarioId: number) => ['branching', scenarioId] as const,
  detail: (scenarioId: number, id: number) =>
    [...branchingKeys.all(scenarioId), 'detail', id] as const,
} as const;

export const useBranchings = () => {
  return useQuery({
    queryKey: branchingKeys.all(getScenarioIdFromPath()),
    queryFn: () => branchingApi.getAll(),
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useBranching = (branchingId?: number | null) => {
  return useQuery({
    queryKey: branchingKeys.detail(getScenarioIdFromPath(), branchingId!),
    queryFn: () => branchingApi.getOne(branchingId!),
    enabled: Number.isInteger(branchingId) && branchingId! > 0,
  });
};

export const useBranchingData = (
  branchingDirection: 'incoming' | 'outgoing',
) => {
  const { threadId } = useParams({ strict: false });
  const { data: thread } = useThread(Number(threadId));
  const branchingId =
    branchingDirection === 'incoming'
      ? thread?.incomingBranchingId
      : thread?.outgoingBranchingId;

  return useBranching(branchingId);
};

export const useUpdateBranching = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Branching }) =>
      branchingApi.update(id, data),
    onSuccess: _ => {
      successToast('Branching updated');
      void queryClient.invalidateQueries({
        queryKey: branchingKeys.all(getScenarioIdFromPath()),
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update branching');
    },
  });
};

export const useBranchingIncomingOutgoingThreadsLOCAL = (
  branchingIncomingId: number | null | undefined,
  branchingOutgoingId: number | null | undefined,
) => {
  const scenarioId = getScenarioIdFromPath();
  return useQueries({
    queries: [
      {
        queryKey: branchingKeys.detail(scenarioId, branchingIncomingId!),
        queryFn: () =>
          branchingIncomingId ? branchingApi.getOne(branchingIncomingId) : null,
        select: (data: Branching | null) => ({
          incomingIds: data?.comingIn || [],
          outgoingIds: [],
        }),
        enabled: !!branchingIncomingId,
      },
      {
        queryKey: branchingKeys.detail(scenarioId, branchingOutgoingId!),
        queryFn: () =>
          branchingOutgoingId ? branchingApi.getOne(branchingOutgoingId) : null,
        select: (data: Branching | null) => ({
          incomingIds: [],
          outgoingIds: data?.comingOut || [],
        }),
        enabled: !!branchingOutgoingId,
      },
    ],
  });
};

export const useCreateBranching = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: BranchingForm }) =>
      branchingApi.create(data),

    onSuccess: _ => {
      successToast('Branching created');
      void queryClient.invalidateQueries({
        queryKey: branchingKeys.all(getScenarioIdFromPath()),
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create branching');
    },
  });
};

export const useDeleteBranching = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => branchingApi.delete(id),
    onSuccess: _ => {
      successToast('Branching deleted');
      void queryClient.invalidateQueries({
        queryKey: branchingKeys.all(getScenarioIdFromPath()),
      });
      successToast('Branching deleted');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete branching');
    },
  });
};
