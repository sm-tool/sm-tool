import { z } from 'zod';
import { qdsObjectChangeSchema } from '@/features/object/entity';
import { qdsAssociationChangeSchema } from '@/features/associacion/entity';

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

  threadId: z.number(),
  branchingId: z.number(),

  title: z.string(),
  description: z.string(),

  objectChanges: z.array(qdsObjectChangeSchema),
  associationChanges: z.array(qdsAssociationChangeSchema),
});
export type QdsEvent = z.infer<typeof qdsEventSchema>;
