import { z } from 'zod';

export const qdsPhaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  startTime: z.number(),
  endTime: z.number(),
});
export type QdsPhase = z.infer<typeof qdsPhaseSchema>;
