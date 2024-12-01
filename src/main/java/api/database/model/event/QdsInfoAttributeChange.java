package api.database.model.event;

import jakarta.validation.constraints.NotNull;

public record QdsInfoAttributeChange(
  @NotNull(message = "ATTRIBUTE_CHANGE;NULL_VALUE;attributeId")
  Integer attributeId,
  @NotNull(message = "ATTRIBUTE_CHANGE;NULL_VALUE;value") String value
) {}
