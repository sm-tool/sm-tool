import { DefaultPaginatedParameters } from '../types';
import { UseQueryResult } from '@tanstack/react-query';
import { SortParameters } from '@/lib/pagination/types/sort.ts';
import React, { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination/constants.ts';
import { PaginatedResponse } from '@/lib/pagination/types/pagination.ts';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';
import { PaginationContext } from '@/lib/pagination/context/pagination-context.tsx';
import { FilterParameters } from '@/lib/pagination/types/filter.ts';

type QueryFunction<T> = ((
  parameters: DefaultPaginatedParameters<T>,
) => UseQueryResult<PaginatedResponse<T>>) & {
  parameters?: Partial<DefaultPaginatedParameters<T>>;
};

interface PaginatedStatusComponentProperties<T> {
  useQuery: QueryFunction<T>;
  filter?: FilterParameters;
  customLoading?: React.ReactNode;
  customEmpty?: React.ReactNode;
  children: (
    data: PaginatedResponse<T>,
    sortProperties: {
      sort: SortParameters<T>;
      setSort: (sort: SortParameters<T>) => void;
    },
  ) => React.ReactNode;
  defaultSort: SortParameters<T>;
  defaultPageSize?: number;
  aviablePageSizes?: number[];
}

const PaginatedStatusComponent = <T,>({
  useQuery,
  filter,
  customLoading,
  customEmpty,
  children,
  defaultSort,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  aviablePageSizes = [10, 20, 30, 40, 50],
}: PaginatedStatusComponentProperties<T>) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sort, setSort] = useState<SortParameters<T>>(defaultSort);

  const { data, isLoading, isError, isFetching, error } = useQuery({
    page,
    size: pageSize,
    sort,
    filter,
    ...useQuery.parameters,
  });

  if (isLoading || isFetching) {
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
        <ErrorComponent error={error} />
      </div>
    );
  }

  if (!data || !data.content || data?.content?.length === 0) {
    return (
      customEmpty ?? (
        <div className='flex justify-center items-center p-4 h-full'>
          <p>No results</p>
        </div>
      )
    );
  }

  return (
    <PaginationContext.Provider
      value={{
        currentPage: page,
        totalPages: data.totalElements,
        pageSize,
        aviablePageSizes,
        setPage,
        setPageSize,
      }}
    >
      {children(data, {
        sort,
        setSort,
      })}
    </PaginationContext.Provider>
  );
};

export default PaginatedStatusComponent;
