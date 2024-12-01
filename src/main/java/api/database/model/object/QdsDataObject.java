package api.database.model.object;

import java.util.List;

public record QdsDataObject(
  Integer id, //ThreadId or objectId
  String name,
  Integer templateId,
  Integer objectTypeId,
  List<QdsDataAttribute> attributes
) {}
