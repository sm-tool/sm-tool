import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { objectTypeIdReference } from '@/lib/zod-types/object-type-id-reference.ts';
import { textAreaString } from '@/lib/zod-types/test-area-string.types.ts';
import { color } from '@/lib/zod-types/color.types.ts';

export const objectTemplateDTO = z.object({
  id: z.coerce.number().hiddenField(),
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
    description:
      'Template title#Name and description define basic information about this template',
  }),
  description: textAreaString(),
  color: color({
    description:
      'Visual#Color used to represent this template in the interface',
  }).default('#FFFFFF'),
  objectTypeId: objectTypeIdReference({
    options: {
      description: 'Object type#Parent object type that template inherits from',
    },
    modifier: schema => schema.positive(),
  }).hiddenField(),
});

export const objectTemplateFormDTO = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
    description:
      'Template title#Name and description define basic information about this template',
  }),
  description: textAreaString(),
  color: color({
    description:
      'Visual#Color used to represent this template in the interface',
  }).default('#FFFFFF'),
  objectTypeId: objectTypeIdReference({
    options: {
      description: 'Object type#Parent object type that template inherits from',
    },
    modifier: schema => schema.positive(),
  }),
});

export type ObjectTemplate = z.infer<typeof objectTemplateDTO>;
export type ObjectTemplateForm = z.infer<typeof objectTemplateFormDTO>;

export const objectTemplateAssigmentDTO = z.object({
  assign: z
    .array(z.coerce.number())
    .min(1, 'At least one type has to be assigned'),
});
export type ObjectTemplateAssigment = z.infer<typeof objectTemplateFormDTO>;
