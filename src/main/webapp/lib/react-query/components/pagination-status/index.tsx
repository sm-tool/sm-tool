import React from 'react';
import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import { UseQueryResult } from '@tanstack/react-query';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';
import EmptyComponent from '@/components/ui/common/data-load-states/empty-component';

interface PaginationStatusProperties<TEntity, TSearchEndpoints extends string> {
  loading?: React.ReactNode;
  error?: React.ReactNode;
  empty?: React.ReactNode;
  queryResult: UseQueryResult<HalPaginatedResponse<TEntity, TSearchEndpoints>>;
  children: (
    data: TEntity[],
    response: HalPaginatedResponse<TEntity, TSearchEndpoints>,
  ) => React.ReactNode;
}

export const PaginationStatus = <TEntity, TSearchEndpoints extends string>({
  loading = <LoadingSpinner />,
  error = <ErrorComponent />,
  empty = <EmptyComponent />,
  children,
  queryResult,
}: PaginationStatusProperties<TEntity, TSearchEndpoints>) => {
  const { data, isLoading, isError } = queryResult;

  if (isLoading) {
    return loading;
  }

  if (isError) {
    return error;
  }

  const items = data?._embedded
    ? (Object.values(data._embedded)[0] as TEntity[])
    : [];
  if (!data || !data._embedded || data.page.totalElements === 0) {
    return empty;
  }

  return children(items, data);
};

export default PaginationStatus;
