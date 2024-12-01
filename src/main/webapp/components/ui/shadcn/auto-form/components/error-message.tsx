import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/shadcn/alert.tsx';

export const ErrorMessage: React.FC<{ error: string }> = ({ error }) => (
  <Alert variant='danger'>
    <AlertCircle className='h-4 w-4' />
    <AlertTitle>{error}</AlertTitle>
  </Alert>
);
