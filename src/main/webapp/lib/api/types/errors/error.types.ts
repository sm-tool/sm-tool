import { z } from '@/lib/zod-types/hiden-field.types.ts';
import {
  errorCodes,
  errorGroups,
} from '@/lib/api/types/errors/error.constants.ts';

const errorCode = z.enum(errorCodes);
const errorGroup = z.enum(errorGroups);

export const apiError = z.object({
  errorCode: errorCode,
  errorGroup: errorGroup,
  values: z.array(z.string()).optional(),
});

export type ApiError = z.infer<typeof apiError>;
