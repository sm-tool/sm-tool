import { useI18nContext } from '@/i18n/i18n-react';
import { z } from 'zod';

export const createAttribute = () => {
  const { LL } = useI18nContext();

  return z.object({
    name: z
      .string({
        required_error: LL.dtoErrors.attribute.name.required(),
        invalid_type_error: LL.dtoErrors.attribute.name.invalid(),
      })
      .max(32, LL.dtoErrors.attribute.value.tooLong()),
    value: z
      .string({
        invalid_type_error: LL.dtoErrors.attribute.value.invalid(),
      })
      .max(32, LL.dtoErrors.attribute.value.tooLong()),
  });
};
