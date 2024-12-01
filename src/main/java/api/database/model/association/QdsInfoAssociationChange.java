package api.database.model.association;

import api.database.model.constant.QdsAssociationOperation;
import jakarta.validation.constraints.NotNull;

public record QdsInfoAssociationChange(
  @NotNull(message = "ASSOCIATION_CHANGE;NULL_VALUE;associationTypeId")
  Integer associationTypeId,
  @NotNull(message = "ASSOCIATION_CHANGE;NULL_VALUE;object1Id")
  Integer object1Id,
  @NotNull(message = "ASSOCIATION_CHANGE;NULL_VALUE;object2Id")
  Integer object2Id,
  @NotNull(message = "ASSOCIATION_CHANGE;NULL_VALUE;associationOperation")
  QdsAssociationOperation associationOperation
) {}
