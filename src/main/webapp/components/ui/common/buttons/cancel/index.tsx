'use client';

import { Button } from '@/components/ui/shadcn/button';

interface CancelButtonProperties {
  onClick?: () => void;
  disabled?: boolean;
}

export const CancelButton = ({ onClick, disabled }: CancelButtonProperties) => {
  return (
    <Button
      type='button'
      variant='outline'
      role={'alert'}
      onClick={onClick}
      disabled={disabled}
    >
      {'cancel'}
    </Button>
  );
};
