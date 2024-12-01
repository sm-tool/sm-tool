package api.database.model.internal.association;

import api.database.model.constant.QdsAssociationOperation;

public record QdsInternalAssociationChangeEvent(
  Integer associationTypeId,
  Integer object1Id,
  Integer object2Id,
  Integer eventId,
  QdsAssociationOperation associationOperation
) {}
