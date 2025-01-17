import Axios, { AxiosRequestConfig } from 'axios';
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from '@/lib/api/interceptors.ts';
import { API_DEFAULT_CONFIG, ApiConfig } from '@/lib/api/config.ts';
import { API_INSTANCE } from '@/lib/api/index.ts';
/**
 * Tworzy nową skonfigurowaną instancję Axios z domyślnymi ustawieniami i interceptorami.
 *
 * @param config - Opcjonalna konfiguracja API nadpisująca domyślne ustawienia
 * @returns Skonfigurowana instancja Axios
 *
 * @example
 * ```tsx
 * const instance = createAxiosInstance({
 *   baseURL: 'https://api.example.com',
 *   timeout: 5000
 * });
 * ```
 */

export const createAxiosInstance = (config?: ApiConfig) => {
  const instance = Axios.create({
    ...API_DEFAULT_CONFIG,
    ...config,
  });

  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);

  return instance;
};

/**
 * Tworzy klienta API opakowującego instancję Axios. Dodaje możliwość anulowania żądań
 * i automatycznie wypakowuje dane z odpowiedzi.
 *
 * @param instance - Opcjonalna instancja Axios do użycia (domyślnie używa API_INSTANCE)
 * @returns Funkcja klienta przyjmująca konfigurację żądania i zwracająca Promise z danymi
 *          oraz metodą cancel do anulowania żądania
 *
 * @example
 * ```tsx
 * const apiClient = createApiClient();
 *
 * const fetchData = async () => {
 *   const request = apiClient<User[]>({
 *     url: '/users',
 *     method: 'GET'
 *   });
 *
 *   try {
 *     const users = await request;
 *     console.log(users); // dane są już wypakowane z response.data
 *   } catch (error) {
 *     if (axios.isCancel(error)) {
 *       console.log('Request canceled');
 *     }
 *   }
 *
 *   // Można anulować żądanie
 *   request.cancel();
 * }
 * ```
 */
export const createApiClient = (instance = API_INSTANCE) => {
  return <T>(
    configuration: AxiosRequestConfig,
  ): Promise<T> & { cancel: () => void } => {
    const source = Axios.CancelToken.source();

    const promise = instance({
      ...configuration,
      cancelToken: source.token,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Is any
    }).then(({ data }) => data);

    return Object.assign(promise, {
      cancel: () => source.cancel('Operation canceled by cache system or user'),
    });
  };
};
