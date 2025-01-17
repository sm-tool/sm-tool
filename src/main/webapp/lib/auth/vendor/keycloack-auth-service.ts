import { AuthenticationTokenData, IAuthService } from '@/lib/auth/types.ts';
import Keycloak from 'keycloak-js';
import { core } from '@/lib/core.tsx';

/**
 * Serwis autoryzacji wykorzystujący Keycloak do implementacji interfejsu IAuthService.
 *
 * @description
 * Klasa implementuje logikę autoryzacji przez Keycloak, w tym:
 * - inicjalizację klienta Keycloak
 * - logowanie/wylogowywanie użytkownika
 * - odświeżanie tokenów
 * - zarządzanie profilem użytkownika
 *
 * Wymaga poprawnie skonfigurowanych zmiennych środowiskowych:
 * - APP_URL - URL aplikacji
 * - KEYCLOAK_URL - URL serwera Keycloak
 * - KEYCLOAK_REALM - nazwa realmu Keycloak
 * - KEYCLOAK_CLIENT_ID - ID klienta w Keycloak
 *
 * @example
 * ```ts
 * const auth = new KeycloakService();
 *
 * // Inicjalizacja
 * await auth.initialize();
 *
 * // Logowanie z przekierowaniem
 * await auth.login('/dashboard');
 *
 * // Sprawdzanie tokenu
 * const token = auth.getToken();
 * const isLoggedIn = auth.isAuthenticated();
 *
 * // Odświeżanie tokenu
 * await auth.refreshToken();
 *
 * // Wylogowanie
 * await auth.logout();
 * ```
 */
export class KeycloakService implements IAuthService {
  private keycloak: Keycloak;
  private url = globalThis.process.env.APP_URL;

  private authenticationConfig = {
    url: globalThis.process.env.KEYCLOAK_URL!,
    realm: globalThis.process.env.KEYCLOAK_REALM!,
    clientId: globalThis.process.env.KEYCLOAK_CLIENT_ID!,
  };

  constructor() {
    this.keycloak = new Keycloak(this.authenticationConfig);
  }

  async initialize() {
    try {
      const initialized = await this.keycloak.init({
        onLoad: 'login-required',
        pkceMethod: 'S256',
        enableLogging: true,
      });

      this.keycloak.onTokenExpired = () => {
        core.queryClient.clear();
      };

      return initialized;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      return false;
    }
  }

  async login(redirectUri?: string) {
    globalThis.sessionStorage.setItem('auth_redirect', redirectUri || '');
    return await this.keycloak.login({
      redirectUri: `${this.url}${redirectUri}`,
    });
  }

  async logout(redirectUri?: string) {
    core.queryClient.clear();

    return await this.keycloak.logout({
      redirectUri: redirectUri ?? globalThis.location.origin,
    });
  }

  async register(redirectUri?: string) {
    return await this.keycloak.register({
      redirectUri: redirectUri ?? globalThis.location.origin,
    });
  }

  getToken() {
    if (!this.keycloak.authenticated) {
      return;
    }
    return this.keycloak.token;
  }

  refreshAndAuthenticate = async () => {
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.authenticated ?? false;
    } catch {
      return false;
    }
  };

  isAuthenticated = () => this.keycloak.authenticated ?? false;

  getTokenData(): AuthenticationTokenData | undefined {
    if (!this.keycloak.authenticated) {
      return;
    }
    return this.keycloak.tokenParsed as AuthenticationTokenData;
  }

  async refreshToken(): Promise<void> {
    try {
      const refreshed = await this.keycloak.updateToken(30);
      if (!refreshed) {
        return;
      }
    } catch {
      core.queryClient.clear();
      await this.logout();
    }
  }

  // eslint-disable-next-line -- interface requirement
  updateProfile = async () => {
    globalThis.location.href = this.getOIDCRedirectUrl('account/profile');
  };

  // eslint-disable-next-line -- interface requirement
  updatePassword = async () => {
    globalThis.location.href = this.getOIDCRedirectUrl(
      '/account/credentials/password',
    );
  };

  // eslint-disable-next-line -- interface requirement
  deleteAccount = async () => {
    globalThis.location.href = this.getOIDCRedirectUrl('account');
  };

  private getOIDCRedirectUrl = (endpoint: string) => {
    const parameters = new URLSearchParams({
      client_id: this.authenticationConfig.clientId,
      redirect_uri: globalThis.location.origin,
      response_type: 'code',
      scope: 'open_id',
      response_mode: 'query',
    });

    return `${this.authenticationConfig.url}/realms/${this.authenticationConfig.realm}/protocol/openid-connect/${endpoint}?${parameters}`;
  };
}
