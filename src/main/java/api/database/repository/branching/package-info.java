/// Pakiet zawiera komponenty odpowiedzialne za zarządzanie rozgałęzieniami (FORK/JOIN)
/// w scenariuszach, wykorzystując Spring Data JPA i natywne zapytania SQL.
///
/// ## Główne komponenty
/// - `BranchingRepository` - repozytorium zarządzające operacjami CRUD na rozgałęzieniach
///   oraz dostarczające złożone zapytania do analizy przepływu między wątkami
///
/// ## Kluczowe funkcjonalności
/// - Zarządzanie cyklem życia rozgałęzień (FORK/JOIN) w scenariuszach
/// - Śledzenie przepływu obiektów między wątkami w punktach rozgałęzień
/// - Walidacja poprawności transferu obiektów przy operacjach FORK
/// - Obsługa kaskadowego usuwania powiązanych eventów
/// - Optymalizacja zapytań poprzez wykorzystanie Common Table Expressions (CTE)
///
/// ## Powiązane encje
/// - {@link api.database.entity.thread.Branching} - reprezentacja punktu rozgałęzienia
/// - {@link api.database.entity.event.Event} - wydarzenia FORK/JOIN w wątkach
/// - {@link api.database.entity.thread.Thread} - wątki źródłowe i docelowe rozgałęzień
///
/// ## Ważne aspekty implementacyjne
/// - Wykorzystanie natywnych zapytań SQL dla złożonych operacji rekurencyjnych
/// - Obsługa transferu obiektów między wątkami w punktach FORK/JOIN
/// - Zarządzanie spójnością danych przy usuwaniu rozgałęzień
/// - Optymalizacja wydajności poprzez indeksowanie i grupowanie operacji
///
/// ## Przykład użycia
/// ```java
/// @Autowired
/// private BranchingRepository branchingRepository;
///
/// // Pobranie rozgałęzień ze scenariusza
/// List<Integer> branchingIds = branchingRepository.getBranchingIdsForScenario(scenarioId);
///
/// // Analiza stanu obiektów w punktach rozgałęzień
/// List<InternalBranchingRow> branchings = branchingRepository.getBranchingsByIds(branchingIds);
/// ```
package api.database.repository.branching;
