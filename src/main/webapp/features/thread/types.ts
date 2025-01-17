import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { textAreaString } from '@/lib/zod-types/test-area-string.types.ts';

export const threadDTO = z.object({
  id: z.coerce.number().hiddenField(),
  title: z.string({
    description: 'Thread title#Name of the event sequence thread',
  }),
  description: textAreaString({
    description:
      'Thread description#Detailed description of events sequence purpose and content',
  }),
  startTime: z.coerce.number().hiddenField(),
  endTime: z.coerce.number().readonly().hiddenField(),
  incomingBranchingId: z.coerce
    .number()
    .optional()
    .nullable()
    .readonly()
    .hiddenField(),
  outgoingBranchingId: z.coerce
    .number()
    .nullable()
    .optional()
    .readonly()
    .hiddenField(),
  objectIds: z.array(z.coerce.number()).hiddenField(),
});

export const threadFormDTO = threadDTO.omit({
  id: true,
  objectIds: true,
  endTime: true,
  incomingBranchingId: true,
  outgoingBranchingId: true,
});

export const threadOffsetFormDTO = z.object({
  threadId: z.coerce.number().hiddenField(),
  shift: z.coerce.number(),
  time: z.coerce.number(),
});
export type ThreadOffsetForm = z.infer<typeof threadOffsetFormDTO>;

export type Thread = z.infer<typeof threadDTO>;
export type ThreadForm = z.infer<typeof threadFormDTO>;
