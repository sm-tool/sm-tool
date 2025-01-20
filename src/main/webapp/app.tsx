import { NotificationProvider } from '@/providers/notification-provider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import '@/global.css';
import AuthProvider from '@/lib/auth/providers/auth-provider.tsx';
import { core } from '@/lib/core';
import { ErrorBoundary } from '@/utils/errors/boundary.tsx';
import { StrictMode } from 'react';
import { DarkModeProvider } from '@/hooks/use-dark-mode.tsx';
import RouterProvider from '@/providers/routing-provider';
import ResolutionWrapper from '@/components/ui/common/display/resolution-wrapper';

const Layout = () => {
  const appContent = (
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
              <ResolutionWrapper>
                <RouterProvider />
              </ResolutionWrapper>
            </QueryClientProvider>
          </AuthProvider>
        </ErrorBoundary>
      </NotificationProvider>
    </DarkModeProvider>
  );

  // FIXME: Prevent keycloak from repetition loop
  return import.meta.env.DEV ? (
    <StrictMode>{appContent}</StrictMode>
  ) : (
    appContent
  );
};

const app = createRoot(document.querySelector('#root')!);
app.render(<Layout />);
