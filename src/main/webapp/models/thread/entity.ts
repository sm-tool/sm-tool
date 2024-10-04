import { z } from 'zod';
import { qdsObjectSchema } from '@/models/object/entity';
import { qdsObserverSchema } from '@/models/observer/entity';
import { qdsEventSchema } from '@/models/event/entity';

export const qdsThreadSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),

  startTime: z.number(),
  endTime: z.number(),

  isGlobal: z.boolean(),

  objects: z.array(qdsObjectSchema),

  observers: z.array(qdsObserverSchema),

  events: z.array(qdsEventSchema),
});
export type QdsThread = z.infer<typeof qdsThreadSchema>;
