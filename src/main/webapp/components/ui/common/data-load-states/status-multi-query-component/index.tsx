import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import EmptyComponent from '@/components/ui/common/data-load-states/empty-component';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';
import { UseQueryResult } from '@tanstack/react-query';
import { ErrorType } from '@/lib/react-query/components/infinite-scroll';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import React from 'react';

type MultiQueryResult<T> = {
  [K in keyof T]: UseQueryResult<T[K]>;
};

const MultiStatusComponent = <T extends Record<string, unknown>>({
  queries,
  children,
  loadingComponent = <Skeleton className='h-screen w-full rounded-sm' />,
  errorComponent = error => <ErrorComponent error={error} />,
  emptyComponent = <EmptyComponent text='no data found' />,
}: {
  queries: MultiQueryResult<T>;
  children: (data: T) => React.ReactElement;
  loadingComponent?: React.ReactElement;
  errorComponent?: (error: ErrorType) => React.ReactElement;
  emptyComponent?: React.ReactElement;
}): React.ReactElement => {
  const queryValues = Object.values(queries) as UseQueryResult[];

  const isDataComplete = queryValues.every(query => query.data !== undefined);
  const isLoading = queryValues.some(query => query.isLoading);
  const isError = queryValues.some(query => query.isError);
  const error = queryValues.find(query => query.error)?.error;

  if (isLoading || !isDataComplete) {
    return (
      <div className='transition-opacity duration-200'>
        {loadingComponent || (
          <div className='flex justify-center items-center p-4 h-full'>
            <LoadingSpinner />
          </div>
        )}
      </div>
    );
  }

  if (isError) {
    return (
      errorComponent(error as ErrorType) || (
        <div className='flex justify-center items-center p-4 w-full h-full'>
          <ErrorComponent error={error as ErrorType} />
        </div>
      )
    );
  }

  const initialValue = Object.fromEntries(
    Object.keys(queries).map(key => [key, undefined]),
  ) as T;

  const data = Object.entries(queries).reduce<T>(
    (accumulator, [key, query]: [string, UseQueryResult]) => {
      const typedKey = key as keyof T;
      const queryData = query.data as T[typeof typedKey] | undefined;

      if (queryData !== undefined) {
        accumulator[typedKey] = queryData;
      }
      return accumulator;
    },
    initialValue,
  );

  if (Object.keys(data).length === 0) {
    return (
      <div className='flex justify-center items-center p-4 h-full'>
        {emptyComponent}
      </div>
    );
  }

  return children(data);
};

export default MultiStatusComponent;
