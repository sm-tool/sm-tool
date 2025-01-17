import { AuthenticationTokenData, IAuthService } from '@/lib/auth/types.ts';

/**
 * Mockowa implementacja serwisu autoryzacji do celów deweloperskich.
 *
 * @description
 * Klasa implementuje interfejs IAuthService zwracając zawsze pozytywne odpowiedzi
 * i symulując zalogowanego użytkownika. Wszystkie metody są asynchroniczne
 * dla zachowania zgodności z interfejsem, ale zwracają natychmiastowe odpowiedzi.
 *
 * Użytkownik mock zawsze:
 * - jest zalogowany (isAuthenticated zwraca true)
 * - posiada token testowy "test"
 * - ma przypisane podstawowe dane użytkownika (email: localuser@smt.com)
 *
 * @example
 * ```ts
 * const mockAuth = new MockAuthService();
 *
 * // Inicjalizacja zawsze kończy się sukcesem
 * await mockAuth.initialize(); // true
 *
 * // Użytkownik jest zawsze zalogowany
 * const isLoggedIn = mockAuth.isAuthenticated(); // true
 * const token = mockAuth.getToken(); // "test"
 *
 * // Operacje na koncie nie mają efektu
 * await mockAuth.updateProfile(); // void
 * await mockAuth.login(); // void
 * ```
 */
export class MockAuthService implements IAuthService {
  async initialize() {
    return await Promise.resolve(true);
  }

  async login(_redirectUri?: string) {
    return await Promise.resolve();
  }

  async logout(_redirectUri?: string) {
    return await Promise.resolve();
  }

  async register(_redirectUri?: string) {
    return await Promise.resolve();
  }

  getToken() {
    return 'test';
  }

  refreshAndAuthenticate = async () => {
    return await Promise.resolve(true);
  };

  isAuthenticated = () => true;

  getTokenData(): AuthenticationTokenData | undefined {
    return {
      clientId: '1',
      email: 'localuser@smt.com',
      given_name: 'to jest',
      family_name: 'user',
      roles: [],
    };
  }

  async refreshToken(): Promise<void> {
    return await Promise.resolve();
  }

  updateProfile = async () => {
    return await Promise.resolve();
  };

  updatePassword = async () => {
    return await Promise.resolve();
  };

  deleteAccount = async () => {
    return await Promise.resolve();
  };
}
