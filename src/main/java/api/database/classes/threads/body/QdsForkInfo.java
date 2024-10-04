package api.database.classes.threads.body;

public record QdsForkInfo(
  Integer forkedThreadId,
  Integer offspringNumber,
  Integer forkTime,
  String title,
  String description
) {}
