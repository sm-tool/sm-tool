export type ApplicationRole = 'user' | 'admin';

export type AuthState = {
  isAuthenticated: boolean;
  token: string | undefined;
  tokenData: AuthenticationTokenData | undefined;
};

export interface AuthenticationTokenData {
  email: string;
  given_name: string;
  family_name: string;
  roles: ApplicationRole[];
  clientId: string;
}

export interface IAuthService {
  initialize(): Promise<boolean>;
  login(redirectUri?: string): Promise<void>;
  logout(redirectUri?: string): Promise<void>;
  register(redirectUri?: string): Promise<void>;
  getToken(): string | undefined;
  refreshToken(): Promise<void>;
  isAuthenticated(): boolean;
  refreshAndAuthenticate(): Promise<boolean>;
  getTokenData(): AuthenticationTokenData | undefined;
  updateProfile(): Promise<void>;
  updatePassword(): Promise<void>;
  deleteAccount(): Promise<void>;
}

export interface IAuthDispatch {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  register: () => Promise<void>;
  updateProfile: () => Promise<void>;
  updatePassword: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}
