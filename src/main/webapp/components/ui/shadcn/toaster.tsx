'use client';

import useDarkMode from '../../../hooks/use-dark-mode';
import { toast, Toaster as Sonner } from 'sonner';
import React from 'react';

type ToasterProperties = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...properties }: ToasterProperties) => {
  const { theme } = useDarkMode();

  return (
    <Sonner
      theme={theme}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast: `group toast 
             group-[.toaster]:bg-content1 
             group-[.toaster]:text-foreground 
             group-[.toaster]:border-content3 
             group-[.toaster]:shadow-sm
             group-[.toaster]:rounded-md
             group-[.toaster]:transition-all
             group-[.toaster]:duration-200`,
          description: `group-[.toast]:text-content4
                   group-[.toast]:text-sm`,
          actionButton: `group-[.toast]:bg-primary 
                    group-[.toast]:text-background
                    group-[.toast]:hover:bg-primary/90
                    group-[.toast]:transition-colors
                    group-[.toast]:duration-200
                    group-[.toast]:rounded-md
                    group-[.toast]:px-3 
                    group-[.toast]:py-1.5
                    group-[.toast]:text-sm
                    group-[.toast]:font-medium`,
          cancelButton: `group-[.toast]:text-content4
                    group-[.toast]:hover:text-foreground
                    group-[.toast]:transition-colors
                    group-[.toast]:duration-200
                    group-[.toast]:rounded-md
                    group-[.toast]:px-3 
                    group-[.toast]:py-1.5
                    group-[.toast]:text-sm
                    group-[.toast]:font-medium`,
        },
      }}
      {...properties}
    />
  );
};

export const todoToast = (todoWhat?: string) =>
  toast.error('TODO', {
    description: `TODO ${todoWhat}`,
  });

export { Toaster };
