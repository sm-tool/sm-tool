package api.database.model.internal.thread;

public record QdsInternalIncorrectJoin(
  Integer joinId,
  Integer inputThreadId,
  Integer outputThreadId
) {}
