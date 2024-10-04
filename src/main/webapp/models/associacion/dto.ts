import { z } from 'zod';
import { useI18nContext } from '@/i18n/i18n-react';
import { createObject } from '@/models/object/dto';

export const createAssociationSchema = () => {
  const { LL } = useI18nContext();

  return z
    .object({
      description: z
        .string({
          required_error: LL.dtoErrors.association.description.required(),
          invalid_type_error: LL.dtoErrors.association.description.invalid(),
        })
        .max(32, LL.dtoErrors.association.description.tooLong()),
      object1: createObject(),
      object2: createObject(),
    })
    .refine(
      data => {
        return data.object1 !== data.object2;
      },
      {
        message: LL.dtoErrors.association.objects.mustDiffer(),
        path: ['object1', 'object2'],
      },
    );
};
