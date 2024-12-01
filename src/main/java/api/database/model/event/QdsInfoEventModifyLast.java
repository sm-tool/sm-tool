package api.database.model.event;

import api.database.model.constant.QdsEventType;

public record QdsInfoEventModifyLast(
  Integer eventTime,
  QdsEventType type,
  Integer branchingId
) {}
