import { AutoFormFieldProps } from '@autoform/react';
import { Input } from '@/components/ui/shadcn/input.tsx';

export const StringField = ({ inputProps, error, id }: AutoFormFieldProps) => {
  const { key, ...restInputProps } = inputProps;

  return (
    <Input
      id={id}
      className={error ? 'border-destructive' : ''}
      {...restInputProps}
    />
  );
};
