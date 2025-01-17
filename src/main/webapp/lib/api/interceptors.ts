import {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { core, router } from '@/lib/core.tsx';
/**
 * Konfiguruje interceptor requestów dla instancji Axios. Automatycznie dodaje ID scenariusza
 * z URL do nagłówków żądania, jeśli URL zawiera segment 'scenario' z poprawnym ID.
 *
 * @param instance - Instancja Axios do skonfigurowania
 *
 * @example
 * ```tsx
 * const axiosInstance = axios.create();
 * setupRequestInterceptor(axiosInstance);
 *
 * // Teraz dla URL /scenario/123/details
 * // zostanie automatycznie dodany header scenarioId: "123"
 * ```
 */

export const setupRequestInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const pathname = router.state.location.pathname;
    const segments = pathname.split('/');

    const scenarioIndex = segments.indexOf('scenario');
    if (scenarioIndex === -1 || !segments[scenarioIndex + 1]) return config;

    const scenarioId = segments[scenarioIndex + 1];
    if (!Number.isNaN(Number(scenarioId))) {
      const headers = new AxiosHeaders(config.headers);
      headers.set('scenarioId', scenarioId);
      return {
        ...config,
        headers,
      };
    }

    return config;
  });
};

/**
 * Konfiguruje interceptor odpowiedzi dla instancji Axios. Obsługuje:
 * - Błędy 401 (Unauthorized) - czyści cache, wymusza ponowne logowanie i powtarza żądanie
 * - Błędy 403 (Forbidden) - czyści cache i przekierowuje do strony błędu
 *
 * @param instance - Instancja Axios do skonfigurowania
 *
 * @example
 * ```tsx
 * const axiosInstance = axios.create();
 * setupResponseInterceptor(axiosInstance);
 *
 * // Teraz nieautoryzowane żądania automatycznie wywołają ponowne logowanie
 * // a zabronione zasoby przekierują do strony błędu 403
 * ```
 */
export const setupResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        core.queryClient.clear();
        await core.authClient.login();
        const config = error.config as InternalAxiosRequestConfig;
        if (config) {
          return instance(config);
        }
      }

      if (error.response?.status === 403) {
        core.queryClient.clear();
        void core.router.navigate({ to: '/errors/403' });
      }

      throw error;
    },
  );
};
