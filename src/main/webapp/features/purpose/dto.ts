import { useI18nContext } from '@/i18n/i18n-react';
import { z } from 'zod';

export const createEntity = () => {
  const { LL } = useI18nContext();
  return z.object({
    name: z
      .string({
        required_error: LL.dtoErrors.entity.title.required(),
        invalid_type_error: LL.dtoErrors.entity.title.invalid(),
      })
      .max(64, LL.dtoErrors.entity.title.tooLong()),
  });
};
