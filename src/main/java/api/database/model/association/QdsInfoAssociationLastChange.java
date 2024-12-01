package api.database.model.association;

import api.database.model.constant.QdsAssociationOperation;

public record QdsInfoAssociationLastChange(
  Integer object1Id,
  Integer object2Id,
  QdsAssociationOperation operation
) {}
