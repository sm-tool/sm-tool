import { UseQueryResult } from '@tanstack/react-query';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import React from 'react';

interface StatusComponentProperties<T> {
  useQuery: () => UseQueryResult<T, unknown>;
  customLoading?: React.ReactElement;
  children: React.ReactElement;
}

const StatusComponent = <T,>({
  useQuery,
  customLoading,
  children,
}: StatusComponentProperties<T>): React.ReactElement | undefined => {
  const { isLoading, isError, error } = useQuery();

  if (isLoading) {
    return (
      customLoading ?? (
        <div className='flex justify-center items-center p-4 h-full'>
          <LoadingSpinner />
        </div>
      )
    );
  }
  if (isError) {
    return (
      <div className='flex justify-center items-center p-4 h-full'>
        <ErrorComponent error={error as Error} />
      </div>
    );
  }
  return children;
};

export default StatusComponent;
