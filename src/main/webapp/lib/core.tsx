import { QueryCache, QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/lib/routing/routeTree.gen.ts';
import R404 from '@/app/errors/404';
import R500 from '@/app/errors/500';
import { STALE_TIME } from '@/lib/api/constats.ts';
import {
  handleErrorToast,
  successToast,
} from '@/components/ui/shadcn/toaster.tsx';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import { createAuthClient } from '@/lib/auth';
import { AxiosError } from 'axios';
/**
 * Tworzy i konfiguruje główne zależności aplikacji: QueryClient, AuthClient oraz Router.
 *
 * QueryClient jest skonfigurowany z następującymi ustawieniami:
 * - Automatyczne ponowne próby zapytań (z wyłączeniem 404)
 * - Wyłączone odświeżanie przy fokusie okna
 * - Zdefiniowane czasy ważności cache
 * - Obsługa błędów z powiadomieniami toast
 *
 * Router jest skonfigurowany z:
 * - Drzewem routingu
 * - Komponentami dla stanów ładowania, 404 i błędów
 * - Preloadingiem na podstawie intencji
 *
 * @example
 * ```tsx
 * const core = createAppCore();
 * const { router, queryClient, authClient } = core;
 *
 * // W komponencie głównym
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <RouterProvider router={router} />
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 *
 * @returns Obiekt zawierający skonfigurowane instancje QueryClient, AuthClient i Router
 */
export const createAppCore = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof AxiosError && error.response?.status === 404) {
            return false;
          }
          return (
            failureCount <
            (Number(globalThis.process.env.requestRetryCount) || 3)
          );
        },
        refetchOnWindowFocus: false,
        staleTime: STALE_TIME.Short,
        gcTime: STALE_TIME.XLONG,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000),
        // TODO: dodać suspense: true -- i zamienić cały kod na suspense
      },
      mutations: {
        retry: globalThis.process.env.requestRetryCount as undefined,
        onSuccess: () => {
          successToast('Element created');
        },
        onError: error => {
          handleErrorToast(error, 'Failed to create element');
        },
      },
    },
    queryCache: new QueryCache({
      onError: error => {
        handleErrorToast(error, `Cache error`);
      },
    }),
  });
  const authClient = createAuthClient();
  const router = createRouter({
    routeTree,
    context: {
      authClient,
      queryClient,
    },
    defaultPendingComponent: () => (
      <div className='h-screen'>
        <Skeleton />
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

export type Context = {
  rotuter: typeof router;
  queryClient: typeof queryClient;
  authClient: typeof authClient;
};

export const core = createAppCore();
export const { router, queryClient, authClient } = core;

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
