import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { attributeTemplateApi } from '@/features/attribute-template/api.ts';
import { AttributeTemplate } from '@/features/attribute-template/types.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { objectInstanceKeys } from '@/features/object-instance/queries.ts';
import {
  getScenarioIdFromPath,
  hasScenarioInPath,
} from '@/features/scenario/utils/get-scenario-id-from-path.tsx';
import { eventKeys } from '@/features/event-instance/queries.ts';

export const attributeTemplateKeys = {
  all: ['attributeTemplates'] as const,
  detail: (id: number) => ['attributeTemplates', id] as const,
  template: (templateId: number) =>
    ['attributeTemplates', 'template', templateId] as const,
};

export const useAllTemplateAttributes = (templateId?: number, options = {}) =>
  useQuery({
    ...queryOptions({
      queryKey: attributeTemplateKeys.template(templateId!),
      queryFn: () => attributeTemplateApi.getAllofTemplate(templateId!),
    }),
    ...options,
  });

export const useAttributeTemplate = (id?: number) => {
  return useQuery({
    queryKey: attributeTemplateKeys.detail(id!),
    queryFn: () => attributeTemplateApi.getOne(id!),
    enabled: Number.isInteger(id) && id! > 0,
  });
};

export const useCreateAttributeTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributeTemplateApi.create,
    onSuccess: async () => {
      successToast('Attribute template created');

      await queryClient.invalidateQueries({
        queryKey: eventKeys.all(getScenarioIdFromPath()),
      });
      await queryClient.invalidateQueries({
        queryKey: attributeTemplateKeys.all,
      });
      await queryClient.invalidateQueries({
        queryKey: objectInstanceKeys.all(getScenarioIdFromPath()),
      });
      await queryClient.invalidateQueries({
        queryKey: objectInstanceKeys.all(getScenarioIdFromPath()),
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create attribute template');
    },
  });
};

export const useCreateAttributeTemplateOnGlobalPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributeTemplateApi.create,
    onSuccess: async () => {
      successToast('Attribute template created');

      await queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          {
            queryKey: attributeTemplateKeys.all,
          },
        ],
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create attribute template');
    },
  });
};

export const useUpdateAttributeTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      attributeTemplate,
    }: {
      id: number;
      attributeTemplate: AttributeTemplate;
    }) => attributeTemplateApi.update(id, attributeTemplate),
    onSuccess: async (_, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: attributeTemplateKeys.detail(id),
        }),
        queryClient.invalidateQueries({ queryKey: attributeTemplateKeys.all }),
      ]);

      successToast('Attribute template updated');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update attribute template');
    },
  });
};

export const useDeleteAttributeTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributeTemplateApi.delete,
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: attributeTemplateKeys.detail(id),
        }),
        queryClient.invalidateQueries({ queryKey: attributeTemplateKeys.all }),
      ]);
      if (hasScenarioInPath()) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: objectInstanceKeys.all(getScenarioIdFromPath()),
          }),

          queryClient.invalidateQueries({
            queryKey: eventKeys.all(getScenarioIdFromPath()),
          }),
        ]);
      }

      successToast('Attribute template deleted');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete attribute template');
    },
  });
};

export const useGlobalDeleteAttributeTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributeTemplateApi.delete,
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: attributeTemplateKeys.detail(id),
        }),
        queryClient.invalidateQueries({ queryKey: attributeTemplateKeys.all }),
      ]);

      successToast('Attribute template deleted');
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete attribute template');
    },
  });
};
