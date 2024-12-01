import { AuthState, IAuthDispatch, IAuthService } from '@/lib/auth/types.ts';
import React, { useCallback } from 'react';
import { AppError, ErrorLevel } from '@/types/errors.ts';
import useAuthInterceptors from '@/lib/auth/hooks/use-auth-interceptors.ts';

export const AuthContext = React.createContext<IAuthService | undefined>(
  undefined,
);
export const AuthDispatchContext = React.createContext<
  IAuthDispatch | undefined
>(undefined);

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
  const refreshIntervalReference =
    React.useRef<ReturnType<typeof globalThis.setTimeout>>();

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
