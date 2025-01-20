import * as React from 'react';
import { cn } from '@nextui-org/theme';

const Skeleton = ({
  className,
  ...properties
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-default-200', className)}
      {...properties}
    />
  );
};
Skeleton.displayName = 'Skeleton';

export { Skeleton };
