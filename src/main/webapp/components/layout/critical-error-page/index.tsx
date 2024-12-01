import { AppError } from '@/types/errors.ts';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/shadcn/card.tsx';
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/shadcn/alert.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';

const handleRefresh = () => {
  globalThis.window.location.reload();
};

const CriticalErrorPage = ({ error }: { error: AppError }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className='fixed inset-0 backdrop-blur-sm flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-0 flex flex-row items-center gap-4'>
          <div className='bg-destructive/20 rounded-full p-3'>
            <AlertTriangle className='w-8 h-8 text-destructive' />
          </div>
          <div>
            <AlertTitle className='text-xl'>Critical Error</AlertTitle>
            <AlertDescription className='mt-1'>
              The application has encountered a critical error
            </AlertDescription>
          </div>
        </CardHeader>

        <CardContent className='p-6'>
          <Alert variant='danger'>
            <p className='font-mono text-sm break-all'>{error.message}</p>
          </Alert>

          <div className='mt-6 flex gap-4'>
            <Button
              variant='primary'
              className='flex-1'
              onClick={handleRefresh}
            >
              <RefreshCw className='w-4 h-4 mr-2' />
              Refresh Page
            </Button>

            <Button
              variant='outline'
              className='flex-1'
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <ChevronUp className='w-4 h-4 mr-2' />
              ) : (
                <ChevronDown className='w-4 h-4 mr-2' />
              )}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* TODO: Add production flag*/}
      {showDetails && (
        <Card className='w-full max-w-md mt-4 animate-appearance-in'>
          <CardContent className='p-4'>
            <div className='max-h-48 overflow-y-auto'>
              <pre className='text-xs font-mono whitespace-pre-wrap break-all bg-muted p-4 rounded-lg'>
                {JSON.stringify(error, undefined, 2)}
                {error.stack}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CriticalErrorPage;
