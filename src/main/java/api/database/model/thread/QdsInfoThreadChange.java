package api.database.model.thread;

public record QdsInfoThreadChange(
  Integer threadId,
  String title,
  String description
) {}
