import { useI18nContext } from '@/i18n/i18n-react';
import { z } from 'zod';
import { qdsEventSchema } from './entity';
import { qdsObjectChangeSchema } from '../object/entity';
import { qdsAssociationChangeSchema } from '../associacion/entity';

export const createEvent = () => {
  const { LL } = useI18nContext();

  return z
    .object({
      type: qdsEventSchema,
      deltaTime: z.number({
        required_error: LL.dtoErrors.event.deltaTime.required(),
        invalid_type_error: LL.dtoErrors.event.deltaTime.invalid(),
      }),
      title: z.string({
        required_error: LL.dtoErrors.event.title.required(),
        invalid_type_error: LL.dtoErrors.event.title.invalid(),
      }),
      description: z
        .string({
          invalid_type_error: LL.dtoErrors.event.description.invalid(),
        })
        .max(256, LL.dtoErrors.event.description.tooLong())
        .optional(),
      objectChanges: z.array(qdsObjectChangeSchema),
      associactionChanges: z.array(qdsAssociationChangeSchema),
    })
    .superRefine(({ deltaTime }, context) => {
      const { LL } = useI18nContext();

      if (deltaTime < 1) {
        context.addIssue({
          code: 'custom',
          message: LL.dtoErrors.event.deltaTime.positive(),
          path: ['deltaTIme'],
        });
      }
    });
};
