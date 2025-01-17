import { EventInstance } from '@/features/event-instance/types.ts';

export const convertToEventInstanceForm = (event: EventInstance) => {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    associationChanges: event.associationChanges
      .filter(change => change.changeType.to !== null)
      .map(change => ({
        associationTypeId: change.associationTypeId,
        object1Id: change.object1Id,
        object2Id: change.object2Id,
        associationOperation: change.changeType.to!,
      })),
    attributeChanges: event.attributeChanges
      .filter(change => change.changeType.to !== null)
      .map(change => ({
        attributeId: change.attributeId,
        value: change.changeType.to,
      })),
  };
};
