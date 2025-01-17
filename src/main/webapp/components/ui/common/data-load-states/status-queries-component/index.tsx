import React from 'react';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import { UseQueryResult } from '@tanstack/react-query';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';
import EmptyComponent from '@/components/ui/common/data-load-states/empty-component';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import { ErrorType } from '@/lib/react-query/components/infinite-scroll';

interface StatusQueriesComponentProperties<T> {
  useQueries: Array<UseQueryResult<T[]>>;
  children: (data: T[]) => React.ReactElement;
  loadingComponent?: React.ReactElement;
  errorComponent?: (error: ErrorType) => React.ReactElement;
  emptyComponent?: React.ReactElement;
}

const StatusQueriesComponent = <T,>({
  useQueries,
  children,
  loadingComponent = <Skeleton className='h-screen w-full rounded-sm' />,
  errorComponent = error => <ErrorComponent error={error} />,
  emptyComponent = <EmptyComponent text='no data found' />,
}: StatusQueriesComponentProperties<T>): React.ReactElement | undefined => {
  const isLoading = useQueries.some(query => query.isLoading);
  const isError = useQueries.some(query => query.isError);
  const errors = useQueries
    .map(query => query.error)
    .filter(Boolean)
    .flat();
  const data = useQueries
    .map(query => query.data)
    .filter(Boolean)
    .flat() as T[];

  const isDevelopment = import.meta.env.DEV;
  const [showLoading, setShowLoading] = React.useState(isLoading);

  React.useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else if (showLoading) {
      const delay = isDevelopment
        ? 0
        : Math.floor(Math.random() * (999 - 400 + 1)) + 400;
      const timer = globalThis.setTimeout(() => setShowLoading(false), delay);
      return () => globalThis.clearTimeout(timer);
    }
  }, [isLoading]);

  if (showLoading) {
    return (
      <div className='transition-opacity duration-200'>
        {loadingComponent ?? (
          <div className='flex justify-center items-center p-4 h-full'>
            <LoadingSpinner />
          </div>
        )}
      </div>
    );
  }

  if (isError) {
    console.log(errors);
    return (
      errorComponent(errors[0] as ErrorType) ?? (
        <div className='flex justify-center items-center p-4 w-full h-full'>
          <ErrorComponent error={errors[0] as ErrorType} />
        </div>
      )
    );
  }

  if (data.length === 0) {
    return (
      <div className='flex justify-center items-center p-4 h-full'>
        {emptyComponent}
      </div>
    );
  }

  if (data) return children(data);
  return;
};

export default StatusQueriesComponent;
