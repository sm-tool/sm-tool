export const associationChangeKeys = {
  all: (scenarioId: number) => ['associationChanges', scenarioId] as const,
  detail: (scenarioId: number, associationChangeId: number) =>
    [
      ...associationChangeKeys.all(scenarioId),
      'detail',
      associationChangeId,
    ] as const,
  withRelations: (
    scenarioId: number,
    associationTypeId: number,
    object1Id: number,
    object2Id: number,
  ) =>
    [
      ...associationChangeKeys.all(scenarioId),
      'relations',
      associationTypeId,
      object1Id,
      object2Id,
    ] as const,
} as const;
