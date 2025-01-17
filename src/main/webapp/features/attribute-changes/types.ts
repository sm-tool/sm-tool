import { z } from '@/lib/zod-types/hiden-field.types.ts';

export const attributeChangeDTO = z.object({
  attributeId: z.coerce.number().hiddenField(),
  changeType: z.object({
    from: z.string().nullable().hiddenField(),
    to: z.string().nullable(),
  }),
});

export const attributeChangeFormDTO = z.object({
  attributeId: z.coerce.number().hiddenField(),
  value: z.string().nullable(),
});

export type AttributeChange = z.infer<typeof attributeChangeDTO>;
export type AttributeChangeForm = z.infer<typeof attributeChangeFormDTO>;
