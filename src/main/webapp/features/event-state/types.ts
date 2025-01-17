import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { associationOperationDTO } from '@/features/association-change/types.ts';

export const attributeStateDTO = z.object({
  attributeId: z.coerce.number(),
  value: z.string().optional(),
});

export type AttributeState = z.infer<typeof attributeStateDTO>;

export const associationStateDTO = z.object({
  associationOperation: associationOperationDTO,
  associationTypeId: z.coerce.number().hiddenField(),
  object1Id: z.coerce.number().hiddenField(),
  object2Id: z.coerce.number().hiddenField(),
});

export type AssociationState = z.infer<typeof associationStateDTO>;

export const eventStateDTO = z.object({
  attributesState: z.array(attributeStateDTO),
  associationsState: z.array(associationStateDTO),
});

export type EventState = z.infer<typeof eventStateDTO>;
