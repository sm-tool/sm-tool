import { z } from 'zod';
import { qdsObjectChangeSchema } from '@/models/object/entity';
import { qdsAssociationChangeSchema } from '@/models/associacion/entity';

const qdsEventTypeSchema = z.enum([
  'GLOBAL',
  'NORMAL',
  'START',
  'END',
  'IDLE',
  'MERGE_OUT',
  'MERGE_IN',
  'FORK_OUT',
  'FORK_IN',
]);
export type QdsEventType = z.infer<typeof qdsEventTypeSchema>;

export const qdsEventSchema = z.object({
  id: z.string(),

  type: qdsEventTypeSchema,
  deltaTime: z.number(),

  title: z.string(),
  description: z.string(),

  objectChanges: z.array(qdsObjectChangeSchema),
  associationChanges: z.array(qdsAssociationChangeSchema),
});
export type QdsEventDescription = z.infer<typeof qdsEventSchema>;
