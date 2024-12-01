import React from 'react';
import { AutoFormFieldProps } from '@autoform/react';
import { Input } from '@/components/ui/shadcn/input.tsx';

export const StringField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
}) => (
  <Input
    id={id}
    className={error ? 'border-destructive' : ''}
    {...inputProps}
  />
);
