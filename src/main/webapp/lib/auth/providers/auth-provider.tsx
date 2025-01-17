import { AuthState, IAuthDispatch, IAuthService } from '@/lib/auth/types.ts';
import React, { useCallback } from 'react';
import { AppError, ErrorLevel } from '@/lib/errors/errors.ts';
import useAuthInterceptors from '@/lib/auth/hooks/use-auth-interceptors.ts';
import { Timeout } from '@/hooks/use-debounce.ts';

export const AuthContext = React.createContext<IAuthService | undefined>(
  undefined,
);
export const AuthDispatchContext = React.createContext<
  IAuthDispatch | undefined
>(undefined);

/**
 * Provider kontekstu autoryzacji dla aplikacji React.
 *
 * @description
 * Komponent zarządza stanem autoryzacji, odświeżaniem tokenów oraz udostępnia
 * metody do zarządzania autoryzacją poprzez context API. Automatycznie inicjalizuje
 * serwis autoryzacji i ustawia interwał odświeżania tokenu co minutę.
 *
 * @param {React.ReactNode} children - Komponenty potomne
 * @param {IAuthService} authService - Implementacja serwisu autoryzacji (KeycloakService lub MockAuthService)
 *
 * Udostępnia dwa konteksty:
 * - AuthContext: dostęp do instancji serwisu autoryzacji
 * - AuthDispatchContext: dostęp do akcji autoryzacyjnych (login, logout, etc.)
 *
 * @example
 * ```tsx
 * const authService = createAuthClient();
 *
 * function App() {
 *   return (
 *     <AuthProvider authService={authService}>
 *       <Router>
 *         <YourApp />
 *       </Router>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
const AuthProvider = ({
  children,
  authService,
}: {
  children: React.ReactNode;
  authService: IAuthService;
}) => {
  const [state, setState] = React.useState<AuthState>({
    isAuthenticated: false,
    token: undefined,
    tokenData: undefined,
  });
  // HACK: If anyone is willing to spend 1 minute fixing vite types, please do so :>
  const refreshIntervalReference = React.useRef<Timeout>();

  const updateAuthState = useCallback(() => {
    setState({
      isAuthenticated: authService.isAuthenticated(),
      token: authService.getToken(),
      tokenData: authService.getTokenData(),
    });
  }, [authService]);

  React.useEffect(() => {
    const initializeAuth = async () => {
      await authService.initialize();
      updateAuthState();

      if (await authService.refreshAndAuthenticate()) {
        refreshIntervalReference.current = globalThis.setInterval(() => {
          void (async () => {
            try {
              await authService.refreshToken();
              updateAuthState();
            } catch {
              await authService.logout();
              throw new AppError(
                'Error refreshing token, your session has expired',
                ErrorLevel.CRITICAL,
              );
            }
          })();
        }, 1000 * 60);
      }
    };

    void initializeAuth();

    return () => {
      if (refreshIntervalReference.current) {
        globalThis.clearInterval(refreshIntervalReference.current);
      }
    };
  }, []);

  const clearAuthState = () => {
    setState({
      isAuthenticated: false,
      token: undefined,
      tokenData: undefined,
    });
  };

  const dispatch: IAuthDispatch = {
    login: async () => {
      await authService.login();
      updateAuthState();
    },
    logout: async () => {
      await authService.logout();
      if (refreshIntervalReference.current) {
        globalThis.clearInterval(refreshIntervalReference.current);
        refreshIntervalReference.current = undefined;
      }
      clearAuthState();
    },
    register: () => authService.register(),
    updateProfile: () => authService.updateProfile(),
    updatePassword: () => authService.updatePassword(),
    deleteAccount: () => authService.deleteAccount(),
  };

  useAuthInterceptors(authService, state, updateAuthState, dispatch);

  return (
    <AuthContext.Provider value={authService}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
