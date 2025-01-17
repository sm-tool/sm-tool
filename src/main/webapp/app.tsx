import { NotificationProvider } from '@/providers/notification-provider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import '@/global.css';
import AuthProvider from '@/lib/auth/providers/auth-provider.tsx';
import { core } from '@/lib/core';
import { ErrorBoundary } from '@/utils/errors/boundary.tsx';
import React, { StrictMode } from 'react';
import { DarkModeProvider } from '@/hooks/use-dark-mode.tsx';
import RouterProvider from '@/providers/routing-provider';

const Layout = () => {
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if ((event.state as { skip?: boolean })?.skip) {
        globalThis.history.back();
      }
    };

    globalThis.addEventListener('popstate', handlePopState);
    return () => globalThis.removeEventListener('popstate', handlePopState);
  });

  return (
    <StrictMode>
      <DarkModeProvider>
        <NotificationProvider
          toasterProps={{
            className: 'top-16',
            position: 'top-center',
            richColors: true,
          }}
        >
          <ErrorBoundary>
            <AuthProvider authService={core.authClient}>
              <QueryClientProvider client={core.queryClient}>
                <RouterProvider />
              </QueryClientProvider>
            </AuthProvider>
          </ErrorBoundary>
        </NotificationProvider>
      </DarkModeProvider>
    </StrictMode>
  );
};

const app = createRoot(document.querySelector('#root')!);

app.render(<Layout />);
