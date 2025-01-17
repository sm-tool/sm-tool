import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { dateTime } from '@/lib/zod-types/date-time.types.ts';
import { textAreaString } from '@/lib/zod-types/test-area-string.types.ts';

export type ScenarioApiFilterMethods = 'findByTitle' | 'findByDescription';

const baseScenarioDTO = z.object({
  id: z.coerce.number().hiddenField(),
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
    description:
      'Title#Main title of the scenario together with detailed explanation help to understand scenario purpose and implementation details',
  }),
  description: textAreaString(),
  context: textAreaString({
    description:
      'Context#Background information and circumstances in which the scenario operates',
  }),
  purpose: textAreaString({
    description: 'Purpose#Specific goals and intended outcomes of the scenario',
  }),
  startDate: dateTime({
    description:
      'Start date#Start and end dates define time range when scenario should be executed',
  }),
  endDate: dateTime(),
  eventDuration: z.coerce
    .number({
      required_error: 'Duration of single event is required',
      invalid_type_error: 'Event duration must be a number',
      description:
        'Event Configuration#Duration and unit of time for single event execution, supported units a  re [h, min, s]',
    })
    .positive({ message: 'Event duration must be positive' })
    .default(1),
  eventUnit: z.string().default('min'),
  creationDate: dateTime().hiddenField(),
  lastModificationDate: dateTime().hiddenField(),
});

export const scenarioDTO = baseScenarioDTO.refine(
  data => new Date(data.startDate) < new Date(data.endDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  },
);

export const scenarioFormDTO = baseScenarioDTO
  .omit({
    id: true,
    creationDate: true,
    lastModificationDate: true,
  })
  .refine(data => new Date(data.startDate) < new Date(data.endDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export type Scenario = z.infer<typeof scenarioDTO>;
export type ScenarioFormType = z.infer<typeof scenarioFormDTO>;
