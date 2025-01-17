import { AuthState, IAuthDispatch, IAuthService } from '@/lib/auth/types.ts';
import React from 'react';
import { API_INSTANCE } from '../../api';
import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

/**
 * Hook konfigurujący interceptory Axios dla autoryzacji.
 *
 * @description
 * Hook dodaje dwa interceptory do instancji Axios:
 * 1. Interceptor requestów - automatycznie dodaje token Bearer do nagłówka Authorization
 * 2. Interceptor odpowiedzi - obsługuje błędy 401 poprzez:
 *    - próbę odświeżenia tokenu
 *    - ponowienie oryginalnego zapytania z nowym tokenem
 *    - wylogowanie użytkownika w przypadku niepowodzenia
 *
 * @param {IAuthService} authService - Serwis autoryzacji
 * @param {AuthState} state - Stan autoryzacji zawierający token
 * @param {() => void} updateAuthState - Funkcja aktualizująca stan autoryzacji
 * @param {IAuthDispatch} dispatch - Obiekt z metodami do zarządzania autoryzacją
 *
 * @example
 * ```tsx
 * function AuthProvider() {
 *   const authService = useAuth();
 *   const [state, setState] = useState<AuthState>({});
 *
 *   useAuthInterceptors(
 *     authService,
 *     state,
 *     () => setState(getCurrentState()),
 *     authDispatch
 *   );
 *
 *   return <Provider>{children}</Provider>;
 * }
 * ```
 */
const useAuthInterceptors = (
  authService: IAuthService,
  state: AuthState,
  updateAuthState: () => void,
  dispatch: IAuthDispatch,
) => {
  React.useEffect(() => {
    const requestInterceptorId = API_INSTANCE.interceptors.request.use(
      config => {
        const headers = new AxiosHeaders(config.headers);
        if (state.token) {
          headers.set('Authorization', `Bearer ${state.token}`);
        }
        return {
          ...config,
          headers,
        } as InternalAxiosRequestConfig;
      },
    );

    const responseInterceptorId = API_INSTANCE.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error?.response?.status === 401 && error?.config) {
          try {
            await authService.refreshToken();
            updateAuthState();

            const headers = new AxiosHeaders(error.config.headers);
            headers.set('Authorization', `Bearer ${authService.getToken()}`);

            return void API_INSTANCE({
              ...error.config,
              headers,
            });
          } catch {
            await dispatch.logout();
          }
        }
        throw error;
      },
    );

    return () => {
      API_INSTANCE.interceptors.request.eject(requestInterceptorId);
      API_INSTANCE.interceptors.response.eject(responseInterceptorId);
    };
  }, [state.token]);
};

export default useAuthInterceptors;
