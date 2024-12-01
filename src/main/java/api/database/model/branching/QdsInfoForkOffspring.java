package api.database.model.branching;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

public record QdsInfoForkOffspring(
  String title,
  String description,
  @JsonUnwrapped QdsInfoOffspringObjectTransfer transfer
) {}
