import { z } from '@/lib/zod-types/hiden-field.types.ts';

export const getEntityType = <T extends { id: number }>(schema: z.ZodType<T>) =>
  schema._def.description;
