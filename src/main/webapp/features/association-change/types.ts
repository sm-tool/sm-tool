import { z } from '@/lib/zod-types/hiden-field.types.ts';

export const associationOperationDTO = z.enum(['INSERT', 'DELETE']);
export type AssociationOperation = z.infer<typeof associationOperationDTO>;

export const associationChangeDTO = z.object({
  associationTypeId: z.coerce.number().hiddenField(),
  object1Id: z.coerce.number().hiddenField(),
  object2Id: z.coerce.number().hiddenField(),
  changeType: z
    .object({
      from: associationOperationDTO.nullable().default(null),
      to: associationOperationDTO.nullable().default(null),
    })
    .hiddenField(),
});

export const associationChangeFormDTO = z.object({
  associationTypeId: z.coerce.number().hiddenField(),
  object1Id: z.coerce.number().hiddenField(),
  object2Id: z.coerce.number().hiddenField(),
  associationOperation: associationOperationDTO.hiddenField(),
});

export type AssociationChange = z.infer<typeof associationChangeDTO>;
export type AssociationChangeForm = z.infer<typeof associationOperationDTO>;
