export const generatePaginationRange = (
  currentPage: number,
  totalPages: number,
) => {
  let pages: (number | '...')[] = [];

  pages.push(0);

  if (currentPage > 3) {
    pages.push('...');
  }

  for (
    let index = Math.max(1, currentPage - 1);
    index <= Math.min(currentPage + 1, totalPages - 2);
    index++
  ) {
    pages.push(index);
  }

  if (currentPage < totalPages - 4) {
    pages.push('...');
  }

  if (totalPages > 1) {
    pages.push(totalPages - 1);
  }

  return pages;
};
