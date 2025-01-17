package api.database.model.request.composite;

import jakarta.validation.constraints.NotNull;

public record PossibleAssociationRequest(
  @NotNull(message = "NULL_VALUE;OBJECT;objectId") Integer objectId,
  @NotNull(message = "NULL_VALUE;OBJECT;threadId") Integer threadId
) {}
