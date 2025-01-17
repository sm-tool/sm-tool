import { useContext } from 'react';
import { AuthDispatchContext } from '@/lib/auth/providers/auth-provider.tsx';

/**
 * Hook zwracający metody do zarządzania autoryzacją.
 *
 * @description
 * Udostępnia dostęp do metod autoryzacyjnych z AuthDispatchContext:
 * - login() - logowanie użytkownika
 * - logout() - wylogowanie użytkownika
 * - register() - rejestracja nowego użytkownika
 * - updateProfile() - aktualizacja profilu
 * - updatePassword() - zmiana hasła
 * - deleteAccount() - usunięcie konta
 *
 * @throws {Error}
 * Wyrzuca błąd jeśli hook jest używany poza komponentem AuthProvider
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const { logout } = useAuthDispatch();
 *
 *   return (
 *     <button onClick={() => logout()}>
 *       Wyloguj się
 *     </button>
 *   );
 * }
 * ```
 */
const useAuthDispatch = () => {
  const dispatch = useContext(AuthDispatchContext);

  if (!dispatch) {
    throw new Error('useAuthDispatch must be used within AuthProvider');
  }

  return dispatch;
};

export default useAuthDispatch;
