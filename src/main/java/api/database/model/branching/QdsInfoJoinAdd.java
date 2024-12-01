package api.database.model.branching;

import jakarta.validation.constraints.Size;
import java.util.List;

public record QdsInfoJoinAdd(
  @Size(min = 2, message = "BRANCHING;INVALID_PARENT_NUMBER;2")
  List<Integer> threadIdsToJoin,
  Integer joinTime,
  String joinTitle,
  String joinDescription,
  String threadTitle,
  String threadDescription
) {}
