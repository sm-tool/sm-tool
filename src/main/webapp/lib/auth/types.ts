/**
 * Określa role użytkownika w aplikacji
 * @type {'user' | 'admin'}
 */
export type ApplicationRole = 'user' | 'admin';

/**
 * Reprezentuje stan uwierzytelnienia użytkownika
 * @interface
 */
export type AuthState = {
  /** Flaga określająca czy użytkownik jest zalogowany */
  isAuthenticated: boolean;
  /** Token uwierzytelniający JWT */
  token: string | undefined;
  /** Zdekodowane dane z tokenu uwierzytelniającego */
  tokenData: AuthenticationTokenData | undefined;
};

/**
 * Zawiera dane użytkownika zdekodowane z tokenu uwierzytelniającego
 * @interface
 */
export interface AuthenticationTokenData {
  /** Adres email użytkownika */
  email: string;
  /** Imię użytkownika */
  given_name: string;
  /** Nazwisko użytkownika */
  family_name: string;
  /** Lista ról użytkownika w aplikacji */
  roles: ApplicationRole[];
  /** Identyfikator klienta OAuth */
  clientId: string;
}

/**
 * Interfejs serwisu uwierzytelniania definiujący podstawowe operacje autoryzacyjne
 * @interface
 */
export interface IAuthService {
  /**
   * Inicjalizuje serwis uwierzytelniania
   * @returns {Promise<boolean>} Promise zwracający informację o powodzeniu inicjalizacji
   */
  initialize(): Promise<boolean>;

  /**
   * Loguje użytkownika do systemu
   * @param {string} [redirectUri] Opcjonalny URI przekierowania po zalogowaniu
   */
  login(redirectUri?: string): Promise<void>;

  /**
   * Wylogowuje użytkownika z systemu
   * @param {string} [redirectUri] Opcjonalny URI przekierowania po wylogowaniu
   */
  logout(redirectUri?: string): Promise<void>;

  /**
   * Rejestruje nowego użytkownika
   * @param {string} [redirectUri] Opcjonalny URI przekierowania po rejestracji
   */
  register(redirectUri?: string): Promise<void>;

  /**
   * Pobiera aktualny token uwierzytelniający
   * @returns {string | undefined} Token JWT lub undefined jeśli użytkownik nie jest zalogowany
   */
  getToken(): string | undefined;

  /**
   * Odświeża token uwierzytelniający
   */
  refreshToken(): Promise<void>;

  /**
   * Sprawdza czy użytkownik jest zalogowany
   * @returns {boolean} Status uwierzytelnienia
   */
  isAuthenticated(): boolean;

  /**
   * Odświeża token i weryfikuje uwierzytelnienie
   * @returns {Promise<boolean>} Promise zwracający status uwierzytelnienia
   */
  refreshAndAuthenticate(): Promise<boolean>;

  /**
   * Pobiera zdekodowane dane z tokenu
   * @returns {AuthenticationTokenData | undefined} Dane z tokenu lub undefined jeśli token nie istnieje
   */
  getTokenData(): AuthenticationTokenData | undefined;

  /**
   * Aktualizuje profil użytkownika
   */
  updateProfile(): Promise<void>;

  /**
   * Aktualizuje hasło użytkownika
   */
  updatePassword(): Promise<void>;

  /**
   * Usuwa konto użytkownika
   */
  deleteAccount(): Promise<void>;
}

/**
 * Interfejs dispatch'era akcji uwierzytelniania
 * @interface
 */
export interface IAuthDispatch {
  /** Akcja logowania użytkownika */
  login: () => Promise<void>;
  /** Akcja wylogowania użytkownika */
  logout: () => Promise<void>;
  /** Akcja rejestracji użytkownika */
  register: () => Promise<void>;
  /** Akcja aktualizacji profilu */
  updateProfile: () => Promise<void>;
  /** Akcja aktualizacji hasła */
  updatePassword: () => Promise<void>;
  /** Akcja usunięcia konta */
  deleteAccount: () => Promise<void>;
}
