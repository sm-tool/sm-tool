package api.database.classes.threads.body;

public record QdsThreadActionInfo(
  Integer threadId,
  Integer time,
  String description,
  String title
) {}
