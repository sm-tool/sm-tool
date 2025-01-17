import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => {
    return (
      <main className='h-screen bg-background text-foreground'>
        <Outlet />
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        {/*<FpsCounter />*/}
        {/*<DebugTextTool />*/}
        {/*  </>*/}
        {/*)}*/}
      </main>
    );
  },
});
