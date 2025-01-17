import {
  queryOptions,
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
  ObjectTemplate,
  ObjectTemplateForm,
} from '@/features/object-template/types.ts';
import {
  HalObjectTemplateResponse,
  objectTemplateApi,
  ObjectTemplateRequest,
} from '@/features/object-template/api.ts';

export const objectTemplatesKeys = {
  all: ['objectTemplates'] as const,
  list: (request?: ObjectTemplateRequest) =>
    ['objectTemplates', request] as const,
  infinite: (request?: ObjectTemplateRequest) =>
    ['objectTemplates', 'infinite', request] as const,
  infiniteByObjectType: (
    objectTypeId: number,
    request: ObjectTemplateRequest,
  ) => ['objectTemplatesByTypeId', 'infinite', objectTypeId, request] as const,
  detail: (id: number) => ['objectTemplates', 'detail', id] as const,
};

export const useObjectTemplates = (
  request?: ObjectTemplateRequest,
): UseQueryResult<HalObjectTemplateResponse> => {
  return useQuery({
    queryKey: ['objectTemplates', request],
    queryFn: () => objectTemplateApi.getAll(request),
    staleTime: STALE_TIME.Short,
    gcTime: STALE_TIME.XLONG,
  });
};

export const useObjectTemplate = (id: number, options = {}) => {
  return useQuery({
    ...queryOptions({
      queryKey: objectTemplatesKeys.detail(id),
      queryFn: () => objectTemplateApi.getOne(id),
      select: data => ({
        ...data,
      }),
    }),
    ...options,
  });
};

export const useInfiniteObjectTemplate = (request?: ObjectTemplateRequest) => {
  return useInfiniteQuery<HalObjectTemplateResponse>({
    queryKey: objectTemplatesKeys.infinite(request),
    queryFn: ({ pageParam }) =>
      objectTemplateApi.getAll({
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

export const useInfiniteObjectTemplateByTypeId = (
  objectTypeId: number,
  request: ObjectTemplateRequest,
) => {
  return useInfiniteQuery<HalObjectTemplateResponse>({
    queryKey: objectTemplatesKeys.infiniteByObjectType(objectTypeId, request),
    queryFn: ({ pageParam }) =>
      objectTemplateApi.getAllByScenarioAndObjectTypeId(objectTypeId, {
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
  });
};

export const useUpdateObjectTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ObjectTemplate }) =>
      objectTemplateApi.update(id, data),
    onSuccess: _ => {
      successToast('Object type updated');
      void queryClient.invalidateQueries({
        queryKey: objectTemplatesKeys.all,
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update object type');
    },
  });
};

export const useCreateObjectTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newObjectTemplate: ObjectTemplateForm) =>
      objectTemplateApi.create(newObjectTemplate),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          {
            queryKey: objectTemplatesKeys.all,
          },
          {
            queryKey: objectTemplatesKeys.infinite(),
          },
        ],
      });

      successToast('Object type created');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create object type');
    },
  });
};

export const useDeleteObjectTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: objectTemplateApi.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: objectTemplatesKeys.all,
      });
      toast.success('Object type deleted');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete object type');
    },
  });
};
