/// Pakiet zawiera repozytoria do zarządzania asocjacjami (powiązaniami) między obiektami w systemie.
/// Implementuje warstwę dostępu do danych dla modelu asocjacji, wykorzystując Spring Data JPA i natywne
/// zapytania SQL.
///
/// # Główne komponenty
/// - {@link api.database.repository.association.AssociationRepository} - podstawowe operacje CRUD na asocjacjach
/// - {@link api.database.repository.association.AssociationTypeRepository} - zarządzanie typami/definicjami asocjacji
/// - {@link api.database.repository.association.AssociationChangeRepository} - śledzenie historii zmian asocjacji
///
/// # Kluczowe funkcjonalności
/// - Zarządzanie pełnym cyklem życia asocjacji
/// - Śledzenie historii zmian w kontekście wydarzeń
/// - Optymalizacja zapytań poprzez natywny SQL
/// - Walidacja integralności powiązań między obiektami
/// - Obsługa hierarchii typów obiektów w asocjacjach
///
/// # Powiązane encje
/// - {@link api.database.entity.association.Association} - reprezentacja asocjacji
/// - {@link api.database.entity.association.AssociationType} - definicja typu asocjacji
/// - {@link api.database.entity.association.AssociationChange} - zmiana stanu asocjacji
///
/// # Ważne aspekty implementacyjne
/// - Wykorzystanie natywnych zapytań SQL dla złożonych operacji
/// - Obsługa kaskadowego usuwania powiązanych rekordów
/// - Zarządzanie spójnością danych w kontekście wątków
/// - Optymalizacja wydajności poprzez indeksy i złączenia
package api.database.repository.association;
