package api.database.model.request.update;

import jakarta.validation.constraints.NotBlank;

public record ObjectInstanceUpdateRequest(
  @NotBlank(message = "NULL_VALUE;OBJECT_INSTANCE;name") String name
) {}
