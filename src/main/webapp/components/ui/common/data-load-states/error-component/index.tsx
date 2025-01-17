import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/shadcn/alert';
import { AlertTriangle } from 'lucide-react';
import { isAxiosError } from 'axios';
import { ZodError } from 'zod';
import { ErrorType } from '@/lib/react-query/components/infinite-scroll';
import { cn } from '@nextui-org/theme';
import { Error404Component } from '@/components/ui/common/data-load-states/error-component/component-404-api.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';

export interface ErrorBaseProperties {
  error?: ErrorType;
  className?: string;
  variant?: 'default' | 'sm' | 'icon';
}

const ErrorComponent = ({
  error,
  className,
  variant = 'default',
}: ErrorBaseProperties) => {
  const isDevelopment = import.meta.env.DEV;
  if (isDevelopment) {
    console.log(error);
  }
  const getErrorMessage = () => {
    if (!error) return 'Connection with the server cannot be reached';
    if (isAxiosError(error)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- thats the check ts
      return `API Error: ${error.response?.data?.message || error.message}`;
    }
    if (error instanceof ZodError) {
      return `Validation Error: ${error.errors.map(error_ => error_.message).join(', ')}`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  };

  if (isAxiosError(error) && error.response?.status === 404)
    return <Error404Component variant={variant} />;

  if (variant === 'icon') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              'rounded-full bg-danger p-2 hover:bg-danger/90 transition-colors',
              className,
            )}
          >
            <AlertTriangle className='h-4 w-4 text-danger-foreground' />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='text-xs'>
            {isDevelopment ? getErrorMessage() : 'Unexpected error occurred'}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (variant === 'sm') {
    return (
      <Alert variant='danger' className={cn('p-3', className)}>
        <div className='flex items-center gap-3'>
          <AlertTriangle className='h-4 w-4' />
          <div>
            <p className='text-sm font-medium'>Unexpected Error</p>
            {isDevelopment ? (
              <p className='text-xs'>{getErrorMessage()}</p>
            ) : (
              <p className='text-xs'>Please try again later</p>
            )}
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <Alert variant='danger' className='mt-4'>
      <AlertTriangle className='h-4 w-4' />
      <AlertTitle className='ml-2'>
        {!isDevelopment && (
          <div className='space-y-3'>
            <p>It seems we have encountered an unexpected situation.</p>
            <p className='font-bold'>Please try again in a moment.</p>
          </div>
        )}
      </AlertTitle>
      <AlertDescription className='mt-2'>
        {isDevelopment && (
          <div className='text-sm'>
            <p className='mt-1 rounded bg-default-100 p-2 font-mono'>
              {getErrorMessage()}
            </p>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
export default ErrorComponent;
