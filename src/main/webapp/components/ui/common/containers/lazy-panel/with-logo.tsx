import { ComponentType, Suspense } from 'react';
import LoadingLogo from '@/components/ui/common/data-load-states/loadings/loading-logo';

const LazyPanelWithLogo = ({
  component: Component,
}: {
  component: ComponentType;
}) => (
  <Suspense fallback={<LoadingLogo />}>
    <Component />
  </Suspense>
);

export default LazyPanelWithLogo;
