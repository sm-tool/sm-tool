import { z } from '@/lib/zod-types/hiden-field.types.ts';
import {
  AttributeTypeDisplay,
  attributeTypeDTO,
} from '@/features/attribute-template/attribute-type/types.ts';

type AttributeData = {
  type: AttributeTypeDisplay;
  defaultValue?: string | null;
};

const validateAttribute = (data: AttributeData, context: z.RefinementCtx) => {
  if (!data.defaultValue) return;

  switch (data.type) {
    case AttributeTypeDisplay.INT: {
      const parsed = Number.parseInt(data.defaultValue);
      if (Number.isNaN(parsed) || parsed.toString() !== data.defaultValue) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Value must be a number',
          path: ['defaultValue'],
        });
      }
      break;
    }
    case AttributeTypeDisplay.DATE: {
      if (!z.string().datetime().safeParse(data.defaultValue).success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Value must be a valid ISO date',
          path: ['defaultValue'],
        });
      }
      break;
    }
    case AttributeTypeDisplay.BOOL: {
      if (data.defaultValue !== 'true' && data.defaultValue !== 'false') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Value must be 'true' or 'false'",
          path: ['defaultValue'],
        });
      }
      break;
    }
  }
};

export const baseAttributeTemplateDTO = z.object({
  objectTemplateId: z.coerce.number().hiddenField(),
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name is required'),
  type: attributeTypeDTO,
  defaultValue: z.string().default(''),
  unit: z.string().nullable().optional(),
});

export const attributeTemplateDTO = baseAttributeTemplateDTO
  .extend({
    id: z.coerce.number().hiddenField(),
  })
  .superRefine(validateAttribute);

export const attributeTemplateFormDTO =
  baseAttributeTemplateDTO.superRefine(validateAttribute);

export type AttributeTemplate = z.infer<typeof attributeTemplateDTO>;
export type AttributeTemplateFormType = z.infer<
  typeof attributeTemplateFormDTO
>;
