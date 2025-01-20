import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Plus } from 'lucide-react';
import InfiniteList from '@/lib/react-query/components/infinite-scroll';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import EmptyComponent from '@/components/ui/common/data-load-states/empty-component';
import { QueryRequest } from '@/lib/hal-pagination/types/pagination.types.ts';
import { useInfiniteQuery } from '@tanstack/react-query';

interface ReferencePickerProperties<T, TSearchEndpoint extends string> {
  value?: number;
  onChange: (value: number | undefined) => void;
  infiniteQuery: (
    request?: QueryRequest<T, TSearchEndpoint>,
  ) => ReturnType<
    typeof useInfiniteQuery<HalPaginatedResponse<T, TSearchEndpoint>>
  >;
  renderOnButton?: (item: number) => React.ReactNode;
  renderItem: (item: number) => React.ReactNode;
  getItemId: (item: T) => number;
  placeholder?: string;
  emptyComponent?: React.ReactNode;
  filterCondition?: (item: T) => boolean;
  topUtil?: React.ReactNode;
  dialogTitle: string;
}

const ReferencePickerWithQuery = <T, TSearchEndpoint extends string>({
  value,
  onChange,
  infiniteQuery,
  renderOnButton,
  renderItem,
  getItemId,
  emptyComponent,
  filterCondition,
  topUtil,
  dialogTitle,
}: ReferencePickerProperties<T, TSearchEndpoint>) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const contentReference = React.useRef<HTMLDivElement>(null);

  const query = infiniteQuery();

  const handleSelect = (item: T) => {
    onChange(getItemId(item));
    setIsOpen(false);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 2.2 && query.hasNextPage) {
      void query.fetchNextPage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          {value ? (
            <>{renderOnButton ? renderOnButton(value) : renderItem(value)}</>
          ) : (
            <>
              <Plus className='mr-1 h-4 w-4' />
              Select object template
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col items-center justify-center w-full'>
        <DialogHeader className='w-full'>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className='space-y-3 w-full'>
          {topUtil}
          <div
            className='h-[501px]'
            onScroll={handleScroll}
            ref={contentReference}
          >
            <InfiniteList<T, TSearchEndpoint>
              queryResult={query}
              loadingComponent={<LoadingSpinner />}
              emptyComponent={emptyComponent ?? <EmptyComponent />}
              filterCondition={filterCondition}
            >
              {items => (
                <div className='space-y-1'>
                  {items.map(item => (
                    <div
                      key={getItemId(item)}
                      onClick={() => handleSelect(item)}
                      className='cursor-pointer hover:bg-accent rounded-md p-1'
                    >
                      {renderItem(getItemId(item))}
                    </div>
                  ))}
                </div>
              )}
            </InfiniteList>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferencePickerWithQuery;
