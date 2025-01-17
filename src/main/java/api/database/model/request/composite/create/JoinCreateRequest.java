package api.database.model.request.composite.create;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record JoinCreateRequest(
  @Size(min = 1, message = "TOO_LITTLE_THREADS;BRANCHING;1;0")
  List<Integer> threadIdsToJoin,
  @NotNull(message = "NULL_VALUE;BRANCHING;joinTime") Integer joinTime,
  @NotNull(message = "NULL_VALUE;BRANCHING;joinTitle") String joinTitle,
  @NotNull(message = "NULL_VALUE;BRANCHING;joinDescription")
  String joinDescription,
  @NotNull(message = "NULL_VALUE;BRANCHING;threadTitle") String threadTitle,
  @NotNull(message = "NULL_VALUE;BRANCHING;threadDescription")
  String threadDescription
) {}
