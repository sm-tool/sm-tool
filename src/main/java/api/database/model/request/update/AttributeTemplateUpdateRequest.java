package api.database.model.request.update;

import jakarta.validation.constraints.NotNull;

public record AttributeTemplateUpdateRequest(
  /// Nazwa atrybutu (unikalna w ramach szablonu)
  @NotNull(message = "NULL_VALUE;ATTRIBUTE_TEMPLATE;name") String name,
  /// Wartość domyślna
  String defaultValue
) {}
