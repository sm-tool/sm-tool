import { PaginationState } from '@/lib/hal-pagination/types/pagination-state.types.ts';
import React from 'react';
import PaginationContext from '@/lib/hal-pagination/context';

/**
 * Hook dostarczający metody do zarządzania stanem paginacji, sortowania i filtrowania.
 *
 * @template TEntity - Typ encji, na której operuje hook
 * @template TSearchEndpoints - Typ endpointów wyszukiwania (jako string literal type)
 *
 * @throws {Error} Wyrzuca błąd jeśli hook jest używany poza kontekstem PaginationProvider
 *
 * @returns {PaginationState<TEntity, TSearchEndpoints>} Obiekt zawierający:
 * - request: aktualny stan requestu
 * - setRequest: funkcja do aktualizacji całego requestu
 * - setSort: funkcja do aktualizacji sortowania
 * - setFilter: funkcja do aktualizacji filtrów
 * - setPagination: funkcja do aktualizacji paginacji
 *
 * @example
 * function UserList() {
 *   const { request, setSort, setPagination } = usePagination<User, SearchEndpoints>();
 *
 *   return (
 *     <div>
 *       <Table
 *         data={users}
 *         onSort={(field) => setSort({ field, direction: 'asc' })}
 *         currentPage={request.pagination?.page}
 *         onPageChange={(page) => setPagination({ page, pageSize: 10 })}
 *       />
 *     </div>
 *   );
 * }
 */
const usePagination = <
  TEntity,
  TSearchEndpoints extends string,
>(): PaginationState<TEntity, TSearchEndpoints> => {
  const context = React.useContext(PaginationContext);

  if (!context) {
    throw new Error('usePagination must be used within PaginationProvider');
  }

  // eslint-disable-next-line -- niech już będzie te any
  return context;
};

export default usePagination;
