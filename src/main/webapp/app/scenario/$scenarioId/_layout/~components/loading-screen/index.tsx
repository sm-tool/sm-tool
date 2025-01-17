// Let's not post original type names over here :|
import { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { Progress } from '@/components/ui/shadcn/progress.tsx';
import LoadingLogo from '@/components/ui/common/data-load-states/loadings/loading-logo';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/shadcn/alert.tsx';
import { AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@nextui-org/theme';

type QueryHookExecutor = () => UseQueryResult;

interface LoadingScreenPropertie {
  children: React.ReactNode;
  queries: QueryHookExecutor[];
  onLoadingCompleated?: () => void;
}

const LoadingScreen = ({
  children,
  queries,
  onLoadingCompleated,
}: LoadingScreenPropertie) => {
  const [retryCountdown, setRetryCountdown] = React.useState<number>(0);
  const queryResults = queries.map(queryFunction => queryFunction());
  const loadedQueries = queryResults.filter(query => !query.isLoading).length;
  const progress = Math.round((loadedQueries / queryResults.length) * 100);
  const isLoading = queryResults.some(query => query.isLoading);
  const failedQueries = queryResults.filter(query => query.failureCount > 0);
  const maxFailureCount = Math.max(
    ...queryResults.map(query => query.failureCount),
  );
  const isMaxRetriesReached = maxFailureCount > 5;

  React.useEffect(() => {
    if (failedQueries.length === 0) {
      setRetryCountdown(0);
      return;
    }
    if (!isMaxRetriesReached) {
      const delay = Math.min(1000 * 2 ** (maxFailureCount - 1), 30_000);
      setRetryCountdown(Math.round(delay / 1000));
      const interval = globalThis.setInterval(() => {
        setRetryCountdown(previous => (previous > 0 ? previous - 1 : 0));
      }, 1000);
      return () => globalThis.clearInterval(interval);
    }
  }, [maxFailureCount, isMaxRetriesReached]);

  React.useEffect(() => {
    if (!isLoading) {
      onLoadingCompleated?.();
    }
  }, [isLoading, onLoadingCompleated]);

  if (isLoading) {
    return (
      <div className='absolute inset-0 grid place-items-center'>
        <Card className='w-[90%] max-w-md p-6'>
          <h2 className='text-xl font-semibold text-center'>
            {isMaxRetriesReached ? 'Loading failed' : 'Loading scenario data'}
          </h2>
          <div className='flex items-center justify-center h-72 w-full'>
            {isMaxRetriesReached ? (
              <XCircle className='text-content3 size-32' />
            ) : (
              <LoadingLogo />
            )}
          </div>
          <div className='space-y-4'>
            <Progress
              value={progress}
              className={cn('w-full', {
                'bg-danger': isMaxRetriesReached,
              })}
            />
            <p
              className={cn('text-sm text-center', {
                'animate-pulse': !isMaxRetriesReached,
              })}
            >
              {`Loaded ${loadedQueries} out of ${queries.length} sources`}
            </p>
            <div className='min-h-20'>
              {failedQueries.length > 0 && (
                <Alert variant='danger'>
                  <AlertTriangle className='h-5 w-5' />
                  <AlertTitle className='font-extrabold'>
                    Failed to load data
                  </AlertTitle>
                  <AlertDescription>
                    {isMaxRetriesReached
                      ? 'All attempts to load data have failed. Please refresh the page or try again later.'
                      : retryCountdown <= 1
                        ? 'Querying now...'
                        : `Next attempt in ${retryCountdown - 1} seconds`}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }
  return children;
};

export default LoadingScreen;
