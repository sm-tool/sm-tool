import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { objectTypeIdReference } from '@/lib/zod-types/object-type-id-reference.ts';

export type AssociationTypeApiFilterMethods = 'findByDescription';

export const associationTypeDTO = z.object({
  id: z.coerce.number().hiddenField(),
  description: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
    description:
      'Association description#Description of relationship between source and target objects',
  }),
  firstObjectTypeId: objectTypeIdReference({
    options: {
      description:
        'Source object#Origin object type ID that initiates the relationship',
    },
    modifier: schema => schema.positive(),
  }),
  secondObjectTypeId: objectTypeIdReference({
    options: {
      description:
        'Target object#Destination object type ID that receives the relationship',
    },
    modifier: schema => schema.positive(),
  }),
});

export const associationTypeCreateFormDTO = associationTypeDTO.omit({
  id: true,
});

export const associationTypeUpdateFormDTO = associationTypeDTO.omit({
  id: true,
  firstObjectTypeId: true,
  secondObjectTypeId: true,
});

export type AssociationType = z.infer<typeof associationTypeDTO>;
export type AssociationTypeCreateForm = z.infer<
  typeof associationTypeCreateFormDTO
>;
export type AssociationTypeUpdateForm = z.infer<
  typeof associationTypeUpdateFormDTO
>;
