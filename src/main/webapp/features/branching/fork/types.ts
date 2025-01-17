import { z } from '@/lib/zod-types/hiden-field.types.ts';

export const offspringObjectTransferDataDTO = z.object({
  /// id wątku docelowego .... czmeu tak to nazwaliście. CZEMU ID
  id: z.coerce.number().nullable().hiddenField(),
  objectIds: z.array(z.coerce.number()),
});
export type OffspringObjectTransferData = z.infer<
  typeof offspringObjectTransferDataDTO
>;

export const offspringDataDTO = z.object({
  title: z.string().min(1, 'title is required'),
  description: z.string().default(''),
  transfer: offspringObjectTransferDataDTO.nullable(),
});
export type OffspringData = z.infer<typeof offspringDataDTO>;

export const forkCreateRequestDTO = z.object({
  forkedThreadId: z.coerce.number().hiddenField(),
  forkTime: z.coerce.number().min(1).hiddenField(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().default(''),
  offsprings: z.array(offspringDataDTO, {
    required_error: 'At least one thread must be created',
  }),
});
export type ForkCreateRequest = z.infer<typeof forkCreateRequestDTO>;

export const forkUpdateRequestDTO = forkCreateRequestDTO.omit({
  forkedThreadId: true,
  forkTime: true,
});
export type ForkUpdateRequest = z.infer<typeof forkUpdateRequestDTO>;
