package api.database.model.object;

public record QdsDataObjectSimple(
  Integer id,
  Integer scenarioId,
  Integer templateId,
  Integer objectTypeId,
  String name
) {}
