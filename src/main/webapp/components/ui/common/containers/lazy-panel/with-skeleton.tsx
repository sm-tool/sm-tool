import { ComponentType, Suspense } from 'react';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';

const LazyPaneWithSkeleton = ({
  component: Component,
}: {
  component: ComponentType;
}) => (
  <Suspense fallback={<Skeleton className='w-full h-full' />}>
    <Component />
  </Suspense>
);

export default LazyPaneWithSkeleton;
