package api.database.model.internal.thread;

import java.util.List;
import java.util.Set;

public record QdsInternalThreadsToRemoveInformation(
  List<QdsInternalIncorrectJoin> joinRemainingInputs,
  Set<Integer> allThreadsToDelete,
  Set<Integer> allBranchingsToDelete
) {}
