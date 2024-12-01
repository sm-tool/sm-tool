import { ComponentType, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';

const LazyPanelWithSpinner = ({
  component: Component,
}: {
  component: ComponentType;
}) => (
  <Suspense
    fallback={
      <div className='h-full w-full flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    }
  >
    <Component />
  </Suspense>
);

export default LazyPanelWithSpinner;
