'use client';

import { createContext, useCallback, useContext } from 'react';
import { Toaster } from 'sonner';
import { ToastActionElement } from '@/components/ui/shadcn/toast';
import { toast } from '@/components/ui/shadcn/use-toast';
import { TooltipProvider } from '@/components/ui/shadcn/tooltip';

type ToastOptions = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  duration?: number;
  // TODO: dodać ikonę i wariant
};

type NotificationProperties = {
  toasterProps?: React.ComponentProps<typeof Toaster>;
  children?: React.ReactNode;
};

const NotificationContext = createContext<
  ((options: ToastOptions) => void) | undefined
>(undefined);

export const NotificationProvider = ({
  toasterProps,
  children,
}: NotificationProperties) => {
  const showNotification = useCallback((options: ToastOptions) => {
    toast(options);
  }, []);

  return (
    <TooltipProvider>
      <NotificationContext.Provider value={showNotification}>
        {children}
        <Toaster {...toasterProps} />
      </NotificationContext.Provider>
    </TooltipProvider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};
