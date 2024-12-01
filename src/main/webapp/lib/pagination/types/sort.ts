export type SortDirection = 'asc' | 'desc';

type SortableKeys<T> = {
  [K in keyof T]: T[K] extends string | number | Date ? K : never;
}[keyof T];

export interface SortParameters<T> {
  field: SortableKeys<T>;
  direction?: SortDirection;
}

export const createSortParameter = <T>(
  sort?: SortParameters<T>,
): string | undefined => {
  if (!sort) return undefined;
  return `${String(sort.field)},${sort.direction || 'desc'}`;
};
