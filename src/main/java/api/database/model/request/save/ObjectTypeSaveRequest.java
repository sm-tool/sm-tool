package api.database.model.request.save;

import api.database.controller.exception.GlobalExceptionHandler;
import api.database.model.exception.ApiException;
import jakarta.validation.constraints.NotNull;

/// Record reprezentujący dane wymagane do utworzenia lub aktualizacji typu obiektu.
/// Zawiera wszystkie niezbędne informacje jak tytuł, opis, kolor oraz flagi określające
/// zachowanie obiektów tego typu w systemie.
///
/// # Pola
/// - title - unikalny tytuł typu obiektu
/// - description - opis typu
/// - color - kolor używany do wizualnej reprezentacji obiektów tego typu
/// - isOnlyGlobal - czy obiekty tego typu mogą istnieć tylko w wątku globalnym
/// - canBeUser - czy obiekt może być użytkownikiem
/// - parentId - opcjonalny identyfikator typu nadrzędnego w hierarchii typów
///
/// # Walidacja
/// - Wszystkie pola oprócz parentId są oznaczone jako @NotNull
public record ObjectTypeSaveRequest(
  @NotNull(message = "NULL_VALUE;OBJECT_TYPE;title") String title,
  @NotNull(message = "NULL_VALUE;OBJECT_TYPE;description") String description,
  @NotNull(message = "NULL_VALUE;OBJECT_TYPE;color") String color,
  @NotNull(message = "NULL_VALUE;OBJECT_TYPE;isOnlyGlobal")
  Boolean isOnlyGlobal,
  @NotNull(message = "NULL_VALUE;OBJECT_TYPE;canBeUser") Boolean canBeUser,
  Integer parentId
) {}
