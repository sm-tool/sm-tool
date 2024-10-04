import { z } from 'zod';

export const getEntityType = <T extends { id: number }>(schema: z.ZodType<T>) =>
  schema._def.description;
