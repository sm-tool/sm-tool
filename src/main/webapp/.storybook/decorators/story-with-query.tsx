import { Decorator } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { core } from '@/lib/core.tsx';

export const storyWithQuery: Decorator = Story => (
  <QueryClientProvider client={core.queryClient}>
    <Story />
  </QueryClientProvider>
);
