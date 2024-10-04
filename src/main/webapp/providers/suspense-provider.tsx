'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/shadcn/skeleton';

interface SuspenseProviderProperties {
  children: React.ReactNode;
}

export const SuspenseProvider = ({ children }: SuspenseProviderProperties) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <div className='rotate-0 scale-100 transition-all duration-300 ease-in-out'>
        {children}
      </div>
    </Suspense>
  );
};
