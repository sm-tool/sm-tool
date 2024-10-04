import { Toaster } from '@/components/ui/shadcn/toaster.tsx';
import { TooltipProvider } from '@/components/ui/shadcn/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import useDarkMode from 'use-dark-mode';
import '@/styles/global.css';

import routes from '~react-pages';

const App = () => {
  return useRoutes(routes);
};

const Layout = ({ children }: { children: ReactNode }) => {
  const darkMode = useDarkMode(true);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode.value);
  }, [darkMode]);

  return (
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={new QueryClient()}>
          <main className={'h-screen bg-background text-foreground'}>
            <TooltipProvider>{children}</TooltipProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster />
          </main>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

const app = createRoot(document.querySelector('#root')!);

app.render(
  <Layout>
    <App />
  </Layout>,
);
