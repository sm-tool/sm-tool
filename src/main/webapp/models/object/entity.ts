import { z } from 'zod';
import { qdsAttributeSchema } from '@/models/attribute/entity';

export const qdsObjectTemplateSchema = z.object({
  id: z.number(),
  title: z.string(),
  attributeNames: z.array(z.string()),
});
export type QdsObjectTemplate = z.infer<typeof qdsObjectTemplateSchema>;

export const qdsObjectTypeSchema = z.object({
  id: z.number(),
  title: z.string(),
  color: z.string().optional(),
  isGlobal: z.boolean().optional(),
});
export type QdsObjectType = z.infer<typeof qdsObjectTypeSchema>;

export const qdsObjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  template: qdsObjectTemplateSchema,
  type: qdsObjectTypeSchema,
  attributes: z.array(qdsAttributeSchema),
});
export type QdsObject = z.infer<typeof qdsObjectSchema>;

export const qdsObjectChangeSchema = z.object({
  elementId: z.number(),
  attributeId: z.number(),
  value: z.string(),
});
export type QdsObjectChange = z.infer<typeof qdsObjectChangeSchema>;
