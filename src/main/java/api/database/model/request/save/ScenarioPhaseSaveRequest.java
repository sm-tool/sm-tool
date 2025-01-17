package api.database.model.request.save;

import api.database.controller.exception.GlobalExceptionHandler;
import api.database.model.exception.ApiException;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/// Record reprezentujący dane wymagane do utworzenia lub aktualizacji fazy scenariusza.
/// Faza to logiczny okres w scenariuszu zdefiniowany przez przedział czasowy i oznaczony
/// określonym kolorem dla celów wizualizacji.
///
/// # Pola
/// - title - tytuł fazy
/// - description - opis fazy
/// - color - kolor używany do wizualizacji fazy na osi czasu
/// - startTime - czas rozpoczęcia fazy (nieujemny)
/// - endTime - czas zakończenia fazy (nieujemny)
///
/// # Walidacja
/// - Wszystkie pola są wymagane (@NotNull)
/// - startTime i endTime muszą być nieujemne (@Min(0))
public record ScenarioPhaseSaveRequest(
  @NotNull(message = "NULL_VALUE;SCENARIO_PHASE;title") String title,
  @NotNull(message = "NULL_VALUE;SCENARIO_PHASE;description")
  String description,
  @NotNull(message = "NULL_VALUE;SCENARIO_PHASE;color") String color,
  @NotNull(message = "NULL_VALUE;SCENARIO_PHASE;startTime")
  @Min(value = 0, message = "NEGATIVE_TIME;SCENARIO_PHASE;startTime")
  Integer startTime,
  @NotNull(message = "NULL_VALUE;SCENARIO_PHASE;endTime")
  @Min(value = 0, message = "NEGATIVE_TIME;SCENARIO_PHASE;endTime")
  Integer endTime
) {}
