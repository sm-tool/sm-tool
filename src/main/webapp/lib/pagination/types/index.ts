import {
  createSortParameter,
  SortParameters,
} from '@/lib/pagination/types/sort.ts';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/lib/pagination/constants.ts';
import { FilterParameters } from '@/lib/pagination/types/filter.ts';

export interface DefaultPaginatedParameters<T> {
  page?: number;
  size?: number;
  sort: SortParameters<T>;
  filter?: FilterParameters;
}

export const getDefaultPaginatedParameters = <T>({
  page = DEFAULT_PAGE,
  size = DEFAULT_PAGE_SIZE,
  sort,
  filter,
}: DefaultPaginatedParameters<T>): Record<string, unknown> =>
  ({
    page,
    size,
    sort: createSortParameter(sort),
    ...(filter?.searchQuery && {
      [filter.searchType || 'title']: filter.searchQuery,
    }),
  }) as const;
