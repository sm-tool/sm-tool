import { z } from 'zod';

export const qdsObserverSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type QdsObserver = z.infer<typeof qdsObserverSchema>;
