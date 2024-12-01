import { useI18nContext } from '@/i18n/i18n-react';
import { z } from 'zod';

export const createEntity = () => {
  const { LL } = useI18nContext();

  return z
    .object({
      title: z
        .string({
          required_error: LL.dtoErrors.entity.title.required(),
          invalid_type_error: LL.dtoErrors.entity.title.invalid(),
        })
        .max(32, LL.dtoErrors.entity.title.tooLong()),
      description: z
        .string({
          invalid_type_error: LL.dtoErrors.entity.description.invalid(),
        })
        .max(256, LL.dtoErrors.entity.description.tooLong()),
      startTime: z.number({
        required_error: LL.dtoErrors.entity.startTime.required(),
        invalid_type_error: LL.dtoErrors.entity.startTime.invalid(),
      }),
      endTime: z.number({
        required_error: LL.dtoErrors.entity.endTime.required(),
        invalid_type_error: LL.dtoErrors.entity.endTime.invalid(),
      }),
    })
    .superRefine(({ startTime, endTime }, context) => {
      if (startTime >= endTime) {
        context.addIssue({
          code: 'custom',
          message: LL.dtoErrors.entity.startGraterThanEnd(),
          path: ['startTime', 'endTime'],
        });
      }
    });
};
