import React from 'react';
import { FieldWrapperProps } from '@autoform/react';
import { Label } from '@/components/ui/shadcn/label.tsx';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert.tsx';
import { AlertTriangle } from 'lucide-react';

const DISABLED_LABELS = ['boolean', 'object', 'array'];

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  children,
  id,
  field,
  error,
}) => {
  const isDisabled = DISABLED_LABELS.includes(field.type);

  return (
    <div className='space-y-2'>
      {!isDisabled && (
        <Label htmlFor={id}>
          {label}
          {field.required && <span className='text-primary'> *</span>}
        </Label>
      )}
      {children}
      {field.fieldConfig?.description && (
        <p className='text-sm text-muted-foreground'>
          {field.fieldConfig.description}
        </p>
      )}
      {error && (
        <Alert variant='danger'>
          <AlertTriangle className={'size-4 flex-shrink-0'} />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
