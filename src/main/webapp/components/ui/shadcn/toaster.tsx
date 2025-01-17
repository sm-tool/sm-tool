'use client';

import useDarkMode from '../../../hooks/use-dark-mode.tsx';
import { toast, Toaster as Sonner } from 'sonner';
import React from 'react';
import { ZodError } from 'zod';
import {
  getApiErrorMessage,
  parseApiError,
} from '@/lib/api/types/errors/get-error-message.ts';

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
          actionButton: `group-[.toast]:bg-foreground 
                    group-[.toast]:text-background
                    group-[.toast]:hover:bg-default-500/80
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

export const notifyToast = (message: string) => {
  toast.info(message);
};

export const successToast = (message: string) => {
  toast.success(message);
};

export const handleErrorToast = (error: unknown, message?: string) => {
  const isDevelopment = import.meta.env.DEV;

  const apiError = parseApiError(error);
  if (apiError) {
    const errorMessage = getApiErrorMessage(apiError);
    if (apiError.errorCode !== 'DOES_NOT_EXIST') {
      toast.error(
        isDevelopment
          ? `${errorMessage} (${JSON.stringify(apiError)})`
          : errorMessage,
      );
    }
    return;
  }

  if (error instanceof ZodError) {
    console.error(error);
    toast.error(
      isDevelopment
        ? `${message ?? 'Validation error'}: ${error.errors.map(error => error.message).join(', ')}`
        : (message ?? 'Validation error'),
    );
    return;
  }

  toast.error(
    isDevelopment
      ? `${message ?? 'Error'}: ${error instanceof Error ? error.message : String(error)}`
      : (message ?? 'An unexpected error occurred'),
  );
  console.error(error);
};

export { Toaster };
