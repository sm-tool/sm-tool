import {
  queryOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  EventInstance,
  EventInstanceForm,
} from '@/features/event-instance/types.ts';
import { eventApi } from '@/features/event-instance/api.ts';
import { successToast } from '@/components/ui/shadcn/toaster.tsx';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';
import { threadKeys, useThread } from '@/features/thread/queries.ts';
import { objectInstanceKeys } from '@/features/object-instance/queries.ts';
import { objectInstanceApi } from '@/features/object-instance/api.ts';
import React from 'react';
import { useEventForm } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import { threadApi } from '@/features/thread/api.ts';
import { attributeInstanceApi } from '@/features/attribute/api.ts';

export const eventKeys = {
  all: (scenarioId: number) => ['events', scenarioId] as const,
  threaded: (scenarioId: number, threadId: number) =>
    [...eventKeys.all(scenarioId), 'threaded', threadId] as const,
  detail: (scenarioId: number, id: number) =>
    [...eventKeys.all(scenarioId), 'detail', id] as const,
  state: (scenarioId: number, id: number) =>
    [...eventKeys.all(scenarioId), 'state', id] as const,
  previousState: (scenarioId: number, id: number) => [
    ...eventKeys.all(scenarioId),
    'previousState',
    id,
  ],
} as const;

export const useEvents = () => {
  return useQuery({
    queryKey: eventKeys.all(getScenarioIdFromPath()),
    queryFn: () => eventApi.getAll(),
  });
};

export const useEvent = (eventId?: number, options = {}) => {
  return useQuery({
    ...queryOptions({
      queryKey: eventKeys.detail(getScenarioIdFromPath(), eventId!),
      queryFn: () => eventApi.getOne(eventId!),
      enabled: Number.isInteger(eventId) && eventId! > 0,
      retry: false,
    }),
    ...options,
  });
};

export const useEventState = (eventId: number) => {
  return useQuery({
    queryKey: eventKeys.state(getScenarioIdFromPath(), eventId),
    queryFn: () => eventApi.getEventState(eventId),
  });
};

export const usePreviousEventState = (eventId: number) => {
  return useQuery({
    queryKey: eventKeys.previousState(getScenarioIdFromPath(), eventId),
    queryFn: () => eventApi.getPreviousEventState(eventId),
  });
};

export const useThreadEvents = (threadId: number) => {
  return useQuery<EventInstance[]>({
    queryKey: eventKeys.threaded(getScenarioIdFromPath(), threadId),
    queryFn: () => eventApi.getAllFromThread(threadId),
  });
};

export const useThreadFirstEvent = (threadId?: number, options = {}) =>
  useQuery({
    ...queryOptions({
      queryKey: eventKeys.threaded(getScenarioIdFromPath(), threadId!),
      queryFn: () => eventApi.getAllFromThread(threadId!),
      select: data => data[0],
    }),
    ...options,
  });

export const useThreadEventLOCAL = (threadId: number, eventId: number) => {
  return useQuery<EventInstance[], Error, EventInstance | undefined>({
    queryKey: eventKeys.threaded(getScenarioIdFromPath(), threadId),
    queryFn: () => eventApi.getAllFromThread(threadId),
    select: data => data.find(event => event.id === eventId),
    enabled: Number.isInteger(threadId) && Number.isInteger(eventId),
  });
};

export const usePossibleAssociationMapForEvent = (eventId: number) => {
  const { data: event, isSuccess: eventLoaded } = useEvent(eventId);
  const { data: thread, isSuccess: threadLoaded } = useThread(event?.threadId);
  const queries = React.useMemo(
    () =>
      thread?.objectIds.map(objectId => ({
        queryKey: objectInstanceKeys.possibleAssociations(
          getScenarioIdFromPath(),
          thread?.id,
          objectId,
        ),
        enabled: eventLoaded && threadLoaded,
        queryFn: () =>
          objectInstanceApi.objectInstancePossibleAssociation({
            objectId: objectId,
            threadId: thread?.id,
          }),
        objectId,
      })) ?? [],
    [thread?.objectIds, thread?.id, eventLoaded, threadLoaded],
  );
  const objectsPossibleAssociations = useQueries({
    queries,
  });
  const { data: eventState, isSuccess: eventStateLoaded } =
    useEventState(eventId);
  const { event: eventChangesState, associationBrakeIds } = useEventForm();

  return React.useMemo(() => {
    if (
      objectsPossibleAssociations.some(result => result.isLoading) ||
      !eventStateLoaded
    ) {
      return {
        allConnections: new Map<string, number>(),
        possibleConnections: new Map<string, number>(),
      };
    }

    const allConnections = new Map<string, number>();
    for (const [index, query] of objectsPossibleAssociations.entries()) {
      const sourceObjectId = queries[index].objectId;
      const possibleAssociations = query.data ?? [];
      for (const association of possibleAssociations) {
        const key = `${sourceObjectId}-${association.objectId}`;
        allConnections.set(key, association.associationTypeId);
      }
    }
    const eventsCombined = [
      ...eventState.associationsState.filter(
        association =>
          association.associationOperation === 'INSERT' &&
          !associationBrakeIds.includes(association.associationTypeId),
      ),
      ...eventChangesState.associationChanges,
    ];

    const possibleConnections = new Map(allConnections);
    for (const associationChange of eventsCombined) {
      const key = `${associationChange.object1Id}-${associationChange.object2Id}`;
      possibleConnections.delete(key);
    }
    return { allConnections, possibleConnections };
  }, [
    objectsPossibleAssociations,
    queries,
    eventState?.associationsState,
    eventChangesState.associationChanges,
  ]);
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const scenarioId = getScenarioIdFromPath();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EventInstanceForm }) =>
      eventApi.update(id, data),
    onSuccess: async event => {
      successToast('Event updated');

      await queryClient.invalidateQueries({
        queryKey: eventKeys.all(scenarioId),
      });

      const attributeIds = [
        ...new Set(event.attributeChanges.map(change => change.attributeId)),
      ];

      const attributeQueries = attributeIds.map(attributeId =>
        attributeInstanceApi.getOne(attributeId),
      );

      const attributeResults = await Promise.all(attributeQueries);

      const objectIds = [
        ...new Set(attributeResults.flatMap(result => result.objectId)),
      ];

      await Promise.all(
        objectIds.map(objectId =>
          queryClient.invalidateQueries({
            queryKey: objectInstanceKeys.startingAttributes(
              scenarioId,
              objectId,
            ),
          }),
        ),
      );
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ event }: { event: EventInstance }) => {
      await eventApi.update(event.id, {
        id: event.id,
        title: event.title,
        description: event.description,
        associationChanges: [],
        attributeChanges: [],
      });
      return await threadApi.offset({
        threadId: event.threadId,
        time: event.time,
        shift: -1,
      });
    },
    onSuccess: _ => {
      successToast('Event deleted');
      void queryClient.invalidateQueries({
        queryKey: threadKeys.all(getScenarioIdFromPath()),
      });

      void queryClient.invalidateQueries({
        queryKey: eventKeys.all(getScenarioIdFromPath()),
      });
    },
  });
};
