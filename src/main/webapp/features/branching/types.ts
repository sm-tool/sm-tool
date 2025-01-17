import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { textAreaString } from '@/lib/zod-types/test-area-string.types.ts';

export const branchingType = z.enum(['FORK', 'JOIN']);

const objectTransferDTO = z.object({
  id: z.coerce.number().hiddenField(),
  objectIds: z.array(z.coerce.number()),
});

export const branchingDTO = z.object({
  id: z.coerce.number().hiddenField(),
  type: branchingType.hiddenField(),
  isCorrect: z.boolean().nullable().readonly().hiddenField(),
  title: z.string({
    description: 'Branching title#Short name describing the branching event',
  }),
  description: textAreaString({
    description:
      'Branching description#Detailed explanation of what happends during this branching event',
  }),
  time: z.coerce.number().hiddenField(),
  comingIn: z.array(z.coerce.number()).hiddenField(),
  comingOut: z.array(z.coerce.number()).hiddenField(),
  objectTransfer: z.array(objectTransferDTO).nullable().hiddenField(),
});

export const branchingFormDTO = branchingDTO.omit({
  id: true,
  isCorrect: true,
});

export type Branching = z.infer<typeof branchingDTO>;
export type BranchingForm = z.infer<typeof branchingFormDTO>;
