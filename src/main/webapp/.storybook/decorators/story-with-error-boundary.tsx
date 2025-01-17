import { Decorator } from '@storybook/react';
import { ErrorBoundary } from '@/utils/errors/boundary.tsx';

export const storyWithErrorBoundary: Decorator = Story => (
  <ErrorBoundary>
    <Story />
  </ErrorBoundary>
);
