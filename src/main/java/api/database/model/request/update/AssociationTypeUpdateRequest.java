package api.database.model.request.update;

import jakarta.validation.constraints.NotNull;

public record AssociationTypeUpdateRequest(
  @NotNull(message = "NULL_VALUE;ASSOCIATION_TYPE;description")
  String description
) {}
