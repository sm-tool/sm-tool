import { useI18nContext } from '@/i18n/i18n-react';
import { z } from 'zod';

export const createObserver = () => {
  const { LL } = useI18nContext();

  return z.object({
    name: z
      .string({
        required_error: LL.dtoErrors.observer.name.required(),
        invalid_type_error: LL.dtoErrors.observer.name.invalid(),
      })
      .max(32, LL.dtoErrors.observer.name.tooLong()),
  });
};
