import useDarkMode from '@/hooks/use-dark-mode';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Route = createRootRoute({
  component: () => {
    useDarkMode('system');

    return (
      <main className='h-screen bg-background text-foreground'>
        <Outlet />
        <TanStackRouterDevtools position='top-right' />
        <ReactQueryDevtools initialIsOpen={false} />
      </main>
    );
  },
});
