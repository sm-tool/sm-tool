import { TooltipProvider } from '@radix-ui/react-tooltip';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import '../src/main/webapp/styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import { STORYBOOK_MODES, STORYBOOK_SIZES } from './constants';

const preview: Preview = {
  parameters: {
    nextjs: { router: { basePath: '' }, appDirectory: true },
    chromatic: { modes: STORYBOOK_MODES },
    viewport: { defaultViewport: 'large', viewports: STORYBOOK_SIZES },
  },
  async beforeAll() {},

  decorators: [
    Story => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { staleTime: Infinity, refetchOnMount: true },
        },
      });

      return (
        <StrictMode>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>{<Story />}</TooltipProvider>
              <Toaster />
            </QueryClientProvider>
          </BrowserRouter>
        </StrictMode>
      );
    },

    withThemeByDataAttribute<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],

  tags: ['autodocs'],
};

export default preview;
