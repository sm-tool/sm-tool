import { AppError, ErrorLevel } from '@/lib/errors/errors.ts';
import React from 'react';
import { router } from '@/lib/core.tsx';
import { toast } from 'sonner';
import { todoToast } from '@/components/ui/shadcn/toaster.tsx';
import { Route as r500Route } from '@/app/errors/500';

interface ErrorBoundaryProperties {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: AppError }>;
}

interface State {
  error: AppError | undefined;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProperties,
  State
> {
  state: State = { error: undefined };

  static getDerivedStateFromError(error: AppError) {
    return { error };
  }

  componentDidCatch(error: AppError) {
    todoToast(error.message);
    switch (error.level) {
      case ErrorLevel.CRITICAL: {
        void router.navigate({ to: r500Route.to });
        break;
      }
      case ErrorLevel.ERROR: {
        toast.error(error.message);
        break;
      }
      case ErrorLevel.WARNING: {
        toast.warning(error.message);
        this.setState({ error: undefined });
        break;
      }
      case ErrorLevel.SILENT: {
        if (import.meta.env.DEV) {
          this.setState({ error: undefined });
          if (import.meta.env.DEV) {
            console.warn('[Silent Error]:', error);
          }
        }
      }
    }
  }

  render() {
    const { error } = this.state;
    const { children, fallback: FallbackComponent } = this.props;

    if (error) {
      if (error.level === ErrorLevel.ERROR && FallbackComponent) {
        return <FallbackComponent error={error} />;
      }
      return;
    }

    return children;
  }
}
