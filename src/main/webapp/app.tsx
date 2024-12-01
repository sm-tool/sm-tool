import { NotificationProvider } from '@/providers/notification-provider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import '@/styles/global.css';
import { RouterProvider } from '@tanstack/react-router';
import AuthProvider from '@/lib/auth/providers/auth-provider.tsx';
import { core } from '@/lib/core';
import { ErrorBoundary } from '@/utils/errors/boundary.tsx';
import { StrictMode } from 'react';

const Layout = () => {
  return (
    <StrictMode>
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
              <RouterProvider router={core.router} />
            </QueryClientProvider>
          </AuthProvider>
        </ErrorBoundary>
      </NotificationProvider>
    </StrictMode>
  );
};

const app = createRoot(document.querySelector('#root')!);

app.render(<Layout />);
