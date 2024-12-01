import { buildZodFieldConfig } from '@autoform/react';
import { FieldTypes } from './auto-form';

export const fieldConfig = buildZodFieldConfig<FieldTypes, {}>();
