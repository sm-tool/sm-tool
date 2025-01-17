import { RouterProvider } from '@tanstack/react-router';
import { core } from '@/lib/core.tsx';

const RoutingProvider = () => {
  return <RouterProvider router={core.router} />;
};

export default RoutingProvider;
