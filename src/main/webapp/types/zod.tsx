import { z, ZodString } from 'zod';
import { fieldConfig } from '@autoform/zod';

export const createDateTime = () =>
  z.coerce
    .string({
      description: 'dateTime component is disabled to futher notice',
    })
    .datetime()
    .superRefine(
      fieldConfig({
        fieldType: 'dateTime',
      }),
    );

export const createTextAreaString = (parameters?: ZodString) =>
  z.coerce
    .string(parameters)
    .superRefine(fieldConfig({ fieldType: 'textAreaString' }));
