import { z } from 'zod';
import { qdsObjectTypeSchema } from '@/models/object/entity';
import { qdsAttributeSchema } from '@/models/attribute/entity';

const qdsAssociationActionSchema = z.enum(['INSERT', 'DELETE']);
export type QdsAssociationAction = z.infer<typeof qdsAssociationActionSchema>;

export const qdsAssociationTypeSchema = z.object({
  id: z.number(),
  description: z.string(),
  object1: qdsObjectTypeSchema,
  object2: qdsObjectTypeSchema,
});
export type QdsAssociationType = z.infer<typeof qdsAssociationSchema>;

const qdsAssociationSchema = z.object({
  id: z.number(),
  type: qdsAssociationTypeSchema,
});
export type QdsAssociation = z.infer<typeof qdsAssociationSchema>;

export const qdsAssociationChangeSchema = z.object({
  association: qdsAttributeSchema,
  action: qdsAssociationSchema,
});
export type QdsAssociationChange = z.infer<typeof qdsAssociationChangeSchema>;
