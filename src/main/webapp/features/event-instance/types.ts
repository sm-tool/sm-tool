import { z } from '@/lib/zod-types/hiden-field.types.ts';
import {
  associationChangeDTO,
  associationChangeFormDTO,
} from '@/features/association-change/types.ts';
import {
  attributeChangeDTO,
  attributeChangeFormDTO,
} from '@/features/attribute-changes/types.ts';
import { textAreaString } from '@/lib/zod-types/test-area-string.types.ts';

export const eventTypeDTO = z.enum([
  'GLOBAL',
  'NORMAL',
  'START',
  'END',
  'IDLE',
  'JOIN_OUT',
  'JOIN_IN',
  'FORK_OUT',
  'FORK_IN',
]);
export type EventType = z.infer<typeof eventTypeDTO>;

export const eventInstanceDTO = z.object({
  id: z.coerce.number().hiddenField(),
  threadId: z.coerce.number().hiddenField(),
  time: z.coerce.number().hiddenField(),
  eventType: eventTypeDTO.hiddenField(),
  title: z.coerce
    .string({
      description: 'Event title#Short name describing the event',
    })
    .nullable(),
  description: textAreaString({
    description:
      'Event description#Detailed explanation of what happens during this event',
  }).nullable(),
  associationChanges: z.array(associationChangeDTO).hiddenField(),
  attributeChanges: z.array(attributeChangeDTO).hiddenField(),
});

export const eventInstanceFormDTO = z.object({
  id: z.coerce.number().hiddenField(),
  title: z.coerce
    .string({
      description: 'Event title#Short name describing the event',
    })
    .nullable(),
  description: textAreaString({
    description:
      'Event description#Detailed explanation of what happens during this event',
  }).nullable(),

  associationChanges: z.array(associationChangeFormDTO).hiddenField(),
  attributeChanges: z.array(attributeChangeFormDTO).hiddenField(),
});

export type EventInstance = z.infer<typeof eventInstanceDTO>;
export type EventInstanceForm = z.infer<typeof eventInstanceFormDTO>;
