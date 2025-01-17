package api.database.websocket;

public record EntityDetails(
  String entityName,
  Integer id,
  Integer scenarioId,
  String senderId
) {}
