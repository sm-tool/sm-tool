import { AuthContext } from '@/lib/auth/providers/auth-provider.tsx';
import React from 'react';

/**
 * Hook zwracający instancję serwisu autoryzacji.
 *
 * @description
 * Udostępnia dostęp do serwisu autoryzacji z AuthContext, który zawiera
 * niskopoziomowe metody do zarządzania stanem autoryzacji:
 * - getToken() - pobranie aktualnego tokenu
 * - isAuthenticated() - sprawdzenie stanu autoryzacji
 * - getTokenData() - pobranie zdekodowanych danych z tokenu
 * - refreshToken() - odświeżenie tokenu
 *
 * @throws {Error}
 * Wyrzuca błąd jeśli hook jest używany poza komponentem AuthProvider
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const auth = useAuth();
 *   const userData = auth.getTokenData();
 *
 *   return (
 *     <div>
 *       <h1>Witaj {userData?.given_name}</h1>
 *     </div>
 *   );
 * }
 * ```
 */
const useAuth = () => {
  const authService = React.useContext(AuthContext);

  if (!authService) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return authService;
};

export default useAuth;
