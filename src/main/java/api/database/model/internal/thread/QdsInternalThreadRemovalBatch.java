package api.database.model.internal.thread;

import java.util.List;

public record QdsInternalThreadRemovalBatch(
  List<Integer> threadsToDelete,
  List<Integer> joinsToCheck,
  List<Integer> forksToDelete
) {}
