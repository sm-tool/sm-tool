import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { fieldConfig } from '@autoform/zod';

export const joinCreateRequestDTO = z.object({
  threadIdsToJoin: z
    .array(z.coerce.number())
    .min(1)
    .superRefine(
      fieldConfig({
        fieldType: 'threadCheckout',
      }),
    ),
  joinTime: z.coerce.number().hiddenField(),
  joinTitle: z.string().min(1, 'Join title is required'),
  joinDescription: z.string().default(''),
  threadTitle: z.string().min(1, 'Thread title is required'),
  threadDescription: z.string().default(''),
});
export type JoinCreateRequest = z.infer<typeof joinCreateRequestDTO>;

export const joinUpdateRequestDTO = z.object({
  threadIdsToJoin: z.array(z.coerce.number()).superRefine(
    fieldConfig({
      fieldType: 'threadCheckout',
    }),
  ),
  joinTitle: z.string().min(1, 'Join title is required'),
  joinDescription: z.string().default(''),
});
export type JoinUpdateRequest = z.infer<typeof joinUpdateRequestDTO>;
