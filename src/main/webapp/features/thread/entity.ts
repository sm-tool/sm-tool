import { z } from 'zod';
import { qdsObjectSchema } from '@/features/object/entity';
import { qdsObserverSchema } from '@/features/observer/entity';
import { qdsEventSchema } from '@/features/event/entity';

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
