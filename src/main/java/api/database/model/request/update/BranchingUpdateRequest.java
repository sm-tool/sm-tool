package api.database.model.request.update;

import jakarta.validation.constraints.NotNull;

public record BranchingUpdateRequest(
  @NotNull(message = "NULL_VALUE;BRANCHING;title") String title,
  @NotNull(message = "NULL_VALUE;BRANCHING;description") String description
) {}
