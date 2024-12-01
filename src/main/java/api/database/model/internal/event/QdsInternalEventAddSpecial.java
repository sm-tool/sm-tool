package api.database.model.internal.event;

import api.database.model.constant.QdsEventType;

public record QdsInternalEventAddSpecial(
  Integer threadId,
  QdsEventType eventType,
  Integer time,
  Integer branchingId
) {}
