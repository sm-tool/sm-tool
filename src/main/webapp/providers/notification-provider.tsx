import { Toaster } from '@/components/ui/shadcn/toaster.tsx';
import { TooltipProvider } from '@/components/ui/shadcn/tooltip';
import React from 'react';

type NotificationProperties = {
  toasterProps?: React.ComponentProps<typeof Toaster>;
  children?: React.ReactNode;
};

export const NotificationProvider = ({
  toasterProps,
  children,
}: NotificationProperties) => {
  return (
    <TooltipProvider>
      <Toaster {...toasterProps} />
      {children}
    </TooltipProvider>
  );
};
