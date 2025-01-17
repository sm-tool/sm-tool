import { z } from '@/lib/zod-types/hiden-field.types.ts';

export const attributeInstanceDTO = z.object({
  id: z.coerce.number().hiddenField(),
  attributeTemplateId: z.coerce.number().hiddenField(),
  type: z.string().readonly().hiddenField(),
});

export const attributeInstanceFormDTO = z.object({
  attributeTemplateId: z.coerce.number().hiddenField(),
  type: z.string().readonly().hiddenField(),
});

export type AttributeInstance = z.infer<typeof attributeInstanceDTO>;
export type AttributeInstanceForm = z.infer<typeof attributeInstanceFormDTO>;

export const attributeInstanceObjectMappingDTO = z.object({
  id: z.coerce.number(),
  objectId: z.coerce.number(),
  attributeTemplateId: z.coerce.number(),
});

export type AttributeInstanceMapping = z.infer<
  typeof attributeInstanceObjectMappingDTO
>;
