/// Pakiet zawierający DTO (Data Transfer Objects) używane w odpowiedziach API.
/// Modele te reprezentują dane zwracane do klienta i są zoptymalizowane pod kątem
/// konkretnych przypadków użycia.
///
/// # Główne typy odpowiedzi
/// | Kategoria | Klasy |
/// |-----------|--------|
/// | Zmiany | {@link api.database.model.response.AssociationChangeResponse}, {@link api.database.model.response.AttributeChangeResponse}, {@link api.database.model.response.ChangeResponse} |
/// | Obiekty | {@link api.database.model.response.ObjectInstanceResponse}, {@link api.database.model.response.ThreadObjectsResponse} |
/// | Wydarzenia | {@link api.database.model.response.EventResponse}, {@link api.database.model.response.EventStateResponse}, {@link api.database.model.response.EventAttributesStateResponse} |
/// | Wątki | {@link api.database.model.response.ThreadResponse} |
/// | Aktualizacje | {@link api.database.model.response.UpdateListResponse} |
/// | Asocjacje | {@link api.database.model.response.PossibleAssociationResponse} |
///
/// # Charakterystyka modeli
/// - Zawierają tylko dane niezbędne w danym kontekście
/// - Są niemutowalne (immutable)
/// - Nie zawierają logiki biznesowej
/// - Posiadają jasno zdefiniowane mapowania z encji
/// - Optymalizują transfer danych poprzez selekcję pól
///
/// # Przykład użycia w kontrolerze:
/// ```java
/// @GetMapping("/{id}")
/// public EventResponse getEvent(@PathVariable Integer id) {
///     return eventService.getEvent(id);
/// }
/// ```
package api.database.model.response;
