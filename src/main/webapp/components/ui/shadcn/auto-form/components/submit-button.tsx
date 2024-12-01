import React from 'react';
import { Button } from '@/components/ui/shadcn/button.tsx';

export const SubmitButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Button type='submit' variant='primary'>
    {children}
  </Button>
);
