import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { objectInstanceApi } from '@/features/object-instance/api.ts';
import {
  ObjectInstance,
  ObjectInstanceForm,
} from '@/features/object-instance/types.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';
import {
  attributeTemplateKeys,
  useAllTemplateAttributes,
} from '@/features/attribute-template/queries.ts';
import {
  eventKeys,
  useThreadFirstEvent,
} from '@/features/event-instance/queries.ts';
import { AttributeTemplate } from '@/features/attribute-template/types.ts';

export const objectInstanceKeys = {
  all: (scenarioId: number) => ['objectInstances', scenarioId] as const,
  detail: (scenarioId: number, id: number) =>
    [...objectInstanceKeys.all(scenarioId), 'detail', id] as const,
  startingAttributes: (scenarioId: number, objectId: number) =>
    [
      ...objectInstanceKeys.detail(scenarioId, objectId),
      'attributes',
      objectId,
    ] as const,
  possibleAssociations: (
    scenarioId: number,
    threadId: number,
    objectId: number,
  ) => [scenarioId, threadId, objectId, 'possibleAssociations'],
  allOfThread: (scenarioId: number, threadId: number) => [
    scenarioId,
    threadId,
    'allOfThread',
  ],
} as const;

export const useObjectInstances = () => {
  return useQuery({
    queryKey: objectInstanceKeys.all(getScenarioIdFromPath()),
    queryFn: () => objectInstanceApi.getAll(),
  });
};

export const useObjectInstance = (objectId: number) => {
  return useQuery({
    queryKey: objectInstanceKeys.detail(getScenarioIdFromPath(), objectId),
    queryFn: () => objectInstanceApi.detail(objectId),
  });
};

export const useObjectInstancePossibleAssociationOnThread = (
  theadId: number,
  objectInstanceId: number,
) => {
  return useQuery({
    queryKey: objectInstanceKeys.possibleAssociations(
      getScenarioIdFromPath(),
      theadId,
      objectInstanceId,
    ),
    queryFn: () =>
      objectInstanceApi.objectInstancePossibleAssociation({
        threadId: theadId,
        objectId: objectInstanceId,
      }),
    enabled: theadId > 0 && objectInstanceId > 0,
  });
};

export const useObjectInstancesOfThread = (threadId: number) => {
  return useQuery({
    queryKey: objectInstanceKeys.allOfThread(getScenarioIdFromPath(), threadId),
    queryFn: () => objectInstanceApi.getAllOfThread(threadId),
  });
};

export const useArrayOfObjectInstances = (objectsId: number[]) => {
  const scenarioId = getScenarioIdFromPath();

  return useQueries({
    queries: objectsId.map(id => ({
      queryKey: objectInstanceKeys.detail(scenarioId, id),
      queryFn: () => objectInstanceApi.detail(id),
    })),
  });
};

export const useObjectStartingAttributesValues = (objectId: number) => {
  const object = useObjectInstance(objectId);
  const defaultAttributes = useAllTemplateAttributes(object.data!.templateId, {
    enabled: object.isSuccess,
  });
  const startingEvent = useThreadFirstEvent(object.data!.originThreadId, {
    enabled: object.isSuccess,
  });

  const isLoading =
    object.isLoading || defaultAttributes.isLoading || startingEvent.isLoading;
  const error = object.error || defaultAttributes.error || startingEvent.error;

  return useQuery<{ attributeTemplate: AttributeTemplate; value: string }[]>({
    queryKey: objectInstanceKeys.startingAttributes(
      getScenarioIdFromPath(),
      objectId,
    ),
    queryFn: () => {
      if (isLoading || error) return [];
      return (
        defaultAttributes.data?.map(attribute => ({
          attributeTemplate: attribute,
          value:
            startingEvent.data?.attributeChanges?.find(
              attribute_ => attribute_.attributeId === attribute.id,
            )?.changeType.to || '',
        })) || []
      );
    },
    enabled: !isLoading && !error,
  });
};

export const useUpdateObjectInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ObjectInstance }) =>
      objectInstanceApi.update(id, data),
    onSuccess: _ => {
      successToast('Object updated');
      void queryClient.invalidateQueries({
        queryKey: objectInstanceKeys.all(getScenarioIdFromPath()),
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to update object');
    },
  });
};

export const useCreateObjectInstance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ObjectInstanceForm) => objectInstanceApi.create(data),
    onSuccess: _ => {
      successToast('Object created');
      void queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          {
            queryKey: attributeTemplateKeys.all,
          },
          {
            queryKey: objectInstanceKeys.all(getScenarioIdFromPath()),
          },
          {
            queryKey: eventKeys.all(getScenarioIdFromPath()),
          },
        ],
      });
      // void queryClient.invalidateQueries({
      //   queryKey: objectInstanceKeys.all(getScenarioIdFromPath()),
      // });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to create object');
    },
  });
};

export const useDeleteObjectInstance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => objectInstanceApi.delete(id),
    onSuccess: _ => {
      successToast('Object deleted');
      void queryClient.invalidateQueries({
        // @ts-expect-error -- działa, to co za problem ... chyba
        queries: [
          {
            queryKey: attributeTemplateKeys.all,
          },
          {
            queryKey: objectInstanceKeys.all(getScenarioIdFromPath()),
          },
          {
            queryKey: eventKeys.all(getScenarioIdFromPath()),
          },
        ],
      });
    },
    onError: error => {
      handleErrorToast(error, 'Failed to delete object');
    },
  });
};
