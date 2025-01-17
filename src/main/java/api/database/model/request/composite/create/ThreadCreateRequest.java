package api.database.model.request.composite.create;

import api.database.entity.thread.Thread;
import api.database.model.constant.EventType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/// Reprezentuje żądanie utworzenia nowego wątku w scenariuszu.
/// Wątek rozpoczyna się od wydarzenia typu START w zdefiniowanym czasie początkowym
/// i automatycznie otrzymuje wydarzenie END w następnej jednostce czasu.
///
/// # Pola
/// - `title` - tytuł nowego wątku
/// - `description` - opis nowego wątku
/// - `startTime` - czas rozpoczęcia wątku (pierwszego wydarzenia)
///
/// # Walidacja
/// Wszystkie pola są walidowane:
/// - Żadne pole nie może być null
/// - startTime musi być większy lub równy 0
///
/// # Powiązania
/// - {@link Thread} - encja reprezentująca wątek w bazie danych
/// - {@link EventType} - typ wydarzenia (START/END) generowanego dla wątku
public record ThreadCreateRequest(
  /// Tytuł wątku
  @NotNull(message = "NULL_VALUE;THREAD;title") String title,
  /// Opis wątku
  @NotNull(message = "NULL_VALUE;THREAD;description") String description,
  /// Czas rozpoczęcia wątku
  @NotNull(message = "NULL_VALUE;THREAD;startTime")
  @Min(value = 0, message = "NEGATIVE_TIME;THREAD;startTime")
  Integer startTime
) {}
