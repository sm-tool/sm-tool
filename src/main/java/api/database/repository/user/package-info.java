/// Pakiet zawiera repozytoria do zarządzania użytkownikami systemu i ich uprawnieniami.
/// Implementuje warstwę dostępu do danych dla modelu użytkowników, wykorzystując Spring Data JPA
/// i natywne zapytania SQL.
///
/// # Główne komponenty
/// - {@link api.database.repository.user.UserRepository} - zarządzanie danymi użytkowników
/// - {@link api.database.repository.user.PermissionRepository} - zarządzanie uprawnieniami do scenariuszy
/// - {@link api.database.repository.user.UserToObjectRepository} - powiązania użytkowników z obiektami
///
/// # Kluczowe funkcjonalności
/// - Podstawowe operacje CRUD na użytkownikach
/// - Zarządzanie uprawnieniami dostępu do scenariuszy
/// - Obsługa powiązań użytkowników z obiektami w systemie
/// - Wyszukiwanie użytkowników po różnych kryteriach
/// - Walidacja unikalności adresów email
///
/// # Powiązane encje
/// - {@link api.database.entity.user.User} - reprezentacja użytkownika
/// - {@link api.database.entity.user.Permission} - uprawnienia użytkownika
/// - {@link api.database.entity.user.UserToObject} - powiązanie z obiektem
///
/// # Ważne aspekty implementacyjne
/// - Wykorzystanie Spring Data JPA dla podstawowych operacji
/// - Obsługa kaskadowego usuwania powiązanych rekordów
/// - Zapewnienie spójności danych przy operacjach CRUD
/// - Optymalizacja wydajności poprzez odpowiednie indeksy
package api.database.repository.user;
