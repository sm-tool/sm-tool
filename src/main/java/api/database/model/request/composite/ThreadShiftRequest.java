package api.database.model.request.composite;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/// Reprezentuje żądanie przesunięcia wydarzeń w wątku o zadaną liczbę jednostek czasu.
/// Żądanie zawiera:
/// - {@code shift} liczbę jednostek czasu o ile przesunąć wydarzenia
/// - {@code time} czas od którego wydarzenia mają zostać przesunięte
///
/// # Walidacje
/// - shift != null
/// - time >= 0 i time != null
/// - time - shift >= -1 (żeby event nie wylądował na ujemnym czasie)
///
/// # Przesuwanie eventów
/// - Wszystkie wydarzenia po czasie time są przesuwane o shift jednostek
/// - Dodatni shift przesuwa wydarzenia do przodu
/// - Ujemny shift przesuwa wydarzenia do tyłu
/// - Eventy IDLE są automatycznie dostosowywane
/// - Zachowywana jest kolejność wydarzeń
/// - Wydarzenia branching są synchronizowane między wątkami
public record ThreadShiftRequest(
  @NotNull(message = "NULL_VALUE;THREAD;shift") Integer shift,
  @Min(value = 0, message = "NEGATIVE_TIME;EVENT;time")
  @NotNull(message = "NULL_VALUE;EVENT;time")
  Integer time
) {}
