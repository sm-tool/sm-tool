package api.database.model.request.save;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

/// Record reprezentujący dane wymagane do utworzenia lub aktualizacji scenariusza.
/// Scenariusz jest głównym elementem systemu definiującym ramy czasowe i kontekst
/// dla symulowanych zdarzeń i obiektów.
///
/// # Pola
/// - title - tytuł scenariusza
/// - description - szczegółowy opis scenariusza
/// - context - dodatkowy kontekst sytuacyjny
/// - purpose - cel/misja scenariusza
/// - startDate - data i czas rozpoczęcia scenariusza z przesunięciem strefowym
/// - endDate - data i czas zakończenia scenariusza z przesunięciem strefowym
/// - eventDuration - długość pojedynczego wydarzenia w jednostkach czasu
/// - eventUnit - jednostka czasu używana w scenariuszu (np. "min", "h")
///
/// # Walidacja
/// Wszystkie pola są oznaczone jako @NotNull z komunikatami błędów
///
/// # Uwagi
/// - startDate musi być wcześniejsza niż endDate
/// - Daty zawierają informację o strefie czasowej (OffsetDateTime)
public record ScenarioSaveRequest(
  @NotNull(message = "NULL_VALUE;SCENARIO;title") String title,
  @NotNull(message = "NULL_VALUE;SCENARIO;description") String description,
  @NotNull(message = "NULL_VALUE;SCENARIO;context") String context,
  @NotNull(message = "NULL_VALUE;SCENARIO;purpose") String purpose,
  @NotNull(message = "NULL_VALUE;SCENARIO;startDate") OffsetDateTime startDate,
  @NotNull(message = "NULL_VALUE;SCENARIO;endDate") OffsetDateTime endDate,
  @NotNull(message = "NULL_VALUE;SCENARIO;eventDuration") Integer eventDuration,
  @NotNull(message = "NULL_VALUE;SCENARIO;eventUnit") String eventUnit
) {}
