package api.database.model.constant;

/// Określa poziomy uprawnień dostępu do scenariusza.
///
/// # Poziomy uprawnień
/// - `AUTHOR` - pełne uprawnienia, włącznie z zarządzaniem dostępem
/// - `EDIT` - możliwość modyfikacji scenariusza
/// - `VIEW` - tylko podgląd scenariusza
///
/// # Hierarchia uprawnień
/// ```
/// AUTHOR
///  ├── wszystkie uprawnienia EDIT
///  └── wszystkie uprawnienia VIEW
///
/// EDIT
///  └── wszystkie uprawnienia VIEW
/// ```
///
/// # Zastosowanie
/// Kontroluje zakres operacji dostępnych dla użytkownika
/// w kontekście konkretnego scenariusza.
///
/// @see api.database.entity.user.Permission uprawnienie
public enum PermissionType {
  /// Twórca scenariusza z pełnymi uprawnieniami
  /// - Może zarządzać dostępem
  /// - Może wykonywać wszystkie operacje
  AUTHOR,

  /// Uprawnienia do edycji scenariusza
  /// - Może modyfikować dane
  /// - Nie może zmieniać uprawnień
  EDIT,

  /// Uprawnienia do przeglądania scenariusza
  /// - Tylko odczyt
  /// - Brak możliwości modyfikacji
  VIEW,
}
