import { qdsAttributeSchema } from '@/features/attribute/entity';
import { z } from 'zod';

export const qdsObjectTemplateSchema = z.object({
  id: z.number(),
  title: z.string(),
  color: z.string().default('#FFFFFF').optional(),
  attributeNames: z.array(z.string()),
});
export type QdsObjectTemplate = z.input<typeof qdsObjectTemplateSchema>;

export const qdsObjectTypeSchema = z.object({
  id: z.number(),
  title: z.string(),
  color: z.string().default('#FFFFFF').optional(),
  isGlobal: z.boolean().optional(),
});
export type QdsObjectType = z.input<typeof qdsObjectTypeSchema>;

export const qdsObjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  templates: z.array(qdsObjectTemplateSchema),
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
