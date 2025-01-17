import { z } from 'zod';

export enum ScenarioEventType {
  INVALIDATE = 'CREATED',
}

// Definicja schematu Zod
export const ScenarioEventSchema = z.object({
  type: z.nativeEnum(ScenarioEventType),
  data: z.object({
    entityName: z.string(),
    entityId: z.string(),
  }),
});

// Typ inferowany z schematu
export type ScenarioMessage = z.infer<typeof ScenarioEventSchema>;
