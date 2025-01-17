/// Pakiet zawiera stałe enumeracyjne używane w całym systemie do reprezentowania
/// różnych stanów, typów i operacji.
///
/// # Zawartość pakietu
/// - {@link api.database.model.constant.ErrorCode} - kody błędów systemu używane w wyjątkach
/// - {@link api.database.model.constant.ErrorGroup} - grupowanie błędów według kontekstu/tabeli
/// - {@link api.database.model.constant.AssociationOperation} - operacje na asocjacjach (INSERT/DELETE)
/// - {@link api.database.model.constant.AttributeType} - typy atrybutów (INT, STRING, DATE, BOOL)
/// - {@link api.database.model.constant.BranchingType} - typy rozgałęzień wątków (JOIN/FORK)
/// - {@link api.database.model.constant.EventType} - typy wydarzeń w wątkach
/// - {@link api.database.model.constant.PermissionType} - poziomy uprawnień dostępu
///
/// # Zastosowanie
/// Enumy w tym pakiecie są używane do:
/// - Precyzyjnej identyfikacji błędów
/// - Definiowania typów operacji w systemie
/// - Kontroli przepływu w scenariuszach
/// - Zarządzania uprawnieniami
package api.database.model.constant;
