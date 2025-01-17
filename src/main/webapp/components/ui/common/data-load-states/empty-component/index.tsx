import { Card } from '@/components/ui/shadcn/card.tsx';
import { TextSelect } from 'lucide-react';
import React from 'react';
import { cn } from '@nextui-org/theme';

const EmptyComponent = ({
  text,
  className,
}: {
  text?: React.ReactNode;
  className?: string;
}) => (
  <Card
    className={cn(
      'flex flex-col items-center justify-between size-fit p-16 border-none',
      className,
    )}
  >
    <div className='flex flex-col items-center gap-6 text-center'>
      <TextSelect className='size-32 text-default-200' />
      <h1 className='text-2xl font-bold truncate'>{text}</h1>
    </div>
  </Card>
);

export default EmptyComponent;
