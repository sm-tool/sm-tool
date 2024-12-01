import React from 'react';
import { AutoFormFieldProps } from '@autoform/react';
import { Input } from '@/components/ui/shadcn/input.tsx';

export const NumberField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
}) => (
  <Input
    id={id}
    type='number'
    className={error ? 'border-destructive' : ''}
    {...inputProps}
  />
);
