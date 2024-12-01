import { z } from 'zod';

export const qdsPurposeSchema = z.object({
  purpose: z.string(),
});
export type QdsObserver = z.infer<typeof qdsPurposeSchema>;
