package api.database.classes.threads.response;

import java.util.List;

public record ThreadsAndBranching(
  List<QdsThread> threads,
  List<QdsThreadAction> actions,
  List<QdsBranching> branching
) {}
