import { z } from 'zod';
import { qdsPurposeSchema } from '@/models/purpose/entity';
// import {
//   qdsObjectSchema,
//   qdsObjectTemplateSchema,
//   qdsObjectTypeSchema,
// } from '@/models/object/entity';
// import { qdsPermissionSchema } from '@/models/permission/entity';
// import { qdsAssociationTypeSchema } from '@/models/associacion/entity';
// import { qdsObserverSchema } from '@/models/observer/entity';
// import { qdsHistoryRecordSchema } from '@/models/history-record/entity';
// import { qdsPhaseSchema } from '@/models/phase/entity';
// import { qdsThreadSchema } from '@/models/thread/entity';
// import { qdsScenarioInformationSchema } from '@/models/scenario/information/entity';

export const qdsScenarioSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  description: z.string(),
  context: z.string(),

  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  actionDuration: z.coerce.number(),
  purposeTitle: qdsPurposeSchema, // todo, dodać do usera purpose żeby móc wybierać z listy

  // associations: z.array(qdsAssociationTypeSchema),
  //
  // objects: z.array(qdsObjectSchema),
  // objectTypes: z.array(qdsObjectTypeSchema),
  // objectTemplates: z.array(qdsObjectTemplateSchema),
  //
  // permissions: z.array(qdsPermissionSchema),
  //
  // observers: z.array(qdsObserverSchema),
  //
  // history: z.array(qdsHistoryRecordSchema),
  //
  // phases: z.array(qdsPhaseSchema),
  //
  // threads: z.array(qdsThreadSchema),
});
export type QdsScenario = z.infer<typeof qdsScenarioSchema>;
