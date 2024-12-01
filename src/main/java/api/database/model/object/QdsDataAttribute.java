package api.database.model.object;

public record QdsDataAttribute(
  Integer id,
  Integer attributeTemplateId,
  String initialValue
) {}
