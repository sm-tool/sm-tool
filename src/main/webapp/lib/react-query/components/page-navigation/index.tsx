import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import usePagination from '@/lib/hal-pagination/hooks/use-pagination.ts';
import React from 'react';
import { generatePaginationRange } from '@/lib/react-query/components/page-navigation/generate-pagination-range.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigationButton from '@/lib/react-query/components/page-navigation/page-navigation-button.tsx';

interface PageNavigationProperties<TEntity, TSearchEndpoints extends string> {
  response: HalPaginatedResponse<TEntity, TSearchEndpoints>;
}

const PageNavigation = <TEntity, TSearchEndpoints extends string>({
  response,
}: PageNavigationProperties<TEntity, TSearchEndpoints>) => {
  const { setPagination } = usePagination<TEntity, TSearchEndpoints>();
  const { page, _links } = response;

  const handlePageChange = React.useCallback(
    (pageNumber: number) => {
      setPagination({ page: pageNumber, size: page.size });
    },
    [setPagination, page.size],
  );

  const paginationRange = React.useMemo(
    () => generatePaginationRange(page.number, page.totalPages),
    [page.number, page.totalPages],
  );

  if (page.totalPages <= 1) {
    return;
  }

  return (
    <nav
      role='navigation'
      aria-label='Pagination'
      className='flex items-center gap-2'
    >
      <Button
        variant='outline'
        size='sm'
        onClick={() => handlePageChange(page.number - 1)}
        disabled={!_links.prev}
        aria-label='Previous page'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      {paginationRange.map((pageNumber, index) =>
        pageNumber === '...' ? (
          <span key={`ellipsis-${index}`} className='px-2' aria-hidden='true'>
            ...
          </span>
        ) : (
          <PageNavigationButton
            key={`page-${pageNumber}`}
            page={pageNumber}
            isActive={pageNumber === page.number}
            onClick={handlePageChange}
          />
        ),
      )}

      <Button
        variant='outline'
        size='sm'
        onClick={() => handlePageChange(page.number + 1)}
        disabled={!_links.next}
        aria-label='Next page'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </nav>
  );
};
export default PageNavigation;
