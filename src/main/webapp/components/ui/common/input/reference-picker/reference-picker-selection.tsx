import { QueryRequest } from '@/lib/hal-pagination/types/pagination.types.ts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import React from 'react';
import InfiniteList from '@/lib/react-query/components/infinite-scroll';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import EmptyComponent from '@/components/ui/common/data-load-states/empty-component';
import { Checkbox } from '@/components/ui/shadcn/checkbox.tsx';

interface ReferencePickerSelectionProperties<
  T,
  TSearchEndpoint extends string,
> {
  value?: number[];
  onChange: (value: number[] | undefined) => void;
  infiniteQuery: (
    request?: QueryRequest<T, TSearchEndpoint>,
  ) => ReturnType<
    typeof useInfiniteQuery<HalPaginatedResponse<T, TSearchEndpoint>>
  >;
  renderItem: (item: number) => React.ReactNode;
  getItemId: (item: T) => number;
  placeholder?: string;
  emptyComponent?: React.ReactNode;
  topUtil?: React.ReactNode;
  filterFunction?: (item: number) => boolean;
}

const ReferencePickerSelection = <T, TSearchEndpoint extends string>({
  value,
  onChange,
  infiniteQuery,
  renderItem,
  getItemId,
  emptyComponent,
  topUtil,
  filterFunction,
}: ReferencePickerSelectionProperties<T, TSearchEndpoint>) => {
  const contentReference = React.useRef<HTMLDivElement>(null);
  const query = infiniteQuery();

  const handleSelect = (item: T) => {
    const itemId = getItemId(item);
    const currentValues = value || [];
    const newValues = currentValues.includes(itemId)
      ? currentValues.filter(id => id !== itemId)
      : [...currentValues, itemId];

    onChange(newValues);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 2.2 && query.hasNextPage) {
      void query.fetchNextPage();
    }
  };

  return (
    <div className='w-full'>
      <div className='space-y-3 w-full'>
        {topUtil}
        <div
          className='h-[501px] overflow-auto'
          onScroll={handleScroll}
          ref={contentReference}
        >
          <InfiniteList<T, TSearchEndpoint>
            queryResult={query}
            loadingComponent={<LoadingSpinner />}
            emptyComponent={emptyComponent ?? <EmptyComponent />}
          >
            {items => {
              const filteredItems = items.filter(item =>
                filterFunction ? filterFunction(getItemId(item)) : true,
              );

              if (filteredItems.length === 0) {
                return (
                  <div className='flex items-center justify-center h-[451px]'>
                    <EmptyComponent
                      text={'No elements to import'}
                      className='bg-content2'
                    />
                  </div>
                );
              }

              return (
                <div className='space-y-1'>
                  {filteredItems.map(item => {
                    const itemId = getItemId(item);
                    return (
                      <div
                        key={itemId}
                        className='flex items-center justify-between hover:bg-accent rounded-md p-2
                          hover:cursor-pointer'
                      >
                        <div
                          className='flex-grow hover:cursor-pointer'
                          onClick={() => handleSelect(item)}
                        >
                          {renderItem(itemId)}
                        </div>
                        <Checkbox
                          checked={value?.includes(itemId) ?? false}
                          onCheckedChange={() => handleSelect(item)}
                          className='ml-2'
                        />
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </InfiniteList>
        </div>
      </div>
    </div>
  );
};

export default ReferencePickerSelection;
