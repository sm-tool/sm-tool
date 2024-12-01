import { z } from 'zod';
import { createDateTime, createTextAreaString } from '@/types/zod.tsx';

export const ScenarioDTO = z.object({
  id: z.number(),
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
  }),
  description: createTextAreaString().optional(),
  context: createTextAreaString().optional(),
  purpose: createTextAreaString(),
  startDate: createDateTime(),
  endDate: createDateTime(),
  eventDuration: z.coerce
    .number({
      required_error: 'Duration of single event is required',
      invalid_type_error: 'Event duration must be a number',
    })
    .positive({ message: 'Event duration must be positive' }),
  creationDate: createDateTime(),
  lastModificationDate: createDateTime(),
});

export const scenarioFormDTO = ScenarioDTO.omit({
  id: true,
  creationDate: true,
  lastModificationDate: true,
});

export type Scenario = z.infer<typeof ScenarioDTO>;
export type ScenarioForm = z.infer<typeof scenarioFormDTO>;
