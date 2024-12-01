export interface PaginatedResponse<T> {
  content: T[];
  _embedded: {
    [key: string]: T[];
  };
  _links: {
    self: {
      href: string;
    };
  };
  totalElements: number; // TODO: WYWALIĆ JAK BACK NAPRAWI RESPONSE
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
