import { AutoFormFieldProps } from '@autoform/react';
import { Input } from '@/components/ui/shadcn/input.tsx';

export const NumberField = ({ inputProps, error, id }: AutoFormFieldProps) => {
  const { key, ...restInputProps } = inputProps;

  return (
    <Input
      id={id}
      type='number'
      className={error ? 'border-destructive' : ''}
      {...restInputProps}
    />
  );
};
