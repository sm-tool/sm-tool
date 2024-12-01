import { useI18nContext } from '@/i18n/i18n-react';
import { z } from 'zod';
import { createAttribute } from '@/features/attribute/dto';

export const createObjectTemplate = () => {
  const { LL } = useI18nContext();

  return z.object({
    title: z
      .string({
        required_error: LL.dtoErrors.objectVariants.template.title.required(),
        invalid_type_error:
          LL.dtoErrors.objectVariants.template.title.invalid(),
      })
      .max(32, LL.dtoErrors.objectVariants.template.title.tooLong()),
    // todo ogarnij jak dodać z poziomu zoda informacje że element już
    //  isteniej bez zamiany na arrejke
    attributeNames: z.set(
      z
        .string({
          required_error:
            LL.dtoErrors.objectVariants.template.attributeName.invalid(),
        })
        .max(32, LL.dtoErrors.objectVariants.template.attributeName.tooLong()),
    ),
  });
};

export const createObjectType = () => {
  const { LL } = useI18nContext();

  return z.object({
    title: z
      .string({
        required_error: LL.dtoErrors.objectVariants.type.title.required(),
        invalid_type_error: LL.dtoErrors.objectVariants.type.title.invalid(),
      })
      .max(32, LL.dtoErrors.objectVariants.type.title.tooLong()),
    color: z
      .string({
        required_error: LL.dtoErrors.objectVariants.type.color.required(),
        invalid_type_error: LL.dtoErrors.objectVariants.type.color.invalid(),
      })
      .regex(
        /^#([\dA-Fa-f]{6})$/,
        LL.dtoErrors.objectVariants.type.color.invalid(),
      ),
  });
};

export const createObject = () => {
  const { LL } = useI18nContext();

  return z.object({
    name: z
      .string({
        required_error: LL.dtoErrors.objectVariants.object.name.required(),
        invalid_type_error: LL.dtoErrors.objectVariants.object.name.invalid(),
      })
      .max(32, LL.dtoErrors.objectVariants.object.name.tooLong()),
    template: createObjectTemplate(),
    type: createObjectType(),
    attributes: z.array(createAttribute()),
  });
};
