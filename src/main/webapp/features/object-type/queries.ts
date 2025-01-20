import { QueryRequest } from '@/lib/hal-pagination/types/pagination.types.ts';
import {
  ObjectType,
  ObjectTypeApiFilterMethods,
  ObjectTypeForm,
} from '@/features/object-type/types.ts';
import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  HalObjectTypeResponse,
  objectTypeApi,
} from '@/features/object-type/api.ts';
import { STALE_TIME } from '@/lib/api/constats.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { toast } from 'sonner';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';

export const objectTypesKeys = {
  all: ['objectTypes'] as const,
  list: (request?: QueryRequest<ObjectType, ObjectTypeApiFilterMethods>) =>
    ['objectTypes', request] as const,
  listScenario: (scenarioId: number) => ['objectTypes', 'scenario', scenarioId],
  infiniteGlobal: (
    request?: QueryRequest<ObjectType, ObjectTypeApiFilterMethods>,
  ) => ['objectTypes', 'infiniteGlobal', request] as const,
  infiniteHeadless: (
    scenarioId: number,
    request?: QueryRequest<ObjectType, ObjectTypeApiFilterMethods>,
  ) => ['objectTypes', 'infiniteHeadless', scenarioId, request] as const,
  detail: (id: number) => ['objectTypes', 'detail', id] as const,
  hierarchy: {
    all: ['objectTypes', 'hierarchy'] as const,
    roots: () => ['objectTypes', 'hierarchy', 'roots'] as const,
    children: (parentId: number) =>
      ['objectTypes', 'hierarchy', 'children', parentId] as const,
  },
};

export const useObjectTypes = (
  request?: QueryRequest<ObjectType, ObjectTypeApiFilterMethods>,
): UseQueryResult<HalObjectTypeResponse> => {
  return useQuery({
    queryKey: ['objectTypes', request],
    queryFn: () => objectTypeApi.getAll(request),
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useObjectType = (id?: number, options = {}) => {
  return useQuery({
    ...queryOptions({
      queryKey: objectTypesKeys.detail(id!),
      queryFn: () => objectTypeApi.getOne(id!),
      enabled: Number.isInteger(id) && id! > 0,
      select: data => ({
        ...data,
      }),
    }),
    ...options,
  });
};

export const useObjectTypeScenarioList = () => {
  return useQuery({
    queryKey: objectTypesKeys.listScenario(getScenarioIdFromPath()),
    queryFn: () => objectTypeApi.getAllScenarioTypesIds(),
  });
};

export const useInfiniteGlobalObjectType = (
  request?: QueryRequest<ObjectType, ObjectTypeApiFilterMethods>,
) => {
  return useInfiniteQuery<HalObjectTypeResponse>({
    queryKey: objectTypesKeys.infiniteGlobal(request),
    queryFn: ({ pageParam }) =>
      objectTypeApi.getAll({
        ...request,
        pagination: {
          page: pageParam as number,
          size: 10,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: lastPage =>
      lastPage._links.next ? lastPage.page.number + 1 : undefined,
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useInfiniteObjectTypeHeaderLess = (
  scenarioId: number,
  request?: QueryRequest<ObjectType, ObjectTypeApiFilterMethods>,
) => {
  return useInfiniteQuery<HalObjectTypeResponse>({
    queryKey: objectTypesKeys.infiniteHeadless(scenarioId, request),
    queryFn: ({ pageParam }) =>
      objectTypeApi.getAllHeaderless(scenarioId, {
        ...request,
        pagination: {
          page: pageParam as number,
          size: 10,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: lastPage =>
      lastPage._links.next ? lastPage.page.number + 1 : undefined,
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useObjectTypeRoots = () => {
  return useQuery({
    queryKey: objectTypesKeys.hierarchy.roots(),
    queryFn: () => objectTypeApi.getRoots(),
  });
};

export const useObjectTypeChildren = (parentId: number, enabled: boolean) => {
  return useQuery({
    queryKey: objectTypesKeys.hierarchy.children(parentId),
    queryFn: () => objectTypeApi.getChildren(parentId),
    enabled: !!parentId && enabled,
  });
};

export const useUpdateObjectType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ObjectType }) =>
      objectTypeApi.update(id, data),
    onSuccess: _ => {
      successToast('Object type updated');
      void queryClient.invalidateQueries({ queryKey: objectTypesKeys.all });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update object type');
    },
  });
};

export const useCreateObjectType = (options?: {
  onTemplateCreateIntent?: (data: ObjectType) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newObjectType: ObjectTypeForm) =>
      objectTypeApi.create(newObjectType),
    onSuccess: response => {
      void queryClient.invalidateQueries({ queryKey: objectTypesKeys.all });
      toast.success('Object type created', {
        action: {
          label: 'Create matching template',
          onClick: () => options?.onTemplateCreateIntent?.(response),
        },
        duration: 5000,
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create object type');
    },
  });
};

export const useDeleteObjectType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: objectTypeApi.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: objectTypesKeys.all });
      toast.success('Object type deleted');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete object type');
    },
  });
};

export const useObjectTypeAssigment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: objectTypeApi.assignToScenario,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: objectTypesKeys.all });
      toast.success('Imported types');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to import types');
    },
  });
};
