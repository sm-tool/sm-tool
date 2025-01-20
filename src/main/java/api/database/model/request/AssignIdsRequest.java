package api.database.model.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

/// Reprezentuje listę identyfikatorów typów lub szablonów obiektów do przypisania do scenariusza.
///
/// # Zastosowanie
/// - Import istniejących typów obiektów do scenariusza
/// - Import istniejących szablonów obiektów do scenariusza
/// - Przypisywanie wielu elementów w jednej operacji
///
/// # Walidacja
/// - Lista identyfikatorów nie może być null
/// - Lista może być pusta (brak elementów do przypisania)
/// - Identyfikatory muszą wskazywać na istniejące elementy
public record AssignIdsRequest(
  @NotNull(message = "NULL_VALUE;SCENARIO;assign") List<Integer> assign
) {}
