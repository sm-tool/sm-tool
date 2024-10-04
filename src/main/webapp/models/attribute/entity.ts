import { z } from 'zod';

export const qdsAttributeSchema = z.object({
  id: z.number(),
  name: z.string(),
  value: z.string().optional(),
});
export type QdsAttribute = z.infer<typeof qdsAttributeSchema>;
