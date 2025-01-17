/// Pakiet zawierający struktury danych dla operacji aktualizacji złożonych elementów w systemie.
///
/// # Struktury
/// - {@link api.database.model.request.composite.update.EventUpdateRequest} - aktualizacja wydarzeń wraz ze zmianami atrybutów i asocjacji
/// - {@link api.database.model.request.composite.update.ForkUpdateRequest} - modyfikacja istniejącego rozgałęzienia FORK
/// - {@link api.database.model.request.composite.update.JoinUpdateRequest} - modyfikacja istniejącego rozgałęzienia JOIN
///
/// # Charakterystyka
/// - Zawierają tylko pola podlegające aktualizacji
/// - Zachowują spójność między powiązanymi elementami
/// - Walidują poprawność zmian w kontekście całego systemu
package api.database.model.request.composite.update;
