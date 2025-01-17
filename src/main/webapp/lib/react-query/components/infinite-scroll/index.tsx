import React from 'react';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';
import EmptyComponent from '@/components/ui/common/data-load-states/empty-component';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';

export type ErrorType = Error | AxiosError | ZodError | string;

interface InfiniteListProperties<TEntity, TSearchEndpoint extends string> {
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: ErrorType) => React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: (data: TEntity[]) => React.ReactNode;
  queryResult: UseInfiniteQueryResult<{
    pages: HalPaginatedResponse<TEntity, TSearchEndpoint>[];
  }>;
}

export const InfiniteList = <TEntity, TSearchEndpoint extends string>({
  loadingComponent = (
    <Skeleton className='h-screen w-full bg-content2 rounded-sm' />
  ),
  errorComponent = (error: ErrorType) => <ErrorComponent error={error} />,
  emptyComponent = (
    <div className='w-full h-full grid place-items-center'>
      <EmptyComponent text='No data was found' />
    </div>
  ),
  queryResult,
  children,
}: InfiniteListProperties<TEntity, TSearchEndpoint>) => {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = queryResult;

  const loadMoreReference = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const currentReference = loadMoreReference.current;
    if (!currentReference) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(currentReference);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items: TEntity[] = React.useMemo(() => {
    if (!data?.pages?.length) return [];
    if (!data.pages[0]?._embedded) return [];

    return data.pages.flatMap(page => {
      if (!page._embedded) return [];

      const key = Object.keys(page._embedded)[0] as TSearchEndpoint;
      return (page._embedded[key] as TEntity[]) || [];
    });
  }, [data]);

  if (isLoading) return loadingComponent;
  if (isError) return errorComponent(error as ErrorType);
  if (items.length === 0) return emptyComponent;

  return (
    <ScrollArea type='always'>
      <div className='pr-2'>
        {children(items)}
        <div ref={loadMoreReference} className='h-10'>
          {isFetchingNextPage && (
            <div className='flex justify-center py-4'>
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
      <ScrollBar className={'rounded-none'} />
    </ScrollArea>
  );
};

export default InfiniteList;
