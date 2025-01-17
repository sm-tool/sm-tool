import { textAreaString } from '@/lib/zod-types/test-area-string.types.ts';
import { color } from '@/lib/zod-types/color.types.ts';
import { objectTypeIdReference } from '@/lib/zod-types/object-type-id-reference.ts';
import { z } from '@/lib/zod-types/hiden-field.types.ts';

export type ObjectTypeApiFilterMethods = 'findByTitle' | 'findByDescription';

export const objectTypeDTO = z.object({
  id: z.coerce.number().hiddenField(),
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
    description:
      'Type title#Name and description define basic information about this type',
  }),
  description: textAreaString(),
  color: color({
    description: 'Visual#Color used to represent this type in the interface',
  }).default('#FFFFFF'),
  isOnlyGlobal: z
    .boolean({
      description:
        'Has global scope#Determines if type is available globally or has limited scope',
    })
    .default(false),
  isBaseType: z.boolean().readonly().default(false).hiddenField(),
  canBeUser: z
    .boolean({
      description:
        'User Assignment support#Defines if this type can be assigned to user',
    })
    .default(false),
  parentId: objectTypeIdReference({
    options: {
      description: 'Type Hierarchy#Parent type that this type inherits from',
    },
  })
    .nullable()
    .optional(),
  hasChildren: z.boolean().hiddenField(),
});

export const objectTypeUpdateFormDTO = objectTypeDTO.omit({
  isBaseType: true,
  hasChildren: true,
});

export const objectTypeFormDTO = objectTypeDTO.omit({
  id: true,
  isBaseType: true,
  hasChildren: true,
});

export type ObjectType = z.infer<typeof objectTypeDTO>;
export type ObjectTypeForm = z.infer<typeof objectTypeFormDTO>;
