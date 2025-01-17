/**
 * Konfiguracja paginacji określająca aktualną stronę i ilość elementów na stronie.
 */
export interface PaginationRequest {
  page: number;
  size: number;
}

/**
 * Konfiguracja sortowania określająca pole i kierunek sortowania.
 * @template TEntityKey - Klucz encji po którym można sortować
 */
export interface SortRequest<TEntityKey extends string | number | symbol> {
  sort: Array<{
    field: TEntityKey;
    direction: 'asc' | 'desc';
  }>;
}

/**
 * Konfiguracja filtrowania określająca typ i wartość wyszukiwania.
 * @template TSearchEndpoints - Dozwolone typy wyszukiwania
 */
export interface FilterRequest<TSearchEndpoints extends string> {
  searchType: TSearchEndpoints;
  searchValue?: string;
}

/**
 * Pełna konfiguracja zapytania łącząca paginację, sortowanie i filtrowanie.
 * @template TEntity - Typ encji której dotyczy zapytanie
 * @template TSearchEndpoints - Dozwolone typy wyszukiwania
 */
export interface QueryRequest<
  TEntity,
  TSearchEndpoints extends string = string,
> {
  pagination?: PaginationRequest;
  sort?: SortRequest<keyof TEntity>;
  filter?: FilterRequest<TSearchEndpoints>;
}
