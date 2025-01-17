import { Decorator } from '@storybook/react';
import { NotificationProvider } from '@/providers/notification-provider.tsx';

export const storyWithNotifications: Decorator = Story => (
  <NotificationProvider
    toasterProps={{
      className: 'top-16',
      position: 'top-center',
      richColors: true,
    }}
  >
    <Story />
  </NotificationProvider>
);
