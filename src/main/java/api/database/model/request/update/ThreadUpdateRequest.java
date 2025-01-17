package api.database.model.request.update;

import jakarta.validation.constraints.NotNull;

public record ThreadUpdateRequest(
  @NotNull(message = "NULL_VALUE;THREAD;title") String title,
  @NotNull(message = "NULL_VALUE;THREAD;description") String description
) {}
