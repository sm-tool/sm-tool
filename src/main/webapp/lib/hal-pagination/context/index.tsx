import {
  FilterRequest,
  PaginationRequest,
  QueryRequest,
  SortRequest,
} from '@/lib/hal-pagination/types/pagination.types.ts';
import React from 'react';
import { PaginationState } from '@/lib/hal-pagination/types/pagination-state.types.ts';

/**
 * Provider komponentu do zarządzania stanem paginacji, sortowania i filtrowania.
 *
 * @template TEntity - Typ encji, na której operuje provider
 * @template TSearchEndpoints - Typ endpointów wyszukiwania (jako string literal type)
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {QueryRequest<TEntity, TSearchEndpoints>} [props.initialRequest={}] - Początkowy stan requestu zawierający konfigurację sortowania, filtrowania i paginacji
 * @param {function} [props.onRequestChange] - Callback wywoływany przy każdej zmianie requestu. Otrzymuje jako parametr nowy obiekt requestu
 *
 * @example
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * type SearchEndpoints = 'byName' | 'byEmail';
 *
 * function App() {
 *   return (
 *     <PaginationProvider<User, SearchEndpoints>
 *       initialRequest={{
 *         sort: { field: 'name', direction: 'asc' },
 *         filter: { endpoint: 'byName', value: 'John' },
 *         pagination: { page: 1, pageSize: 10 }
 *       }}
 *       onRequestChange={(request) => console.log('New request:', request)}
 *     >
 *       <UserList />
 *     </PaginationProvider>
 *   );
 * }
 */
interface PaginationProviderProperts<TEntity, TSearchEndpoints extends string> {
  children: React.ReactNode;
  initialRequest?: QueryRequest<TEntity, TSearchEndpoints>;
  onRequestChange?: (request: QueryRequest<TEntity, TSearchEndpoints>) => void;
}

const PaginationContext = React.createContext<
  // eslint-disable-next-line -- any is needed for the generic type
  PaginationState<any, any> | undefined
>(undefined);

export const PaginationProvider = <TEntity, TSearchEndpoints extends string>({
  children,
  initialRequest = {},
  onRequestChange,
}: PaginationProviderProperts<TEntity, TSearchEndpoints>) => {
  const [request, setRequestState] =
    React.useState<QueryRequest<TEntity, TSearchEndpoints>>(initialRequest);

  const setRequest = (newRequest: QueryRequest<TEntity, TSearchEndpoints>) => {
    setRequestState(newRequest);
    onRequestChange?.(newRequest);
  };

  const setSort = (sort?: SortRequest<keyof TEntity>) => {
    setRequest({ ...request, sort });
  };

  const setFilter = (filter?: FilterRequest<TSearchEndpoints>) => {
    setRequest({ ...request, filter });
  };

  const setPagination = (pagination?: PaginationRequest) => {
    setRequest({ ...request, pagination });
  };

  const value: PaginationState<TEntity, TSearchEndpoints> = {
    request,
    setRequest,
    setSort,
    setFilter,
    setPagination,
  };

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};

export default PaginationContext;
