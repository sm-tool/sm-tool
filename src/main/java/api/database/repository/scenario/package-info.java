/// Pakiet zawiera repozytoria do zarządzania scenariuszami oraz ich powiązaniami w systemie.
/// Implementuje warstwę dostępu do danych dla modułu scenariuszy, wykorzystując Spring Data JPA
/// i natywne zapytania SQL do PostgreSQL.
///
/// # Główne komponenty
/// - {@link api.database.repository.scenario.ScenarioRepository} - zarządzanie scenariuszami
/// - {@link api.database.repository.scenario.ScenarioPhaseRepository} - zarządzanie fazami czasowymi
/// - {@link api.database.repository.scenario.ScenarioToObjectTypeRepository} - powiązania z typami obiektów
/// - {@link api.database.repository.scenario.ScenarioToObjectTemplateRepository} - powiązania z szablonami obiektów
///
/// # Kluczowe funkcjonalności
/// - Zarządzanie pełnym cyklem życia scenariusza
/// - Obsługa faz czasowych definiujących przedziały w scenariuszu
/// - Zarządzanie powiązaniami z typami i szablonami obiektów
/// - Walidacja integralności danych scenariusza
/// - Optymalizacja zapytań poprzez indeksy i złączenia
///
/// # Powiązane encje
/// - {@link api.database.entity.scenario.Scenario} - główna encja scenariusza
/// - {@link api.database.entity.scenario.ScenarioPhase} - fazy czasowe w scenariuszu
/// - {@link api.database.entity.scenario.ScenarioToObjectType} - powiązanie z typami obiektów
/// - {@link api.database.entity.scenario.ScenarioToObjectTemplate} - powiązanie z szablonami
///
/// # Ważne aspekty implementacyjne
/// - Wykorzystanie natywnych zapytań SQL dla złożonych operacji
/// - Kaskadowe usuwanie powiązanych rekordów
/// - Transakcyjność operacji modyfikujących dane
/// - Optymalizacja wydajności poprzez odpowiednią strukturę zapytań
package api.database.repository.scenario;
