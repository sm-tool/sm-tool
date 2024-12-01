import { z } from 'zod';
import { useI18nContext } from '@/i18n/i18n-react';

export const createUserSchema = () => {
  const { LL } = useI18nContext();

  return z
    .object({
      email: z
        .string({
          required_error: LL.dtoErrors.user.email.required(),
          invalid_type_error: LL.dtoErrors.user.email.invalid(),
        })
        .email(LL.dtoErrors.user.email.invalid()),
      firstName: z
        .string({
          required_error: LL.dtoErrors.user.firstName.required(),
          invalid_type_error: LL.dtoErrors.user.firstName.invalid(),
        })
        .min(2, LL.dtoErrors.user.firstName.tooShort())
        .max(32, LL.dtoErrors.user.firstName.tooLong()),
      lastName: z
        .string({
          required_error: LL.dtoErrors.user.lastName.required(),
          invalid_type_error: LL.dtoErrors.user.lastName.invalid(),
        })
        .min(2, LL.dtoErrors.user.lastName.tooShort())
        .max(32, LL.dtoErrors.user.lastName.tooLong()),
      password: z
        .string({
          required_error: LL.dtoErrors.user.password.required(),
          invalid_type_error: LL.dtoErrors.user.password.invalid(),
        })
        .min(8, LL.dtoErrors.user.password.tooShort())
        .max(64, LL.dtoErrors.user.password.tooLong()),
      confirmPassword: z.string({
        required_error: LL.dtoErrors.user.confirmPassword.required(),
        invalid_type_error: LL.dtoErrors.user.confirmPassword.invalid(),
      }),
    })
    .superRefine(({ password, confirmPassword }, context) => {
      const { LL } = useI18nContext();

      if (password !== confirmPassword) {
        context.addIssue({
          code: 'custom',
          message: LL.dtoErrors.user.confirmPassword.invalid(),
          path: ['confirmPassword'],
        });
      }
    });
};
export type CreateUserDto = z.infer<ReturnType<typeof createUserSchema>>;
