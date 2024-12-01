import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/lib/routing/routeTree.gen.ts';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import R404 from '@/app/404.tsx';
import R500 from '@/app/500.tsx';
import { MockAuthService } from '@/lib/auth/vendor/mock-auth-service.ts';

export const createAppCore = () => {
  const queryClient = new QueryClient();
  // const authClient = new KeycloakService();
  const authClient = new MockAuthService();
  const router = createRouter({
    routeTree,
    context: {
      authClient,
      queryClient,
    },
    defaultPendingComponent: () => (
      <div className='h-screen'>
        <LoadingSpinner />
      </div>
    ),
    defaultPreload: 'intent',
    defaultNotFoundComponent: R404,
    defaultErrorComponent: R500,
  });

  return {
    queryClient,
    authClient,
    router,
  } as const;
};

export const core = createAppCore();
export const { router, queryClient, authClient } = core;

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
