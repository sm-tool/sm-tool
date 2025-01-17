import {
  FilterRequest,
  PaginationRequest,
  QueryRequest,
  SortRequest,
} from '@/lib/hal-pagination/types/pagination.types.ts';

/**
 * Stan paginacji udostępniający metody do zarządzania requestem.
 * @template TEntity - Typ encji której dotyczy paginacja
 * @template TSearchEndpoints - Dozwolone typy wyszukiwania
 */
export interface PaginationState<TEntity, TSearchEndpoints extends string> {
  /** Aktualny stan requestu zawierający konfigurację paginacji, sortowania i filtrowania */
  request: QueryRequest<TEntity, TSearchEndpoints>;

  /** Aktualizuje cały obiekt requestu */
  setRequest: (request: QueryRequest<TEntity, TSearchEndpoints>) => void;

  /** Aktualizuje tylko konfigurację sortowania. Przekazanie undefined usuwa sortowanie */
  setSort: (sort?: SortRequest<keyof TEntity>) => void;

  /** Aktualizuje tylko konfigurację filtrowania. Przekazanie undefined usuwa filtry */
  setFilter: (filter?: FilterRequest<TSearchEndpoints>) => void;

  /** Aktualizuje tylko konfigurację paginacji. Przekazanie undefined usuwa paginację */
  setPagination: (pagination?: PaginationRequest) => void;
}
