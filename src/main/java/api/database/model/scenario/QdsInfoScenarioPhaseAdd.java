package api.database.model.scenario;

public record QdsInfoScenarioPhaseAdd(
  String title,
  String description,
  String color,
  Integer startTime,
  Integer endTime
) {}
