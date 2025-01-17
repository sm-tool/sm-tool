/**
 * Reprezentuje odpowiedź stronicowaną zgodną ze standardem HAL (Hypertext Application Language).
 *
 * @template T - Typ danych zawartych w kolekcji
 * @template K - Klucz string określający nazwę kolekcji w _embedded
 *
 * @param {Object} response - Obiekt odpowiedzi
 * @param {Object} [response._embedded] - Kontener zawierający właściwą kolekcję danych
 * @param {T[]} [response._embedded[K]] - Tablica elementów kolekcji typu T
 *
 * @param {Object} response._links - Linki HAL do nawigacji między stronami
 * @param {Object} response._links.self - Link do bieżącej strony
 * @param {Object} [response._links.first] - Link do pierwszej strony
 * @param {Object} [response._links.prev] - Link do poprzedniej strony
 * @param {Object} [response._links.next] - Link do następnej strony
 * @param {Object} [response._links.last] - Link do ostatniej strony
 *
 * @param {Object} response.page - Informacje o bieżącej stronie i całej kolekcji
 * @param {number} response.page.size - Rozmiar strony (liczba elementów na stronie)
 * @param {number} response.page.totalElements - Całkowita liczba elementów w kolekcji
 * @param {number} response.page.totalPages - Całkowita liczba stron
 * @param {number} response.page.number - Numer bieżącej strony (indeksowane od 0)
 *
 * @example
 * type User = {
 *   id: number;
 *   name: string;
 * };
 *
 * const response: HalPaginatedResponse<User, 'users'> = {
 *   _embedded: {
 *     users: [
 *       { id: 1, name: "John Doe" },
 *       { id: 2, name: "Jane Smith" }
 *     ]
 *   },
 *   _links: {
 *     self: { href: "/api/users?page=0" },
 *     next: { href: "/api/users?page=1" },
 *     last: { href: "/api/users?page=5" }
 *   },
 *   page: {
 *     size: 2,
 *     totalElements: 12,
 *     totalPages: 6,
 *     number: 0
 *   }
 * };
 */
export interface HalPaginatedResponse<T, K extends string> {
  _embedded?: {
    [key in K]: T[];
  };
  _links: {
    self: {
      href: string;
    };
    first?: {
      href: string;
    };
    prev?: {
      href: string;
    };
    next?: {
      href: string;
    };
    last?: {
      href: string;
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
