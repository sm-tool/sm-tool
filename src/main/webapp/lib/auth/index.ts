import { KeycloakService } from '@/lib/auth/vendor/keycloack-auth-service.ts';
import { MockAuthService } from '@/lib/auth/vendor/mock-auth-service.ts';
import { AppError, ErrorLevel } from '@/lib/errors/errors.ts';

export type AuthClient = KeycloakService | MockAuthService;

const authClients = {
  mock: () => new MockAuthService(),
  keycloak: () => new KeycloakService(),
} as const;

/**
 * Tworzy i zwraca instancję serwisu autoryzacji na podstawie konfiguracji środowiskowej.
 *
 * @description
 * Funkcja sprawdza zmienną środowiskową FRONTEND_AUTH_PROVIDER i na jej podstawie
 * tworzy odpowiedni serwis autoryzacji - albo MockAuthService dla środowiska
 * deweloperskiego, albo KeycloakService dla środowiska produkcyjnego.
 *
 * Do poprawnego działania KeycloakService wymagane są zmienne środowiskowe:
 * - KEYCLOAK_URL
 * - KEYCLOAK_REALM
 * - KEYCLOAK_CLIENT_ID
 *
 * @throws {AppError}
 * Rzuca błąd krytyczny jeśli FRONTEND_AUTH_PROVIDER ma nieprawidłową wartość
 *
 * @example
 * ```ts
 * const authService = createAuthClient();
 *
 * // Używanie serwisu
 * await authService.login();
 * const token = authService.getToken();
 * ```
 */
export const createAuthClient = (): AuthClient => {
  const authType = globalThis.process.env.FRONTEND_AUTH_PROVIDER;
  console.log('Auth config:', {
    url: globalThis.process.env.KEYCLOAK_URL,
    realm: globalThis.process.env.KEYCLOAK_REALM,
    clientId: globalThis.process.env.KEYCLOAK_CLIENT_ID,
  });
  console.log(globalThis.process.env);
  const client = authClients[authType as keyof typeof authClients];

  if (!client) {
    throw new AppError(
      JSON.stringify(globalThis.process.env),
      ErrorLevel.CRITICAL,
    );
  }

  return client();
};
