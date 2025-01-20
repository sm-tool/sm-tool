/// Zawiera repozytoria JPA zarządzające encjami związanymi z obiektami w systemie.
/// Implementuje warstwę dostępu do danych dla modelu obiektowego, wykorzystując natywne zapytania SQL i Spring Data JPA.
///
/// ## Główne komponenty
///
/// - {@link api.database.repository.object.ObjectInstanceRepository} - zarządzanie instancjami obiektów i ich powiązaniami z wątkami
/// - {@link api.database.repository.object.ObjectTemplateRepository} - operacje na szablonach definiujących strukturę obiektów
/// - {@link api.database.repository.object.ObjectTypeRepository} - obsługa hierarchicznej struktury typów obiektów
///
/// ## Kluczowe funkcjonalności
///
/// - Kompleksowe operacje CRUD na obiektach, szablonach i typach
/// - Zarządzanie hierarchią typów obiektów (dziedziczenie)
/// - Obsługa mapowań obiektów na wątki (globalne/lokalne)
/// - Operacje na atrybutach obiektów
/// - Optymalizacja wydajności poprzez natywne zapytania SQL
/// - Walidacja integralności danych i ograniczeń biznesowych
///
/// ## Powiązane encje
///
/// - {@link api.database.entity.object.ObjectInstance} - reprezentacja instancji obiektu
/// - {@link api.database.entity.object.ObjectTemplate} - definicja szablonu obiektu
/// - {@link api.database.entity.object.ObjectType} - typ obiektu w hierarchii
/// - {@link api.database.entity.object.Attribute} - atrybuty obiektów
/// - {@link api.database.entity.thread.ThreadToObject} - mapowania obiektów na wątki
///
/// ## Ważne aspekty implementacyjne
///
/// - Wykorzystanie Common Table Expressions (CTE) dla operacji na hierarchii
/// - Obsługa kaskadowego usuwania powiązanych rekordów
/// - Zarządzanie spójnością danych w kontekście wątków
/// - Optymalizacja wydajności poprzez indeksy i złączenia
/// - Specjalne traktowanie obiektów globalnych (origin_thread_id = 0)
package api.database.repository.object;
