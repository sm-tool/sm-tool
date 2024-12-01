import React from 'react';

interface PaginationProviderProperies {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  aviablePageSizes: number[];
}

export const PaginationContext = React.createContext<
  PaginationProviderProperies | undefined
>(undefined);

export const usePaginationContext = () => {
  const context = React.useContext(PaginationContext);
  if (!context) {
    throw new Error('bla bla bla w kontekście');
  }
  return context;
};
