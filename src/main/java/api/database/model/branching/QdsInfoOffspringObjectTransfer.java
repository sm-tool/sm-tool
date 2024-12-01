package api.database.model.branching;

import java.util.List;

public record QdsInfoOffspringObjectTransfer(
  Integer id,
  List<Integer> objectIds
) {}
