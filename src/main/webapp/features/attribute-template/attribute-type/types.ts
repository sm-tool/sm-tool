import { z } from '@/lib/zod-types/hiden-field.types.ts';

export enum AttributeTypeDisplay {
  INT = 'INT',
  STRING = 'STRING',
  DATE = 'DATE',
  BOOL = 'BOOL',
}

export const attributeTypeDTO = z.nativeEnum(AttributeTypeDisplay);
