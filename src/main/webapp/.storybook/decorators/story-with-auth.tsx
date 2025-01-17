import { Decorator } from '@storybook/react';
import AuthProvider from '@/lib/auth/providers/auth-provider.tsx';
import { core } from '@/lib/core.tsx';

export const storyWithAuth: Decorator = Story => (
  <AuthProvider authService={core.authClient}>
    <Story />
  </AuthProvider>
);
