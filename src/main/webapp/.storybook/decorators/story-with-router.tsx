import { Decorator } from '@storybook/react';
import { RouterProvider } from '@tanstack/react-router';
import { core } from '@/lib/core.tsx';

export const storyWithRouter: Decorator = Story => (
  <RouterProvider router={core.router} defaultComponent={() => <Story />} />
);
