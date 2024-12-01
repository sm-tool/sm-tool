import { Button } from '@/components/ui/shadcn/button.tsx';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePaginationContext } from '@/lib/pagination/context/pagination-context.tsx';

const calculateVisiblePages = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7,
) => {
  if (maxVisible % 2 == 0) maxVisible--;

  const halfVisible = Math.floor(maxVisible / 2);
  const pages: (number | 'dots')[] = [];

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  // First half
  if (currentPage <= halfVisible) {
    for (let index = 0; index <= maxVisible - 2; index++) {
      pages.push(index);
    }
    pages.push('dots', totalPages - 1);
    return pages;
  }

  // Second half
  if (currentPage >= totalPages - halfVisible - 1) {
    pages.push(0, 'dots');
    for (
      let index = totalPages - (maxVisible - 2);
      index < totalPages;
      index++
    ) {
      pages.push(index);
    }
    return pages;
  }

  // middle
  pages.push(0, 'dots');
  for (
    let index = currentPage - Math.floor(halfVisible / 2);
    index <= currentPage + Math.floor(halfVisible / 2);
    index++
  ) {
    pages.push(index);
  }
  pages.push('dots', totalPages - 1);
  return pages;
};

const PageNavigation = () => {
  const { currentPage, totalPages, setPage } = usePaginationContext();
  const visiblePages = calculateVisiblePages(currentPage, totalPages);

  return (
    <div className='flex items-center gap-x-2'>
      <Button
        variant='outline'
        size='icon'
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronFirst className='h-4 w-4 flex-shrink-0' />
      </Button>
      <Button
        variant='outline'
        size='icon'
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeft className='h-4 w-4 flex-shrink-0' />
      </Button>
      {visiblePages.map((page, index) =>
        page === 'dots' ? (
          <Button key={`dots-${index}`} variant='outline' disabled>
            ...
          </Button>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            onClick={() => setPage(page)}
          >
            {page + 1}
          </Button>
        ),
      )}
      <Button
        variant='outline'
        size='icon'
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
      <Button
        variant='outline'
        size='icon'
        onClick={() => setPage(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronLast className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default PageNavigation;
