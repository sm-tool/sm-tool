import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { objectTypeIdReference } from '@/lib/zod-types/object-type-id-reference.ts';
import { objectTemplateIdReference } from '@/lib/zod-types/template-type-id-reference.ts';
import { attributeInstanceDTO } from '@/features/attribute/types.ts';

export const objectInstanceDTO = z.object({
  id: z.coerce.number().hiddenField(),
  originThreadId: z.coerce.number().hiddenField(),
  templateId: objectTemplateIdReference({}).hiddenField(),
  objectTypeId: objectTypeIdReference({
    modifier: schema => schema.positive(),
  }).hiddenField(),
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
      description:
        'Object name#Edit name of this object instance. To change attributes open this objects from objects tab',
    })
    .min(1, 'Name is required'),
  attributes: z.array(attributeInstanceDTO).hiddenField(),
});

export const objectInstanceFormDTO = z.object({
  originThreadId: z.coerce.number().hiddenField(),
  templateId: objectTemplateIdReference({}),
  objectTypeId: objectTypeIdReference({
    modifier: schema => schema.positive(),
  }),
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name is required'),
});

export type ObjectInstance = z.infer<typeof objectInstanceDTO>;
export type ObjectInstanceForm = z.infer<typeof objectInstanceFormDTO>;

export const objectInstancePossibleAssociationQueryOnThreadFormDTO = z.object({
  threadId: z.coerce.number(),
  objectId: z.coerce.number(),
});

export type ObjectIntancePossibleAssociationOnThreadForm = z.infer<
  typeof objectInstancePossibleAssociationQueryOnThreadFormDTO
>;

export const objectInstancePossibleAssociationQueryOnThreadDTO = z.object({
  objectId: z.coerce.number(),
  associationTypeId: z.coerce.number(),
});

export type ObjectIntancePossibleAssociationOnThread = z.infer<
  typeof objectInstancePossibleAssociationQueryOnThreadDTO
>;

export const objectInstanceOfThreadDTO = z.object({
  global: z.array(objectInstanceDTO),
  local: z.array(objectInstanceDTO),
});

export type ObjectInstanceOfThread = z.infer<typeof objectInstanceOfThreadDTO>;
