import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { STALE_TIME } from '@/lib/api/constats.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { toast } from 'sonner';
import {
  associationTypeApi,
  AssociationTypeByIdRequest,
  AssociationTypeRequest,
  HalAssociationTypeResponse,
} from '@/features/association-type/api.ts';
import {
  AssociationType,
  AssociationTypeCreateForm,
} from '@/features/association-type/types.ts';
import { QueryRequest } from '@/lib/hal-pagination/types/pagination.types.ts';

export const associationTypeKeys = {
  all: ['associationTypes'] as const,
  list: (request?: AssociationTypeRequest) =>
    ['associationTypes', request] as const,
  objectsList1: (id: number) =>
    ['associationTypes', 'objectsList1', id] as const,
  objectsList2: (id: number) =>
    ['associationTypes', 'objectsList2', id] as const,
  infinite: (request?: AssociationTypeRequest) =>
    ['associationTypes', 'infinite', request] as const,
  paginated: (
    objectId: number,
    request?: QueryRequest<AssociationType, AssociationTypeByIdRequest>,
  ) => ['associationTypeById', objectId, request],
  detail: (id: number) => ['associationTypes', 'detail', id] as const,
};

export const useAssociationTypes = (
  request?: AssociationTypeRequest,
): UseQueryResult<HalAssociationTypeResponse> => {
  return useQuery({
    queryKey: ['associationTypes', request],
    queryFn: () => associationTypeApi.getAll(request),
  });
};

export const useAssociationType = (id: number) => {
  return useQuery({
    queryKey: associationTypeKeys.detail(id),
    queryFn: () => associationTypeApi.getOne(id),
    select: data => ({
      ...data,
    }),
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useAssociationTypeByObject1 = (object1Id: number) => {
  return useQuery<AssociationType[]>({
    queryKey: associationTypeKeys.objectsList1(object1Id),
    queryFn: () => associationTypeApi.getAllByObjectsBy1Id(object1Id),
  });
};

export const useAssociationTypeByObject2 = (object2Id: number) => {
  return useQuery<AssociationType[]>({
    queryKey: associationTypeKeys.objectsList2(object2Id),
    queryFn: () => associationTypeApi.getAllByObjectsBy2Id(object2Id),
  });
};

export const useInfiniteAssociationType = (
  request?: AssociationTypeRequest,
) => {
  return useInfiniteQuery<HalAssociationTypeResponse>({
    queryKey: associationTypeKeys.infinite(request),
    queryFn: ({ pageParam }) =>
      associationTypeApi.getAll({
        ...request,
        pagination: {
          page: pageParam as number,
          size: 10,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      if (lastPage._links.next) {
        return lastPage.page.number + 1;
      }
      return;
    },
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const usePaginatedByXid = (
  typeId: number,
  request: QueryRequest<AssociationType, AssociationTypeByIdRequest>,
) => {
  return useQuery({
    queryKey: associationTypeKeys.paginated(typeId, request),
    queryFn: () => associationTypeApi.getAllByXIdPaginated(typeId, request),
  });
};

export const useUpdateAssociationType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AssociationType }) =>
      associationTypeApi.update(id, data),
    onSuccess: _ => {
      successToast('Object type updated');
      void queryClient.invalidateQueries({
        queryKey: associationTypeKeys.all,
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update object type');
    },
  });
};

export const useCreateAssociationType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAssociationType: AssociationTypeCreateForm) =>
      associationTypeApi.create(newAssociationType),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: associationTypeKeys.all,
      });

      successToast('Object type created');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create object type');
    },
  });
};

export const useDeleteAssociationType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: associationTypeApi.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: associationTypeKeys.all,
      });
      toast.success('Object type deleted');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete object type');
    },
  });
};
