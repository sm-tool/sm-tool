import React from 'react';
import { AutoFormFieldProps } from '@autoform/react';
import { Input } from '@/components/ui/shadcn/input.tsx';

export const DateField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
}) => (
  <Input
    id={id}
    type='date'
    className={error ? 'border-destructive' : ''}
    {...inputProps}
  />
);
