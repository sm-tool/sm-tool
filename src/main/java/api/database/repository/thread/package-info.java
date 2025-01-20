/// Pakiet zawierający repozytoria do zarządzania wątkami i ich powiązaniami w systemie.
/// Implementuje warstwę dostępu do danych dla modelu wątków, wykorzystując Spring Data JPA
/// i natywne zapytania SQL.
///
/// # Główne komponenty
/// - {@link api.database.repository.thread.ThreadRepository} - podstawowe operacje na wątkach
///
/// # Kluczowe funkcjonalności
/// - Zarządzanie hierarchią wątków
/// - Operacje FORK/JOIN między wątkami
/// - Przypisywanie obiektów do wątków
/// - Czyszczenie nieaktualnych wątków i powiązań
///
/// # Ważne aspekty implementacyjne
/// - Wykorzystanie natywnych zapytań SQL dla złożonych operacji
/// - Specjalne traktowanie wątku globalnego (ID=0)
/// - Obsługa kaskadowego usuwania powiązanych danych
/// - Zarządzanie spójnością obiektów w wątkach
/// - Optymalizacja wydajności poprzez indeksy i złączenia
///
/// # Powiązane komponenty
/// - {@link api.database.entity.event.Event} - wydarzenia w wątkach
/// - {@link api.database.entity.thread.Branching} - operacje FORK/JOIN
/// - {@link api.database.entity.scenario.Scenario} - kontekst istnienia wątków
package api.database.repository.thread;
