package api.database.model.request.update;

import jakarta.validation.constraints.NotNull;

public record ObjectTemplateUpdateRequest(
  /// Unikalny tytuł szablonu
  @NotNull(message = "NULL_VALUE;OBJECT_TEMPLATE;title") String title,
  /// Opis szablonu
  @NotNull(message = "NULL_VALUE;OBJECT_TEMPLATE;description")
  String description,
  /// Kolor tego szablonu
  @NotNull(message = "NULL_VALUE;OBJECT_TEMPLATE;color") String color
) {}
