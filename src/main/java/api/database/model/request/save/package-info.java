/// Pakiet zawierający rekordy reprezentujące żądania zapisu lub aktualizacji głównych
/// elementów systemu. W przeciwieństwie do klasy dedykowanych do CREATE i UPDATE,
/// te rekordy są używane w obu przypadkach, gdy struktura danych jest identyczna.
///
/// # Główne rekordy
/// | Rekord | Zastosowanie |
/// |--------|--------------|
/// | {@link api.database.model.request.save.ObjectTypeSaveRequest} | Tworzenie i aktualizacja typów obiektów |
/// | {@link api.database.model.request.save.ScenarioPhaseSaveRequest} | Zarządzanie fazami scenariusza |
/// | {@link api.database.model.request.save.ScenarioSaveRequest} | Podstawowe dane scenariusza |
///
/// # Charakterystyka
/// - Wszystkie klasy są immutable (rekordy)
/// - Zawierają adnotacje walidacyjne Jakarta Validation
/// - Komunikaty błędów w formacie odpowiednim dla ich mapowania na {@link api.database.model.exception.ApiException} w {@link api.database.controller.exception.GlobalExceptionHandler}
/// - Używane zarówno dla endpointów POST jak i PUT
///
/// # Przykład użycia
/// ```java
/// @PutMapping("/{id}")
/// public ScenarioResponse updateScenario(
///     @PathVariable Integer id,
///     @Valid @RequestBody ScenarioSaveRequest request
/// ) {
///     return scenarioService.updateScenario(id, request);
/// }
/// ```
package api.database.model.request.save;
