import React from 'react';
import { PlusIcon } from 'lucide-react';
import { ArrayWrapperProps } from '@autoform/react';
import { Button } from '@/components/ui/shadcn/button.tsx';

export const ArrayWrapper: React.FC<ArrayWrapperProps> = ({
  label,
  children,
  onAddItem,
}) => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>{label}</h3>
      {children}
      <Button onClick={onAddItem} variant='outline' size='sm' type='button'>
        <PlusIcon className='h-4 w-4' />
      </Button>
    </div>
  );
};