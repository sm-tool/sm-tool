import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { textAreaString } from '@/lib/zod-types/test-area-string.types.ts';
import { color } from '@/lib/zod-types/color.types.ts';

export const scenarioPhaseDTO = z.object({
  id: z.coerce.number().hiddenField(),
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
    description: 'Phase title#Name of the scenario phase',
  }),
  description: textAreaString({
    description:
      'Phase description#Detailed description of the scenario phase and its purpose',
  }),
  color: color({
    description:
      'Phase color#Visual indicator color used to distinguish the phase in timeline',
  }).default('#FFFFFF'),
  startTime: z.coerce.number().gte(0).finite().hiddenField(),
  endTime: z.coerce.number().gte(0).finite().hiddenField(),
  scenarioId: z.coerce.number().hiddenField(),
});

export const scenarioPhaseFormDTO = scenarioPhaseDTO.omit({
  id: true,
});

export type ScenarioPhase = z.infer<typeof scenarioPhaseDTO>;
export type ScenarioPhaseForm = z.infer<typeof scenarioPhaseFormDTO>;
