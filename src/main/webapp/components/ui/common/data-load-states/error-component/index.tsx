import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/shadcn/alert';
import { AlertTriangle } from 'lucide-react';

const ErrorComponent = (error: { error: Error }) => {
  const isDevelopment = import.meta.env.DEV;

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
              {error.error.message}
            </p>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorComponent;
