import { z } from 'zod';
import { qdsUserEntitySchema } from '@/features/user/entity';

export const qdsHistoryRecordSchema = z.object({
  id: z.number(),
  title: z.string(), //todo zamienić na change: i ma być automatic na backu
  author: qdsUserEntitySchema,
  date: z.date(),
});
export type QdsHistoryRecord = z.infer<typeof qdsHistoryRecordSchema>;
