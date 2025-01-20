import { EventInstance } from '@/features/event-instance/types.ts';
import { AttributeChange } from '@/features/attribute-changes/types.ts';
import React from 'react';
import { useEvent, useUpdateEvent } from '@/features/event-instance/queries.ts';
import { convertToEventInstanceForm } from '@/features/event-instance/utils/convert-to-event-instance-form.ts';
import { AssociationChange } from '@/features/association-change/types.ts';
import { useParams } from '@tanstack/react-router';

type EventFormContext = {
  event: EventInstance;
  originalMaps: {
    attributes: Record<string, AttributeChange>;
    associations: Record<string, AssociationChange>;
  };
  dirtyAttributesCount: number;
  dirtyAssociationsCount: number;
  updateAttribute: (change: AttributeChange) => void;
  deleteAttribute: (change: AttributeChange) => void;
  createAttributeChange: (change: AttributeChange) => void;
  submitChanges: () => Promise<void>;
  isDirty: boolean;
  createAssociationState: (associationChange: AssociationChange) => void;
  changeAssociationState: (associationChange: AssociationChange) => void;
  deleteAssociationState: (associationChange: AssociationChange) => void;
  associationBrakeIds: number[];
};

const EventFormContext = React.createContext<EventFormContext | null>(null);

const EventFormProvider = ({ children }: { children: React.ReactNode }) => {
  const { eventId } = useParams({
    strict: false,
  });
  const eventQuery = useEvent(Number(eventId));
  const event = eventQuery.data;
  const updateEventQuery = useUpdateEvent();

  const createAssociationKey = (association: AssociationChange) => {
    return `${association.associationTypeId}-${association.object1Id}-${association.object2Id}`;
  };

  const [formState, setFormState] = React.useState<EventInstance | undefined>();
  const [originalMaps, setOriginalMaps] = React.useState<
    | {
        attributes: Record<string, AttributeChange>;
        associations: Record<string, AssociationChange>;
      }
    | undefined
  >();

  const [associationBrakeIds, setAssociationBrakeId] = React.useState<number[]>(
    [],
  );
  const isDirty = React.useMemo(() => {
    if (!formState || !event) return false;
    return JSON.stringify(formState) !== JSON.stringify(event);
  }, [formState, event]);

  const updateAttribute = (change: AttributeChange) => {
    setFormState(previous => {
      if (!previous) return previous;
      return {
        ...previous,
        attributeChanges: previous.attributeChanges.map(attribute =>
          attribute.attributeId === change.attributeId ? change : attribute,
        ),
      };
    });
  };

  const deleteAttribute = (change: AttributeChange) => {
    setFormState(previous => {
      if (!previous) return previous;
      return {
        ...previous,
        attributeChanges: previous.attributeChanges.filter(
          attribute => attribute.attributeId !== change.attributeId,
        ),
      };
    });

    setOriginalMaps(previous => {
      if (!previous) return previous;
      const newAttributes = { ...previous.attributes };
      // eslint-disable-next-line -- safely delted
      delete newAttributes[change.attributeId];
      return {
        ...previous,
        attributes: newAttributes,
      };
    });
  };

  const createAttributeChange = (change: AttributeChange) => {
    setFormState(previous => {
      if (!previous) return previous;
      return {
        ...previous,
        attributeChanges: [...previous.attributeChanges, change],
      };
    });

    setOriginalMaps(previous => {
      if (!previous) return previous;
      return {
        ...previous,
        attributes: {
          ...previous.attributes,
          [change.attributeId]: change,
        },
      };
    });
  };

  const createAssociationState = (associationChange: AssociationChange) => {
    setFormState(previous => {
      if (!previous) {
        return previous;
      }
      setAssociationBrakeId(previous =>
        previous.filter(
          associationId =>
            associationId !== associationChange.associationTypeId,
        ),
      );
      return {
        ...previous,
        associationChanges: [...previous.associationChanges, associationChange],
      };
    });
  };

  const changeAssociationState = (change: AssociationChange) => {
    setFormState(previous => {
      if (!previous) return previous;
      return {
        ...previous,
        associationChanges: previous.associationChanges.map(association =>
          association.associationTypeId === change.associationTypeId
            ? change
            : association,
        ),
      };
    });
  };

  const deleteAssociationState = (change: AssociationChange) => {
    setFormState(previous => {
      if (!previous) {
        return previous;
      }
      setAssociationBrakeId(previous => [
        ...previous,
        change.associationTypeId,
      ]);
      return {
        ...previous,
        associationChanges: previous.associationChanges.filter(
          associationState =>
            !(
              associationState.object1Id === change.object1Id &&
              associationState.object2Id === change.object2Id &&
              associationState.associationTypeId === change.associationTypeId
            ),
        ),
      };
    });
  };

  const submitChanges = async () => {
    if (!event || !formState) return;
    setAssociationBrakeId([]);
    await updateEventQuery.mutateAsync({
      id: Number(eventId),
      data: convertToEventInstanceForm(formState),
    });
    await eventQuery.refetch();
  };

  React.useEffect(() => {
    if (event) {
      setFormState(event);

      const mappedAttributes = event.attributeChanges.reduce<
        Record<string, AttributeChange>
      >((accumulator, change) => {
        accumulator[change.attributeId] = change;
        return accumulator;
      }, {});

      const mappedAssociations = event.associationChanges.reduce<
        Record<string, AssociationChange>
      >((accumulator, change) => {
        accumulator[createAssociationKey(change)] = change;
        return accumulator;
      }, {});

      setOriginalMaps({
        attributes: mappedAttributes,
        associations: mappedAssociations,
      });
    }
  }, [event]);

  const dirtyAttributesCount = React.useMemo(() => {
    if (!formState) return 0;

    let count = 0;
    for (const change of formState.attributeChanges) {
      if (
        change.changeType.to !==
        event?.attributeChanges.find(
          attribute => attribute.attributeId === change.attributeId,
        )?.changeType.to
      ) {
        count++;
      }
    }
    return count;
  }, [formState, event]);

  const dirtyAssociationsCount = React.useMemo(() => {
    if (!formState || !originalMaps) return 0;

    return formState.associationChanges.reduce((count, current) => {
      const original = originalMaps.associations[createAssociationKey(current)];
      if (!original) return count + 1;
      if (JSON.stringify(current) !== JSON.stringify(original))
        return count + 1;
      return count;
    }, 0);
  }, [formState, originalMaps]);

  if (!formState || !originalMaps) {
    return null;
  }

  return (
    <EventFormContext.Provider
      value={{
        event: formState,
        originalMaps,
        createAttributeChange,
        updateAttribute,
        deleteAttribute,
        dirtyAttributesCount,
        dirtyAssociationsCount,
        submitChanges,
        isDirty,
        createAssociationState,
        changeAssociationState,
        deleteAssociationState,
        associationBrakeIds,
      }}
    >
      {children}
    </EventFormContext.Provider>
  );
};
export const useEventForm = () => {
  const context = React.useContext(EventFormContext);

  if (!context) {
    throw new Error('useEventForm must be used within EventFormProvider');
  }

  return context;
};

export default EventFormProvider;
