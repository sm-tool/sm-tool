import { z } from 'zod';
import { qdsUserEntitySchema } from '@/features/user/entity';

const qdsPermissionTypeSchema = z.enum(['AUTHOR', 'EDIT', 'VIEW']);
export type QdsPermissionType = z.infer<typeof qdsPermissionTypeSchema>;

export const qdsPermissionSchema = z.object({
  type: qdsPermissionTypeSchema,
  user: qdsUserEntitySchema,
});
export type QdsPermission = z.infer<typeof qdsPermissionSchema>;
